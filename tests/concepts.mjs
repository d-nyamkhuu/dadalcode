import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import {
  browserExecutable,
  screenshotDirectory,
} from "./browser-environment.mjs";

// No Browser plugin is available; use the repository's Playwright installation.
const browser = await chromium.launch({
  headless: true,
  executablePath: browserExecutable(chromium, process.env.CHROME_PATH),
});
const context = await browser.newContext({
  viewport: { width: 1536, height: 1024 },
  reducedMotion: "reduce",
});
await context.addInitScript(() => {
  window.conceptWorkerCount = 0;
  const NativeWorker = window.Worker;
  window.Worker = class extends NativeWorker {
    constructor(...args) {
      super(...args);
      window.conceptWorkerCount++;
    }
  };
});
const page = await context.newPage();
const errors = [],
  runtimeRequests = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("request", (request) => {
  if (/pyodide|python-worker/.test(request.url()))
    runtimeRequests.push(request.url());
});
const root = process.env.APP_URL || "http://127.0.0.1:5173";
const catalog = JSON.parse(await readFile("src/data/catalog.json", "utf8"));
await mkdir(screenshotDirectory, { recursive: true });
const capture = process.env.CAPTURE_CONCEPT_REVIEW === "1";
if (capture)
  await mkdir(`${screenshotDirectory}/concept-scenes`, { recursive: true });
