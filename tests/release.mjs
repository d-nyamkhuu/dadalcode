import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  browserExecutable,
  screenshotDirectory,
} from "./browser-environment.mjs";
const root = process.env.APP_URL || "http://127.0.0.1:4175/blind-75/";
const browser = await chromium.launch({
  headless: true,
  executablePath: browserExecutable(chromium, process.env.CHROME_PATH),
});
const editor = (page) =>
  page.getByRole("textbox", { name: "Python code editor" });
const saved = (page) =>
  page
    .locator(".draft-status")
    .getByText("Saved locally", { exact: true })
    .waitFor();
async function library(page) {
  await page.goto(root);
  await page
    .getByRole("heading", { name: "Your next breakthrough." })
    .waitFor();
}
async function practice(page, slug) {
  await page.goto(`${root}#/problems/${slug}/practice`);
  await editor(page).waitFor();
  await saved(page);
}
await mkdir(screenshotDirectory, { recursive: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const a = await context.newPage(),
    b = await context.newPage();
  const errors = [];
  const fonts = [];
  for (const page of [a, b]) {
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (/\.(woff2?|ttf|otf)(\?|$)/.test(r.url())) fonts.push(r.url());
    });
  }
  await library(a);
  await library(b);
  await practice(a, "contains-duplicate");
  const draftA = "# important draft in tab A\nclass Solution:\n    pass\n";
  await editor(a).fill(draftA);
  await saved(a);
  // Hash navigation keeps B's original application state, reproducing the old data-loss bug.
  await b
    .locator(".problem-table")
    .getByRole("link", { name: "Contains Duplicate", exact: true })
    .click();
  await b
    .getByRole("heading", { name: "Contains Duplicate", exact: true, level: 1 })
    .waitFor();
  await b
    .getByRole("navigation", { name: "Learning views" })
    .getByRole("link", { name: "Practice", exact: true })
    .click();
  await editor(b).waitFor();
  await saved(b);
  assert.match(await editor(b).innerText(), /important draft in tab A/);
  // Both editors now share one revision. A writes first; B must not overwrite it.
  await editor(a).fill(draftA + "# latest A\n");
  await saved(a);
  await editor(b).fill("# conflicting B draft\n");
  await b
    .getByText(
      "Another tab saved a newer version. Your draft has been kept here.",
      { exact: true },
    )
    .waitFor();
  assert.match(await editor(b).innerText(), /conflicting B/);
  const downloadPromise = b.waitForEvent("download");
  await b.getByRole("button", { name: "Download draft", exact: true }).click();
  const draftDownload = await downloadPromise;
  assert.match(
    await readFile(await draftDownload.path(), "utf8"),
    /conflicting B/,
  );
  await b.getByRole("link", { name: "Loopcraft home" }).click();
  await b
    .locator(".problem-table")
    .getByRole("link", { name: "Contains Duplicate", exact: true })
    .click();
  await b
    .getByRole("button", { name: "Discard mine and load saved draft" })
    .waitFor();
  await b
    .getByRole("navigation", { name: "Learning views" })
    .getByRole("link", { name: "Practice", exact: true })
    .click();
  await editor(b).waitFor();
  assert.match(await editor(b).innerText(), /conflicting B/);
  await a.reload();
  await editor(a).waitFor();
  await saved(a);
  assert.match(await editor(a).innerText(), /latest A/);
  await b
    .getByRole("button", { name: "Discard mine and load saved draft" })
    .click();
  await saved(b);
  assert.match(await editor(b).innerText(), /latest A/);
  await editor(a).fill("# next version A\n");
  await saved(a);
  await editor(b).fill("# keep this version B\n");
  await b
    .getByRole("button", { name: "Replace saved draft with mine" })
    .click();
  await saved(b);
  await a.reload();
  await editor(a).waitFor();
  await saved(a);
  assert.match(await editor(a).innerText(), /keep this version B/);
  await a.getByRole("button", { name: "Your progress", exact: true }).click();
  const backupPromise = a.waitForEvent("download");
  await a.getByRole("button", { name: "Export saved progress" }).click();
  const backupDownload = await backupPromise,
    backupPath = await backupDownload.path();
  const backup = JSON.parse(await readFile(backupPath, "utf8"));
  assert.equal(backup.format, "loopcraft-progress");
  assert.match(backup.entries[0].draft, /keep this version B/);
  const other = await browser.newContext({
      viewport: { width: 1536, height: 1024 },
    }),
    c = await other.newPage();
  await library(c);
  await c.getByRole("button", { name: "Your progress", exact: true }).click();
  await c.getByLabel("Import progress backup").setInputFiles(backupPath);
  await c
    .getByRole("status")
    .filter({ hasText: "Imported 1 problems" })
    .waitFor();
  await c.getByRole("button", { name: "Close", exact: true }).click();
  await practice(c, "contains-duplicate");
  assert.match(await editor(c).innerText(), /keep this version B/);
  await editor(c).fill("# preserve existing during import\n");
  await saved(c);
  await c.getByRole("button", { name: "Your progress", exact: true }).click();
  await c.getByLabel("Import progress backup").setInputFiles(backupPath);
  await c
    .getByRole("status")
    .filter({ hasText: "Imported 0 problems. Kept 1" })
    .waitFor();
  const invalid = join(screenshotDirectory, "invalid-backup.json");
  await writeFile(
    invalid,
    JSON.stringify({
      ...backup,
      entries: [
        ...backup.entries,
        { slug: "unknown", draft: "oops", status: "started", updatedAt: 0 },
      ],
    }),
  );
  await c.getByLabel("Import progress backup").setInputFiles(invalid);
  await c.getByRole("status").filter({ hasText: "invalid" }).waitFor();
  await c.getByRole("button", { name: "Close", exact: true }).click();
  await c.reload();
  await editor(c).waitFor();
  assert.match(await editor(c).innerText(), /preserve existing/);
  const solution = await readFile(
    "public/problems/contains-duplicate/solution.py",
    "utf8",
  );
  await editor(c).fill(solution + "\nimport time\ntime.sleep(0.2)\n");
  await saved(c);
  await c.getByRole("button", { name: "Submit", exact: true }).click();
  await editor(c).fill(solution + "\n# edited while submission was running\n");
  await c
    .getByText("Accepted — all tests passed.", { exact: true })
    .waitFor({ timeout: 60000 });
  await saved(c);
  await c.reload();
  await editor(c).waitFor();
  assert.match(
    await editor(c).innerText(),
    /edited while submission was running/,
  );
  await c.screenshot({
    path: join(screenshotDirectory, "release-desktop.png"),
  });
  const notices = await c.request.get(`${root}third-party-licenses.txt`);
  assert(notices.ok());
  const licenseText = await notices.text();
  for (const name of [
    "MIT License",
    "Attribution–NonCommercial",
    "react@",
    "codemirror@",
    "pyodide@",
    "PYTHON SOFTWARE FOUNDATION",
  ])
    assert(licenseText.includes(name), `Missing notice ${name}`);
  await c.goto(`${root}credits.html`);
  await c
    .getByRole("heading", { name: "Credits and licenses", exact: true })
    .waitFor();
  assert.equal(fonts.length, 0, "No web fonts should be downloaded");
  assert.deepEqual(errors, []);
  // A fresh context guarantees the editor chunk is not already cached.
  const failing = await browser.newContext(),
    failure = await failing.newPage();
  const expectedErrors = [];
  failure.on("pageerror", (e) => expectedErrors.push(e.message));
  await failure.route("**/assets/CodeEditor-*.js", (r) => r.abort("failed"));
  await failure.goto(`${root}#/problems/two-sum/practice`);
  await failure
    .getByRole("heading", { name: "This view could not load" })
    .waitFor();
  assert(
    await failure.getByRole("button", { name: "Reload page" }).isVisible(),
  );
  assert(
    await failure.getByRole("button", { name: "Download draft" }).isVisible(),
  );
  assert(
    await failure.getByRole("link", { name: "Loopcraft home" }).isVisible(),
  );
  assert(
    expectedErrors.every((e) => e.includes("dynamically imported module")),
  );
  await failure.screenshot({
    path: join(screenshotDirectory, "release-error-recovery.png"),
  });
  await failure.unroute("**/assets/CodeEditor-*.js");
  await failure.getByRole("button", { name: "Reload page" }).click();
  await editor(failure).waitFor();
  console.log(
    "PASS: stale-tab initialization, conflicting edits and both resolutions, draft download, backup round trip, non-destructive/invalid import, runtime licenses, system fonts, editor download failure and recovery, desktop UI",
  );
} finally {
  await browser.close();
}
