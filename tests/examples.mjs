import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import {
  browserExecutable,
  screenshotDirectory,
} from "./browser-environment.mjs";

// Browser plugin not available; use the repository's Playwright setup.
const browser = await chromium.launch({
  headless: true,
  executablePath: browserExecutable(chromium, process.env.CHROME_PATH),
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const base = process.env.APP_URL || "http://127.0.0.1:5173";
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
const catalog = JSON.parse(await readFile("src/data/catalog.json", "utf8"));
const packages = await Promise.all(
  catalog.map(async (problem) => ({
    ...problem,
    lesson: JSON.parse(
      await readFile(`public/problems/${problem.slug}/lesson.json`, "utf8"),
    ),
    tests: JSON.parse(
      await readFile(`public/problems/${problem.slug}/tests.json`, "utf8"),
    ),
  })),
);
await mkdir(screenshotDirectory, { recursive: true });
try {
  for (const problem of packages) {
    await page.goto(`${base}/#/problems/${problem.slug}/practice`);
    const example = page.locator(".example");
    await example.waitFor();
    assert.equal(await page.title(), `${problem.title} — DadalCode`);
    assert.equal(await page.locator("vite-error-overlay").count(), 0);
    assert(await example.innerText(), `${problem.slug}: visible content`);
    assert(
      await example.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
      `${problem.slug}: card fits`,
    );
    if (problem.slug === "sudoku-solver") {
      assert.equal(await example.locator(".example-sudoku").count(), 2);
      assert.equal(await example.locator(".example-sudoku td").count(), 162);
      assert.equal(await example.locator(".example-grid-empty").count(), 9);
      assert((await example.innerText()).includes("list[list[str]]"));
      assert((await example.innerText()).includes("returns None"));
      await page.setViewportSize({ width: 1536, height: 1400 });
      await example.scrollIntoViewIfNeeded();
      await example.screenshot({
        path: `${screenshotDirectory}/sudoku-example.png`,
      });
      await page.setViewportSize({ width: 1280, height: 800 });
    }
  }
  const checked = await page.evaluate(async (packages) => {
    const { renderExample, cleanup } =
      await import("/tests/example-rendering.tsx");
    let count = 0;
    const failures = [];
    try {
      for (const problem of packages)
        for (const fixture of problem.tests) {
          const el = renderExample(problem, fixture);
          if (!el.textContent.trim() || el.textContent.includes("undefined"))
            failures.push(`${problem.slug}/${fixture.name}: missing value`);
          const card = el.querySelector(".example");
          if (card.scrollWidth > card.clientWidth + 1)
            failures.push(`${problem.slug}/${fixture.name}: card overflow`);
          count++;
        }
      function check(slug, fixture, inspect) {
        const p = packages.find((p) => p.slug === slug);
        inspect(renderExample(p, fixture));
      }
      check(
        "sudoku-solver",
        packages.find((p) => p.slug === "sudoku-solver").tests[0],
        (el) => {
          const boards = [...el.querySelectorAll(".example-sudoku")];
          if (
            boards.some(
              (b) =>
                b.querySelectorAll("tr").length !== 9 ||
                [...b.querySelectorAll("tr")].some(
                  (r) => r.children.length !== 9,
                ),
            )
          )
            failures.push("Sudoku must keep all 9 rows and columns");
        },
      );
      check(
        "same-tree",
        { input: { p: [1, null, 2, 3], q: [] }, expected: false },
        (el) => {
          const right = el.querySelector(
            ".example-tree > ul > li > ul > li:nth-child(2)",
          );
          if (
            !right?.textContent.includes("Right 2") ||
            !right.textContent.includes("Left 3")
          )
            failures.push("Sparse tree parent links incorrect");
          if (
            !el.textContent.includes("[]") ||
            !el.textContent.includes("False")
          )
            failures.push("Empty list or boolean lost");
        },
      );
      check(
        "pacific-atlantic-water-flow",
        {
          input: {
            heights: [
              [1, 2],
              [3, 4],
            ],
          },
          expected: [
            [0, 1],
            [1, 0],
          ],
        },
        (el) => {
          if (
            el.querySelectorAll(".example-grid").length !== 1 ||
            !el
              .querySelector(".example-result")
              .textContent.includes("Coordinates")
          )
            failures.push("Coordinates incorrectly rendered as a board");
        },
      );
      check(
        "group-anagrams",
        {
          input: { strs: ["", "None", "False"] },
          expected: [[""], ["None"], ["False"]],
        },
        (el) => {
          if (
            !el.textContent.includes('[""]') ||
            !el.textContent.includes('["None"]')
          )
            failures.push("String values lost or confused with None");
        },
      );
      check(
        "find-median-from-data-stream",
        packages.find((p) => p.slug === "find-median-from-data-stream")
          .tests[0],
        (el) => {
          const rows = el.querySelectorAll(".example-result tbody tr");
          if (
            rows.length !==
              packages.find((p) => p.slug === "find-median-from-data-stream")
                .tests[0].expected.length ||
            [...rows].some((r) => r.children.length !== 4)
          )
            failures.push("Operation results not aligned");
        },
      );
    } finally {
      cleanup();
    }
    return { count, failures };
  }, packages);
  assert.deepEqual(checked.failures, []);
  await page.goto(`${base}/#/problems/sudoku-solver/solution`);
  await page.getByRole("button", { name: "Example", exact: true }).click();
  await page.locator(".worked-input .example-sudoku").waitFor();
  assert.equal(
    await page.locator(".worked-output .example-sudoku td").count(),
    81,
  );
  assert(
    (await page.locator(".worked-input").innerText()).includes(
      "list[list[str]]",
    ),
  );
  await page.setViewportSize({ width: 1536, height: 1024 });
  await page.locator(".worked-input").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `${screenshotDirectory}/sudoku-walkthrough.png`,
  });
  assert.deepEqual(errors, []);
  console.log(
    `PASS: ${packages.length} example pages, ${checked.count} fixtures at 320px, Sudoku cells, sparse trees, coordinates, empty/string/boolean values, operation alignment, and solution chapter navigation.`,
  );
} finally {
  await browser.close();
}
