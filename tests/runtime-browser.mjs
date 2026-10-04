// Browser integration checks for the locally bundled Python runtime.
// Start `npm run dev` first, then run `node tests/runtime-browser.mjs`.
import { chromium } from "@playwright/test";
import { browserExecutable } from "./browser-environment.mjs";

const baseURL = process.env.TRAINER_BASE_URL || "http://127.0.0.1:5173";
let browser;
try {
  const executablePath = browserExecutable(
    chromium,
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  );
  browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage();
  page.on("console", (message) => {
    if (message.text().startsWith("[runtime-test]"))
      console.log(message.text());
  });
  // Keep this test independent of the UI's own automatic walkthrough requests.
  await page.goto(`${baseURL}/problems/two-sum/lesson.json`);
  const summary = await page.evaluate(async () => {
    const { catalog, loadProblem } = await import("/src/data/problems.ts");
    const { PythonRunner } = await import("/src/runtime/runner.ts");
    const failures = [];
    let problemCount = 0;
    let fixtureCount = 0;
    let traceCount = 0;
    let recoveryChecks = 0;
    let gradingChecks = 0;
    let worker;

    // Reuse a real Python worker so curriculum validation initializes WASM once.
    // PythonRunner is exercised separately below to cover its cancellation timers.
    function request(problem, cases, trace) {
      worker ??= new Worker(
        new URL("/src/runtime/python.worker.ts", location.origin),
        { type: "module" },
      );
      const activeWorker = worker;
      const id = crypto.randomUUID();
      return new Promise((resolve, reject) => {
        const results = [];
        let caseTimer;
        let suiteTimer;
        const startupTimer = setTimeout(
          () => fail(new Error("Runtime initialization exceeded 60 seconds")),
          60000,
        );
        function clean() {
          clearTimeout(startupTimer);
          clearTimeout(caseTimer);
          clearTimeout(suiteTimer);
          activeWorker.onmessage = null;
          activeWorker.onerror = null;
        }
        function fail(error) {
          clean();
          activeWorker.terminate();
          if (worker === activeWorker) worker = undefined;
          reject(error);
        }
        activeWorker.onerror = (event) =>
          fail(new Error(event.message || "Worker failed"));
        activeWorker.onmessage = (event) => {
          const message = event.data;
          if (message.id !== id) return;
          if (message.type === "ready") {
            clearTimeout(startupTimer);
            suiteTimer = setTimeout(
              () => fail(new Error("Suite exceeded 15 seconds")),
              15000,
            );
          } else if (message.type === "case-start") {
            clearTimeout(caseTimer);
            caseTimer = setTimeout(
              () =>
                fail(new Error(`Case ${message.index + 1} exceeded 3 seconds`)),
              3000,
            );
          } else if (message.type === "case-result") {
            clearTimeout(caseTimer);
            results.push(message.result);
          } else if (message.type === "error") {
            fail(new Error(message.error));
          } else if (message.type === "complete") {
            clean();
            resolve({ cases: results, steps: message.steps || [] });
          }
        };
        activeWorker.postMessage({
          id,
          type: "execute",
          code: problem.solution,
          adapter: problem.adapter,
          cases,
          trace,
          visualization: problem.lesson.visualization,
        });
      });
    }

    try {
      for (const entry of catalog) {
        try {
          const problem = await loadProblem(entry.slug);
          // Walkthroughs have no expected output. This explicitly exercises the
          // evaluateOnly contract for custom answer checkers as the UI does.
          const first = await request(
            problem,
            [{ ...problem.tests[0], expected: null, evaluateOnly: true }],
            true,
          );
          const suite = await request(problem, problem.tests, false);
          const results = suite.cases;
          if (
            first.cases.length !== 1 ||
            first.cases[0].error ||
            !first.cases[0].passed
          )
            failures.push({
              slug: entry.slug,
              error: "Walkthrough evaluation failed",
              result: first.cases[0],
            });
          if (results.length !== problem.tests.length)
            throw new Error("Worker omitted test results");
          fixtureCount += results.length;
          for (const result of results) {
            if (!result.passed)
              failures.push({
                slug: entry.slug,
                case: result.name,
                expected: result.expected,
                actual: result.actual,
                error: result.error,
              });
          }
          if (!first.steps.length)
            failures.push({
              slug: entry.slug,
              error: "First fixture produced no reference trace",
            });
          else {
            traceCount++;
            if (
              !first.steps.some(
                (step) => step.line > 0 && step.variables && step.explanation,
              )
            )
              failures.push({
                slug: entry.slug,
                error: "Trace omitted executable lines or state",
              });
          }
          problemCount++;
          if (problemCount % 30 === 0)
            console.log(
              `[runtime-test] ${problemCount}/${catalog.length} lesson suites checked`,
            );
        } catch (error) {
          failures.push({ slug: entry.slug, error: String(error) });
        }
      }
    } finally {
      worker?.terminate();
    }

    const problem = await loadProblem("two-sum");
    const cases = problem.tests.slice(0, 1);
    const runner = new PythonRunner();
    async function verify(name, action, grading = false) {
      try {
        await action();
        if (grading) gradingChecks++;
        else recoveryChecks++;
      } catch (error) {
        failures.push({ check: name, error: String(error) });
      } finally {
        runner.cancel();
      }
    }
    function assert(condition, message) {
      if (!condition) throw new Error(message);
    }
    async function expectRejection(promise, pattern) {
      try {
        await promise;
      } catch (error) {
        assert(pattern.test(String(error)), `Unexpected rejection: ${error}`);
        return;
      }
      throw new Error("Execution unexpectedly completed");
    }
    const infinite =
      "class Solution:\n    def twoSum(self, nums, target):\n        while True:\n            pass\n";
    await verify("Infinite-loop per-case timeout and recovery", async () => {
      let executionStarted;
      const pending = runner.execute(
        problem,
        infinite,
        cases,
        false,
        (stage) => {
          if (stage.startsWith("Running case"))
            executionStarted = performance.now();
        },
      );
      await expectRejection(pending, /Time limit exceeded.*3 seconds/);
      assert(
        executionStarted !== undefined &&
          performance.now() - executionStarted < 6000,
        "Execution limit did not terminate the active Python worker promptly",
      );
      const recovered = await runner.execute(problem, problem.solution, cases);
      assert(recovered.cases[0].passed, "Reference did not run after timeout");
    });
    await verify("Stop cancellation and recovery", async () => {
      let stopTimer;
      try {
        const pending = runner.execute(
          problem,
          infinite,
          cases,
          false,
          (stage) => {
            if (stage.startsWith("Running case"))
              stopTimer = setTimeout(() => runner.cancel(), 25);
          },
        );
        await expectRejection(pending, /Execution stopped/);
        const recovered = await runner.execute(
          problem,
          problem.solution,
          cases,
        );
        assert(recovered.cases[0].passed, "Reference did not run after Stop");
      } finally {
        clearTimeout(stopTimer);
      }
    });
    await verify("Syntax error with useful diagnostic", async () => {
      const result = await runner.execute(
        problem,
        "class Solution:\n    def twoSum(:\n        pass\n",
        cases,
      );
      assert(
        !result.cases[0].passed &&
          result.cases[0].error.includes("SyntaxError"),
        "Syntax error was not reported in case results",
      );
    });
    await verify("Wrong answer remains unsolved", async () => {
      const result = await runner.execute(
        problem,
        "class Solution:\n    def twoSum(self, nums, target):\n        return []\n",
        cases,
      );
      assert(!result.cases[0].passed, "Incorrect learner result was accepted");
    });
    await verify("Runtime exception retains its message", async () => {
      const result = await runner.execute(
        problem,
        'class Solution:\n    def twoSum(self, nums, target):\n        raise ValueError("runtime diagnostic sentinel")\n',
        cases,
      );
      assert(
        !result.cases[0].passed &&
          result.cases[0].error.includes(
            "ValueError: runtime diagnostic sentinel",
          ),
        "Runtime error diagnostic was lost",
      );
    });
    await verify("Stderr is captured without losing the result", async () => {
      const code =
        "import sys\n" +
        problem.solution.replace(
          /(\n {4}def twoSum[^\n]*:\n)/,
          '$1        print("stderr diagnostic sentinel", file=sys.stderr)\n',
        );
      assert(
        code.includes("print("),
        "Reference signature changed; update stderr injection",
      );
      const result = await runner.execute(problem, code, cases);
      assert(
        result.cases[0].passed &&
          result.cases[0].stdout.includes("stderr diagnostic sentinel"),
        "Stderr or the passing result was lost",
      );
    });
    // Exercise grading contracts after JSON transport and inside real Pyodide.
    // Whole-number floats lose their Python type when encoded through JS.
    async function judge(slug, input, expected, code) {
      const loaded = await loadProblem(slug);
      const result = await runner.execute(loaded, code ?? loaded.solution, [
        { name: "Browser grading regression", input, expected },
      ]);
      return result.cases[0];
    }
    await verify(
      "Integer answers reject nearby floats",
      async () => {
        const result = await judge(
          "climbing-stairs",
          { n: 45 },
          1836311903,
          "class Solution:\n    def climbStairs(self, n):\n        return 1836311803.0\n",
        );
        assert(
          !result.passed && !result.error,
          "Inexact integer answer passed float tolerance",
        );
      },
      true,
    );
    await verify(
      "Sort List supports its 50000-node bound",
      async () => {
        const sorted = Array.from({ length: 50000 }, (_, i) => i + 1);
        const result = await judge(
          "sort-list",
          { head: sorted.slice().reverse() },
          sorted,
        );
        assert(
          result.passed,
          result.error || "Valid large sorted output was rejected",
        );
      },
      true,
    );
    await verify(
      "Factor combinations enforce inner order",
      async () => {
        const result = await judge(
          "factor-combinations",
          { n: 12 },
          [
            [2, 2, 3],
            [2, 6],
            [3, 4],
          ],
          "class Solution:\n    def getFactors(self, n):\n        return [[6, 2], [3, 2, 2], [4, 3]]\n",
        );
        assert(
          !result.passed && !result.error,
          "Descending factor lists passed",
        );
      },
      true,
    );
    await verify(
      "Tree encoding works without class caches",
      async () => {
        const result = await judge(
          "serialize-and-deserialize-binary-tree",
          { root: [1, 2] },
          [1, 2],
          "import copy\nclass Codec:\n    cache = {}\n    def serialize(self, root):\n        key = str(len(self.cache))\n        self.cache[key] = copy.deepcopy(root)\n        return key\n    def deserialize(self, data):\n        return self.cache[data]\n",
        );
        assert(
          !result.passed && result.error?.includes("fresh namespace"),
          "Tree cache token passed independent decoding",
        );
      },
      true,
    );
    await verify(
      "Whole-number median retains float tolerance",
      async () => {
        const result = await judge(
          "median-of-two-sorted-arrays",
          { nums1: [1, 3], nums2: [2] },
          2,
          "class Solution:\n    def findMedianSortedArrays(self, nums1, nums2):\n        return 2.00000005\n",
        );
        assert(
          result.passed,
          result.error || "Whole-number median lost floating tolerance",
        );
      },
      true,
    );
    await verify(
      "Bitwise addition enforces arithmetic restriction",
      async () => {
        const result = await judge(
          "sum-of-two-integers",
          { a: 3, b: 5 },
          8,
          "class Solution:\n    def getSum(self, a, b):\n        return a + b\n",
        );
        assert(
          !result.passed && result.error,
          "Arithmetic-only solution passed",
        );
      },
      true,
    );
    await verify(
      "Sort Colors distinguishes library sort from custom helpers",
      async () => {
        const bad = await judge(
          "sort-colors",
          { nums: [2, 0, 1] },
          [0, 1, 2],
          "class Solution:\n    def sortColors(self, nums):\n        nums.sort()\n",
        );
        assert(
          !bad.passed && bad.error,
          "Library sort passed the teaching restriction",
        );
        const good = await judge(
          "sort-colors",
          { nums: [2, 0, 1] },
          [0, 1, 2],
          "class Solution:\n    def sortColors(self, nums):\n        def sorted(values):\n            return [0] * values.count(0) + [1] * values.count(1) + [2] * values.count(2)\n        nums[:] = sorted(nums)\n",
        );
        assert(
          good.passed,
          good.error || "A valid counting helper was mistaken for library sort",
        );
      },
      true,
    );
    await verify(
      "String encoding works without class caches",
      async () => {
        const result = await judge(
          "encode-and-decode-strings",
          { strs: ["a", "", "b#c"] },
          ["a", "", "b#c"],
          "class Codec:\n    cached = []\n    def encode(self, strs):\n        Codec.cached = strs[:]\n        return 'cached'\n    def decode(self, data):\n        return Codec.cached\n",
        );
        assert(
          !result.passed,
          "String class cache passed independent decoding",
        );
      },
      true,
    );
    return {
      expectedProblems: catalog.length,
      problemCount,
      fixtureCount,
      traceCount,
      recoveryChecks,
      gradingChecks,
      failures,
    };
  });
  for (const failure of summary.failures)
    console.error("FAIL", JSON.stringify(failure));
  console.log(
    `Browser Pyodide: ${summary.problemCount}/${summary.expectedProblems} problems, ${summary.fixtureCount} cases, ${summary.traceCount} traces, ${summary.recoveryChecks}/6 recovery/error checks, ${summary.gradingChecks}/8 grading checks; ${summary.failures.length} failures`,
  );
  if (
    summary.problemCount !== 179 ||
    summary.traceCount !== 179 ||
    summary.recoveryChecks !== 6 ||
    summary.gradingChecks !== 8 ||
    summary.failures.length
  )
    process.exitCode = 1;
} catch (error) {
  console.error("Browser runtime verification failed:", error);
  process.exitCode = 1;
} finally {
  await browser?.close();
}
