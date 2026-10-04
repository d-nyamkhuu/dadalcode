import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import {
  browserExecutable,
  screenshotDirectory,
} from "./browser-environment.mjs";
const executablePath = browserExecutable(chromium, process.env.CHROME_PATH);
const browser = await chromium.launch({ headless: true, executablePath });
const context = await browser.newContext({
  viewport: { width: 1536, height: 1024 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const root = process.env.APP_URL || "http://127.0.0.1:5173";
await mkdir(screenshotDirectory, { recursive: true });
try {
  await page.goto(root);
  await page
    .getByRole("heading", { name: "Your next breakthrough." })
    .waitFor();
  assert.equal(await page.locator(".problem-table tbody tr").count(), 179);
  await page.screenshot({ path: `${screenshotDirectory}/library.png` });
  await page
    .getByRole("textbox", { name: "Search problems", exact: true })
    .fill("alien");
  assert.equal(await page.locator(".problem-table tbody tr").count(), 1);
  await page
    .getByRole("textbox", { name: "Search problems", exact: true })
    .fill("");
  await page.getByLabel("Filter by difficulty").selectOption("Hard");
  assert.equal(await page.locator(".problem-table tbody tr").count(), 26);
  await page.getByLabel("Filter by difficulty").selectOption("");
  await page
    .locator(".problem-table")
    .getByRole("link", { name: "Two Sum", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Play", exact: true })
    .waitFor({ timeout: 60000 });
  assert.equal(
    await page.locator(".error").count(),
    0,
    "Trace loads without error",
  );
  await page.getByRole("button", { name: "Next step", exact: true }).click();
  assert.match(await page.locator(".step-count").innerText(), /Step 2 of/);
  await page
    .getByRole("button", { name: "Reset walkthrough", exact: true })
    .click();
  assert.match(await page.locator(".step-count").innerText(), /Step 1 of/);
  await page.locator(".walkthrough").focus();
  await page.keyboard.press("ArrowRight");
  await page.locator(".step-count").filter({ hasText: "Step 2 of" }).waitFor();
  await page.keyboard.press("Home");
  await page.locator(".step-count").filter({ hasText: "Step 1 of" }).waitFor();
  await page.getByLabel("Example input").focus();
  await page.keyboard.press("ArrowRight");
  assert.match(await page.locator(".step-count").innerText(), /Step 1 of/);
  await page
    .getByRole("button", { name: "Every Python line", exact: true })
    .click();
  await page.getByLabel("Algorithm step").fill("8");
  await page.screenshot({ path: `${screenshotDirectory}/learn.png` });
  const separator = page.getByRole("separator");
  await separator.focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await separator.getAttribute("aria-valuenow"), "43");
  await page.getByRole("button", { name: "Collapse sidebar" }).click();
  assert.equal(await page.locator(".sidebar.collapsed").count(), 1);
  await page.getByRole("button", { name: "Expand sidebar" }).click();
  await page
    .getByRole("navigation", { name: "Learning views" })
    .getByRole("link", { name: "Practice", exact: true })
    .click();
  const editor = page.getByRole("textbox", { name: "Python code editor" });
  await editor.waitFor();
  await page.screenshot({ path: `${screenshotDirectory}/practice.png` });
  const solution = await readFile(
    "public/problems/two-sum/solution.py",
    "utf8",
  );
  await editor.fill(solution + "\n# persistent draft\n");
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await page
    .getByText("Accepted — all tests passed.", { exact: true })
    .waitFor({ timeout: 60000 });
  assert.equal(await page.locator(".case-result.failed").count(), 0);
  await page.reload();
  await page.getByRole("textbox", { name: "Python code editor" }).waitFor();
  assert.match(
    await page.getByRole("textbox", { name: "Python code editor" }).innerText(),
    /persistent draft/,
  );
  assert.equal(await page.locator(".solved-badge").count(), 1);
  await page.getByRole("button", { name: "Custom", exact: true }).click();
  await page
    .getByLabel("Input", { exact: false })
    .fill('{"nums":[8,2,5],"target":7}');
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await page
    .getByText("Test passed.", { exact: true })
    .waitFor({ timeout: 60000 });
  await page
    .getByRole("navigation", { name: "Learning views" })
    .getByRole("link", { name: "Solution", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Python reference solution" })
    .waitFor();
  await page.screenshot({ path: `${screenshotDirectory}/solution.png` });
  for (const slug of [
    "add-two-numbers",
    "same-tree",
    "number-of-islands",
    "climbing-stairs",
    "design-search-autocomplete-system",
    "n-queens",
  ]) {
    await page.goto(`${root}/#/problems/${slug}/learn`);
    await page
      .getByRole("button", { name: "Play", exact: true })
      .waitFor({ timeout: 60000 });
    assert.equal(
      await page.locator(".error").count(),
      0,
      `${slug} trace succeeds`,
    );
  }
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${root}/#/problems/two-sum/learn`);
  await page
    .getByRole("button", { name: "Play", exact: true })
    .waitFor({ timeout: 60000 });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "No horizontal page overflow at1280",
  );
  await page.screenshot({ path: `${screenshotDirectory}/desktop-1280.png` });
  assert.deepEqual(errors, [], "No uncaught browser errors");
  console.log(
    "PASS:179 catalog,filters,trace playback,resizing,sidebar,Python submission,custom input,persistence,7structure families,1536/1280 desktop,console",
  );
} catch (error) {
  await page.screenshot({ path: `${screenshotDirectory}/failure.png` });
  console.error("UI FAIL", error);
  console.error("Page errors:", errors);
  console.error((await page.locator("body").innerText()).slice(-5000));
  process.exitCode = 1;
} finally {
  await browser.close();
}
