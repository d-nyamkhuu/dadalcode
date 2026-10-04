import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import {
  browserExecutable,
  screenshotDirectory,
} from "./browser-environment.mjs";

// Browser plugin not available in this session; use the repository's Playwright setup.
const browser = await chromium.launch({
  headless: true,
  executablePath: browserExecutable(chromium, process.env.CHROME_PATH),
});
const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
const root = process.env.APP_URL || "http://127.0.0.1:5173";
const catalog = JSON.parse(await readFile("src/data/catalog.json", "utf8"));
const illustrated = [];
await mkdir(screenshotDirectory, { recursive: true });

async function open(slug, mode = "solution") {
  await page.goto(`${root}/#/problems/${slug}/${mode}`);
  await page.locator(".key-decision").waitFor();
  assert.equal(await page.locator("vite-error-overlay").count(), 0);
}
async function fits() {
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Page must fit the viewport",
  );
  const overflowing = await page
    .locator(".lesson-figure, .figure-panel, .figure-row, .figure-cell")
    .evaluateAll((elements) =>
      elements
        .filter((el) => el.scrollWidth > el.clientWidth + 1)
        .map((el) => el.className),
    );
  assert.deepEqual(
    overflowing,
    [],
    "Static figures must fit without horizontal scrolling",
  );
}

try {
  for (const problem of catalog) {
    await open(problem.slug);
    assert.equal(await page.title(), `${problem.title} — DadalCode`);
    assert(
      await page
        .getByRole("heading", { name: "The main idea", exact: true })
        .isVisible(),
    );
    const data = JSON.parse(
      await readFile(
        `public/problems/${problem.slug}/explanation.json`,
        "utf8",
      ),
    );
    assert.equal(
      await page.locator(".lesson-figure").count(),
      data.figures?.length ?? 0,
    );
    if (data.figures?.length) {
      illustrated.push(problem.slug);
      assert.equal(
        await page.locator(".figure-panel").count(),
        data.figures.reduce((total, figure) => total + figure.panels.length, 0),
      );
      await fits();
    }
  }
  await open("two-sum", "learn");
  await page.locator(".lesson-vocabulary summary").focus();
  await page.keyboard.press("Enter");
  assert(
    await page
      .locator(".lesson-vocabulary dt")
      .filter({ hasText: "Complement" })
      .isVisible(),
  );
  await page.locator(".lesson-vocabulary summary").click();
  await page.getByRole("button", { name: "Example", exact: true }).click();
  assert(
    await page
      .getByRole("heading", { name: "Example walkthrough", exact: true })
      .isVisible(),
  );
  await page
    .getByRole("navigation", { name: "Learning views" })
    .getByRole("link", { name: "Practice", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Constraints", exact: true })
    .waitFor();
  assert.equal(
    await page
      .locator(".lesson-figure, .key-decision, .lesson-vocabulary")
      .count(),
    0,
    "Practice should not reveal the solution guide",
  );

  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 1280, height: 600 },
  ]) {
    await page.setViewportSize(viewport);
    for (const slug of illustrated) {
      await open(slug);
      await fits();
      assert(
        await page
          .locator(".lesson-text")
          .evaluate((el) => el.clientWidth > 250),
        "Lesson text should remain wide enough to read",
      );
    }
  }
  await open("house-robber");
  await page.getByRole("button", { name: "Example", exact: true }).click();
  await page.locator(".lesson-figure").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `${screenshotDirectory}/learning-short-desktop.png`,
  });
  await page.setViewportSize({ width: 1536, height: 1024 });
  await open("median-of-two-sorted-arrays");
  await page.getByRole("button", { name: "Example", exact: true }).click();
  await page.locator(".lesson-figure").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `${screenshotDirectory}/learning-desktop.png`,
  });
  assert.deepEqual(errors, [], "No app or console errors");
  console.log(
    `PASS: ${catalog.length} lesson guides, ${illustrated.length} static figures at 1536/1280 desktop, keyboard vocabulary toggle, chapter navigation, practice isolation, console`,
  );
} finally {
  await browser.close();
}