async function open(slug) {
  await page.goto(`${root}/#/problems/${slug}/learn`);
  await page.locator(".concept-diagram").waitFor();
  await page
    .locator(".concept-progress")
    .filter({ hasText: "Scene 1 of" })
    .waitFor();
}
async function noClipping(slug, scene) {
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    `${slug}: page width`,
  );
  const clipped = await page
    .locator(".concept-diagram text")
    .evaluateAll((elements) =>
      elements.flatMap((el) => {
        const b = el.getBBox();
        return b.x < -1 ||
          b.y < -1 ||
          b.x + b.width > 721 ||
          b.y + b.height > 401
          ? [el.textContent]
          : [];
      }),
    );
  assert.deepEqual(
    clipped,
    [],
    `${slug}/${scene}: SVG text must remain inside its canvas`,
  );
}
try {
  let sceneCount = 0;
  const families = new Map();
  for (const problem of catalog) {
    const lesson = JSON.parse(
      await readFile(`public/problems/${problem.slug}/lesson.json`, "utf8"),
    );
    const data = JSON.parse(
      await readFile(
        `public/problems/${problem.slug}/explanation.json`,
        "utf8",
      ),
    );
    if (!families.has(lesson.visualization.kind))
      families.set(lesson.visualization.kind, problem.slug);
    await open(problem.slug);
    assert.equal(
      await page
        .locator(
          ".walkthrough, .trace-code, .cm-editor, .provided-python-types, .wt-input-editor",
        )
        .count(),
      0,
      "Learn excludes code and execution",
    );
    assert.equal(
      await page.getByRole("button", { name: "Play", exact: true }).count(),
      0,
    );
    assert.equal(
      await page
        .getByRole("button", { name: "Previous scene", exact: true })
        .isDisabled(),
      true,
    );
    const image = page.locator(".concept-illustration img").first();
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((img) => img.decode());
    assert(await image.evaluate((img) => img.naturalWidth >= 720));
    assert.equal(
      await page.locator(".concept-illustration").count(),
      data.concept.illustrations.length,
    );
    const seenDrawings = new Set();
    for (let i = 0; i < data.concept.scenes.length; i++) {
      await page
        .getByLabel("Choose scene", { exact: true })
        .selectOption(String(i));
      await page
        .locator(".concept-progress")
        .filter({ hasText: `Scene ${i + 1} of` })
        .waitFor();
      assert.equal(
        await page.locator(".concept-narration h3").textContent(),
        data.concept.scenes[i].title,
      );
      assert.equal(
        await page.locator(".concept-narration > p").textContent(),
        data.concept.scenes[i].narration,
      );
      const title = await page.locator(".concept-diagram title").textContent();
      assert(title.length >= 30, "Diagram has an accessible description");
      await noClipping(problem.slug, data.concept.scenes[i].id);
      const composition = capture
        ? await page.locator(".concept-diagram").innerHTML()
        : "";
      if (capture && !seenDrawings.has(composition)) {
        await page.locator(".concept-stage").screenshot({
          path: `${screenshotDirectory}/concept-scenes/${problem.slug}-${i + 1}.png`,
        });
        seenDrawings.add(composition);
      }
      sceneCount++;
    }
    assert.equal(
      await page
        .getByRole("button", { name: "Next scene", exact: true })
        .isDisabled(),
      true,
    );
    await page
      .getByRole("button", { name: "Replay visual story", exact: true })
      .click();
    await page
      .locator(".concept-progress")
      .filter({ hasText: "Scene 1 of" })
      .waitFor();
  }
  assert.equal(
    await page.evaluate(() => window.conceptWorkerCount),
    0,
    "Learn never constructs a Python worker",
  );
  assert.deepEqual(
    runtimeRequests,
    [],
    "Learn never fetches Python runtime files",
  );
  await open("two-sum");
  const player = page.locator(".concept-player");
  await player.focus();
  await page.keyboard.press("ArrowRight");
  await page
    .locator(".concept-progress")
    .filter({ hasText: "Scene 2 of" })
    .waitFor();
  assert.notEqual(
    await player.evaluate((el) => getComputedStyle(el).outlineStyle),
    "none",
  );
  await page.keyboard.press("End");
  await page
    .locator(".concept-progress")
    .filter({ hasText: "Scene 8 of" })
    .waitFor();
  await page.keyboard.press("ArrowLeft");
  await page
    .locator(".concept-progress")
    .filter({ hasText: "Scene 7 of" })
    .waitFor();
  await page.keyboard.press("Home");
  await page
    .locator(".concept-progress")
    .filter({ hasText: "Scene 1 of" })
    .waitFor();
  await page.getByRole("button", { name: "Next scene", exact: true }).click();
  await page
    .getByRole("button", { name: "Previous scene", exact: true })
    .click();
  await page
    .locator(".concept-progress")
    .filter({ hasText: "Scene 1 of" })
    .waitFor();
  await page.getByLabel("Choose scene", { exact: true }).focus();
  await page.keyboard.press("End");
  assert.equal(
    await page.getByLabel("Choose scene").inputValue(),
    "7",
    "Focused scene selector retains native keyboard behavior",
  );
  await player.focus();
  await page.keyboard.press("End");
  await page.evaluate(() => {
    location.hash = "#/problems/coin-change/learn";
  });
  await page
    .getByRole("heading", { name: "Coin Change", exact: true, level: 1 })
    .waitFor();
  await page
    .locator(".concept-progress")
    .filter({ hasText: "Scene 1 of" })
    .waitFor();
  assert.equal(
    await page
      .locator(".concept-stage")
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
    "Reduced motion disables transitions",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "Next scene", exact: true }).click();
  assert.equal(
    await page
      .locator(".concept-stage")
      .evaluate((el) => getComputedStyle(el).animationName),
    "concept-arrive",
  );
  await page.waitForTimeout(300);
  // Every original visualization family receives layout QA at all requested sizes.
  for (const size of [
    { width: 1536, height: 1024 },
    { width: 1280, height: 800 },
    { width: 1280, height: 600 },
  ]) {
    await page.setViewportSize(size);
    for (const [family, slug] of families) {
      await open(slug);
      await page.getByLabel("Choose scene", { exact: true }).selectOption("4");
      await page.waitForTimeout(300);
      await noClipping(slug, family);
      assert(
        await page
          .locator(".lesson-text")
          .evaluate((el) => el.clientWidth > 250),
      );
      await page.screenshot({
        path: `${screenshotDirectory}/concept-${family}-${size.width}x${size.height}.png`,
      });
    }
  }
  await open("reverse-linked-list");
  await page.evaluate(() => {
    location.hash = "#/problems/reverse-linked-list/learn?plan=beginner";
  });
  await page.getByRole("link", { name: /beginner.*study plan/i }).waitFor();
  await page
    .getByRole("link", { name: "Connect this idea to Python →", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Python reference solution" })
    .waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Reference code", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  assert.equal(await page.locator(".walkthrough").count(), 0);
  assert(
    page.url().includes("plan=beginner"),
    "Concept-to-code link preserves the study plan",
  );
  await page.getByRole("region", { name: "Provided Python types" }).waitFor();
  await page
    .getByRole("button", {
      name: "Explore this example in Execution walkthrough →",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Play", exact: true })
    .waitFor({ timeout: 60000 });
  await page
    .getByRole("button", { name: "Reference code", exact: true })
    .click();
  assert.equal(
    await page.locator(".walkthrough").count(),
    0,
    "Reference code closes execution playback",
  );
  await page.getByRole("link", { name: "Learn", exact: true }).click();
  await page.locator(".concept-diagram").waitFor();
  await page.getByRole("link", { name: "Solution", exact: true }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Reference code", exact: true })
      .getAttribute("aria-pressed"),
    "true",
    "Returning to Solution defaults to reference code",
  );
  assert.deepEqual(
    errors,
    [],
    "No rendering, console, or asset-loading errors",
  );
  console.log(
    `PASS: ${catalog.length} conceptual lessons, ${sceneCount} scenes, ${families.size} families at three desktop sizes, replay, keyboard, motion, local artwork, no Python in Learn, Solution views`,
  );
} finally {
  await browser.close();
}
