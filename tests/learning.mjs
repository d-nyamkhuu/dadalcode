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
const pythonTypes = JSON.parse(
  await readFile("src/data/pythonTypes.json", "utf8"),
);
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
    const contract = pythonTypes.problems[problem.slug];
    const suppliedTypes = page.getByRole("region", {
      name: "Provided Python types",
    });
    assert.equal(await suppliedTypes.count(), contract ? 1 : 0);
    if (contract) {
      assert.equal(
        await suppliedTypes.locator("pre code").textContent(),
        pythonTypes.types[contract.type].code,
      );
      assert.match(
        await suppliedTypes.innerText(),
        /without defining or importing/,
      );
    }
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
  await page.getByRole("button", { name: "Example", exact: true }).click();
  assert(
    await page
      .getByRole("heading", { name: "Explore this example", exact: true })
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

  // The flow under test is: open a node problem -> change learning views ->
  // keep its supplied class and input contract visible, including saved drafts.
  await open("swap-nodes-in-pairs", "learn");
  const suppliedTypes = page.getByRole("region", {
    name: "Provided Python types",
  });
  for (const mode of ["Practice", "Solution", "Learn", "Practice"]) {
    await page
      .getByRole("navigation", { name: "Learning views" })
      .getByRole("link", { name: mode, exact: true })
      .click();
    if (mode === "Learn") {
      await page.locator(".concept-diagram").waitFor();
      assert.equal(await suppliedTypes.count(), 0);
      continue;
    }
    await suppliedTypes.waitFor();
    assert.match(await suppliedTypes.innerText(), /ListNode\(0, head\)/);
    assert.match(
      await suppliedTypes.innerText(),
      /head.*argument is the first ListNode/,
    );
  }
  const editor = page.getByRole("textbox", { name: "Python code editor" });
  const swapSolution = await readFile(
    "public/problems/swap-nodes-in-pairs/solution.py",
    "utf8",
  );
  await editor.fill(swapSolution + "\n# Keep my saved draft\n");
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await page
    .getByText("Accepted — all tests passed.", { exact: true })
    .waitFor({ timeout: 60000 });
  await page.reload();
  await editor.waitFor();
  assert.match(await editor.innerText(), /Keep my saved draft/);
  await suppliedTypes.waitFor();
  await suppliedTypes.scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `${screenshotDirectory}/provided-python-types-desktop.png`,
  });

  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 1280, height: 600 },
  ]) {
    await page.setViewportSize(viewport);
    for (const slug of [
      "swap-nodes-in-pairs",
      "construct-binary-tree-from-preorder-and-inorder-traversal",
      "clone-graph",
    ]) {
      await open(slug);
      await fits();
      await page
        .getByRole("region", { name: "Provided Python types" })
        .scrollIntoViewIfNeeded();
      assert.equal(
        await page
          .locator(".provided-python-types pre")
          .evaluate((el) => el.scrollWidth <= el.clientWidth),
        true,
      );
    }
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
