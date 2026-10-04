import { useRef, useState, useEffect, lazy, Suspense } from "react";
import {
  Play,
  Send,
  Square,
  RotateCcw,
  CheckCircle2,
  XCircle,
  LoaderCircle,
  Terminal,
} from "lucide-react";
import type {
  ProblemDefinition,
  Progress,
  RunResult,
  TestCase,
} from "../types";
import { PythonRunner } from "../runtime/runner";
const CodeEditor = lazy(() => import("./CodeEditor"));
export default function Practice({
  problem,
  draft,
  onDraft,
  onResult,
}: {
  problem: ProblemDefinition;
  draft: string;
  onDraft: (draft: string) => void;
  onResult: (passed: number, total: number) => void;
}) {
  const [selected, setSelected] = useState(0),
    [custom, setCustom] = useState(
      JSON.stringify(problem.tests[0].input, null, 2),
    ),
    [result, setResult] = useState<RunResult | null>(null),
    [outputTab, setOutputTab] = useState("tests"),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState("Ready to run."),
    [error, setError] = useState(""),
    [confirmReset, setConfirmReset] = useState(false);
  const runner = useRef(new PythonRunner()),
    generation = useRef(0);
  useEffect(
    () => () => {
      generation.current++;
      runner.current.cancel();
    },
    [],
  );
  const stop = () => {
    generation.current++;
    runner.current.cancel();
    setBusy(false);
    setStatus("Execution stopped.");
  };
  async function execute(submit: boolean) {
    const token = ++generation.current;
    setBusy(true);
    setError("");
    setOutputTab("results");
    setResult(null);
    try {
      let cases: TestCase[];
      if (submit) cases = problem.tests;
      else if (selected < 2) cases = [problem.tests[selected]];
      else {
        const input = JSON.parse(custom);
        if (!input || Array.isArray(input) || typeof input !== "object")
          throw new Error("Enter a JSON object matching the sample input.");
        const oracle = await runner.current.execute(
          problem,
          problem.solution,
          [{ name: "Custom input", input, expected: null, evaluateOnly: true }],
          false,
          setStatus,
        );
        if (token !== generation.current) return;
        if (oracle.cases[0].error)
          throw new Error(
            "Input does not match the problem contract.\n" +
              oracle.cases[0].error,
          );
        cases = [
          { name: "Custom input", input, expected: oracle.cases[0].actual },
        ];
      }
      const out = await runner.current.execute(
        problem,
        draft,
        cases,
        false,
        setStatus,
      );
      if (token !== generation.current) return;
      setResult(out);
      const passed = out.cases.filter((c) => c.passed).length;
      setStatus(
        passed === cases.length
          ? submit
            ? "Accepted — all tests passed."
            : "Test passed."
          : `${passed} of ${cases.length} tests passed.`,
      );
      if (submit) onResult(passed, cases.length);
    } catch (err) {
      if (token === generation.current) {
        setError(err instanceof Error ? err.message : String(err));
        setStatus("Execution did not complete.");
      }
    } finally {
      if (token === generation.current) setBusy(false);
    }
  }
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!busy) execute(e.shiftKey);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });
  return (
    <div className="practice-workbench">
      <section className="editor-panel panel">
        <div className="editor-toolbar">
          <span>Python 3</span>
          {confirmReset ? (
            <div className="confirm-reset">
              <span>Discard your changes?</span>
              <button
                onClick={() => {
                  onDraft(problem.starter);
                  setConfirmReset(false);
                }}
              >
                Reset
              </button>
              <button onClick={() => setConfirmReset(false)}>Keep code</button>
            </div>
          ) : (
            <button className="subtle" onClick={() => setConfirmReset(true)}>
              <RotateCcw size={14} />
              Reset code
            </button>
          )}
        </div>
        <Suspense fallback={<div className="loading">Loading editor…</div>}>
          <CodeEditor value={draft} onChange={onDraft} />
        </Suspense>
        <div className="editor-actions">
          <span className="keyboard-hint">Ctrl / ⌘ + Enter to run</span>
          {busy ? (
            <button onClick={stop}>
              <Square size={15} />
              Stop
            </button>
          ) : (
            <>
              <button onClick={() => execute(false)}>
                <Play size={15} />
                Run
              </button>
              <button className="primary" onClick={() => execute(true)}>
                <Send size={14} />
                Submit
              </button>
            </>
          )}
        </div>
      </section>
      <section className="test-panel panel">
        <div className="small-tabs">
          <button
            className={outputTab === "tests" ? "active" : ""}
            onClick={() => setOutputTab("tests")}
          >
            Test cases
          </button>
          <button
            className={outputTab === "results" ? "active" : ""}
            onClick={() => setOutputTab("results")}
          >
            Results{" "}
            {result && (
              <span className="result-count">
                {result.cases.filter((c) => c.passed).length}/
                {result.cases.length}
              </span>
            )}
          </button>
        </div>
        {outputTab === "tests" ? (
          <div className="test-input">
            <div className="case-tabs">
              {["Case 1", "Case 2", "Custom"].map((label, i) => (
                <button
                  key={label}
                  className={selected === i ? "selected" : ""}
                  onClick={() => setSelected(i)}
                >
                  {label}
                </button>
              ))}
            </div>
            <label htmlFor="practice-input">
              Input{" "}
              <span>
                {selected < 2
                  ? problem.tests[selected].name
                  : "Use the same fields as the examples"}
              </span>
            </label>
            <textarea
              id="practice-input"
              spellCheck={false}
              rows={7}
              readOnly={selected < 2}
              value={
                selected < 2
                  ? JSON.stringify(problem.tests[selected].input, null, 2)
                  : custom
              }
              onChange={(e) => setCustom(e.target.value)}
            />
            {selected < 2 && (
              <div className="expected-output">
                <span>Expected</span>
                <code>{JSON.stringify(problem.tests[selected].expected)}</code>
              </div>
            )}
          </div>
        ) : (
          <div className="results" aria-live="polite">
            {busy && (
              <div className="running">
                <LoaderCircle size={19} className="spin" />
                {status}
              </div>
            )}
            {error && (
              <pre className="error" role="alert">
                {error}
              </pre>
            )}
            {result?.cases.map((test, i) => (
              <details
                className={`case-result ${test.passed ? "passed" : "failed"}`}
                key={i}
                open={!test.passed || result.cases.length === 1}
              >
                <summary>
                  {test.passed ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <XCircle size={17} />
                  )}
                  <span>{test.name}</span>
                  <strong>{test.passed ? "Passed" : "Failed"}</strong>
                  <small>{test.duration.toFixed(1)} ms</small>
                </summary>
                <div className="result-details">
                  <label>Input</label>
                  <pre>{JSON.stringify(test.input, null, 2)}</pre>
                  <div className="output-comparison">
                    <div>
                      <label>Expected</label>
                      <pre>{JSON.stringify(test.expected, null, 2)}</pre>
                    </div>
                    <div>
                      <label>Your output</label>
                      <pre>{JSON.stringify(test.actual, null, 2)}</pre>
                    </div>
                  </div>
                  {test.error && <pre className="error">{test.error}</pre>}
                  {test.stdout && (
                    <>
                      <label>Console output</label>
                      <pre>{test.stdout}</pre>
                    </>
                  )}
                </div>
              </details>
            ))}
            {!result && !error && !busy && (
              <div className="empty-results">
                <Terminal size={24} />
                <p>Run your code to see test results.</p>
              </div>
            )}
          </div>
        )}
        <div
          className={`run-status ${result?.cases.every((c) => c.passed) ? "success" : ""}`}
        >
          {busy ? (
            <LoaderCircle size={15} className="spin" />
          ) : (
            <Terminal size={15} />
          )}
          <span>{status}</span>
        </div>
      </section>
    </div>
  );
}
