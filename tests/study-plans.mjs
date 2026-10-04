import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import {
  browserExecutable,
  screenshotDirectory,
} from "./browser-environment.mjs";

const definitions = JSON.parse(
  await readFile("src/data/study-plans.json", "utf8"),
);
const catalog = JSON.parse(await readFile("src/data/catalog.json", "utf8"));
const bySlug = new Map(catalog.map((p) => [p.slug, p]));
for (const plan of definitions) {
  const slugs = plan.groups.flatMap((group) => group.slugs);
  assert.equal(slugs.length, plan.id === "beginner" ? 68 : 75);
  assert.equal(
    new Set(slugs).size,
    slugs.length,
    "A problem appears once per track",
  );
  assert.equal(new Set(plan.groups.map((g) => g.id)).size, plan.groups.length);
  assert(
    slugs.every((slug) => bySlug.has(slug)),
    "Every plan problem has a local lesson",
  );
}

const browser = await chromium.launch({
  headless: true,
  executablePath: browserExecutable(chromium, process.env.CHROME_PATH),
});
const context = await browser.newContext({
  viewport: { width: 1536, height: 1024 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error" || message.type() === "warning")
    errors.push(message.text());
});
const root = process.env.APP_URL || "http://127.0.0.1:5173";
await mkdir(screenshotDirectory, { recursive: true });

async function seedSolved(slugs) {
  await page.evaluate(async (slugs) => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open("pattern-lab", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const tx = db.transaction("progress", "readwrite");
      for (const slug of slugs)
        tx.objectStore("progress").put({
          slug,
          draft: "# saved draft",
          status: "solved",
          updatedAt: Date.now(),
        });
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }, slugs);
  await page.reload();
  await page.locator(".plan-next").waitFor();
}

try {
  await page.goto(root);
  await page
    .getByRole("heading", { name: "Your next breakthrough." })
    .waitFor();
  assert.equal(await page.locator(".problem-table tbody tr").count(), 179);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Study Plan", exact: true })
    .click();
  await page.locator(".plan-next").waitFor();
  assert.match(page.url(), /#\/study-plan\/beginner$/);
  await page.waitForFunction(
    (title) => document.title === title,
    "Beginner Study Plan — Loopcraft",
  );
  assert.equal(await page.locator(".plan-problems li").count(), 68);
  assert.equal(await page.locator(".plan-stage").count(), 2);
  assert.match(
    await page.getByLabel("Easy stage").innerText(),
    /0 \/ 31 solved/,
  );
  assert.match(
    await page.getByLabel("Medium stage").innerText(),
    /0 \/ 37 solved/,
  );
  assert.equal(
    await page.locator(".plan-next h2").innerText(),
    "Contains Duplicate",
  );
  assert.equal(await page.locator(".plan-group[open]").count(), 1);
  await page.screenshot({
    path: `${screenshotDirectory}/study-plan-beginner.png`,
  });
  await page.getByRole("button", { name: "Expand all groups" }).click();
  assert.equal(await page.locator(".plan-group:not([open])").count(), 0);
  await page.getByRole("button", { name: "Collapse groups" }).click();
  assert.equal(await page.locator(".plan-group[open]").count(), 0);
  const summary = page.locator(".plan-group summary").first();
  await summary.focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(".plan-group[open]").count(), 1);

  await page
    .locator(".plan-next")
    .getByRole("link", { name: "Start plan" })
    .click();
  await page
    .getByRole("heading", { name: "Contains Duplicate", exact: true, level: 1 })
    .waitFor();
  assert.match(page.url(), /contains-duplicate\/learn\?plan=beginner$/);
  assert.equal(
    await page
      .getByRole("link", { name: "Back to study plan", exact: true })
      .count(),
    1,
  );
  assert.equal(await page.locator(".sidebar-label").count(), 11);
  assert.match(
    await page.locator(".sidebar-progress").innerText(),
    /0 of 68 solved/,
  );
  await page
    .getByRole("navigation", { name: "Learning views" })
    .getByRole("link", { name: "Practice", exact: true })
    .click();
  const editor = page.getByRole("textbox", { name: "Python code editor" });
  await editor.waitFor();
  assert.match(page.url(), /practice\?plan=beginner$/);
  await editor.fill(
    await readFile("public/problems/contains-duplicate/solution.py", "utf8"),
  );
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await page
    .getByText("Accepted — all tests passed.", { exact: true })
    .waitFor({ timeout: 60000 });
  await page
    .getByRole("navigation", { name: "Learning views" })
    .getByRole("link", { name: "Solution", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Python reference solution" })
    .waitFor();
  assert.match(page.url(), /solution\?plan=beginner$/);
  await page.getByRole("button", { name: "Try it yourself" }).click();
  await editor.waitFor();
  assert.match(page.url(), /practice\?plan=beginner$/);
  await page
    .getByRole("link", { name: "Back to study plan", exact: true })
    .click();
  await page.locator(".plan-next").waitFor();
  assert.match(
    await page.getByLabel("Beginner plan progress").innerText(),
    /1 \/ 68 solved/,
  );
  assert.equal(await page.locator(".plan-next h2").innerText(), "Two Sum");
  await page.reload();
  await page.locator(".plan-next").waitFor();
  assert.equal(await page.locator(".plan-next h2").innerText(), "Two Sum");

  await page
    .getByRole("navigation", { name: "Study tracks" })
    .getByRole("link", { name: /Experienced/ })
    .click();
  await page.locator(".plan-next").waitFor();
  await page.waitForFunction(
    (title) => document.title === title,
    "Experienced Study Plan — Loopcraft",
  );
  assert.equal(await page.locator(".plan-problems li").count(), 75);
  assert.equal(await page.locator(".plan-stage").count(), 3);
  assert.match(
    await page.getByLabel("Experienced plan progress").innerText(),
    /1 \/ 75 solved/,
  );
  assert.match(
    await page.getByLabel("Hard stage").innerText(),
    /0 \/ 7 solved/,
  );
  await page.screenshot({
    path: `${screenshotDirectory}/study-plan-experienced.png`,
  });

  // Completing all easy problems moves the recommendation into medium groups.
  const experienced = definitions.find((plan) => plan.id === "experienced");
  const experiencedSlugs = experienced.groups.flatMap((group) => group.slugs);
  await seedSolved(
    experiencedSlugs.filter((slug) => bySlug.get(slug).difficulty === "Easy"),
  );
  assert.equal(
    await page.locator(".plan-next h2").innerText(),
    "Group Anagrams",
  );
  assert.match(
    await page.getByLabel("Experienced plan progress").innerText(),
    /19 \/ 75 solved/,
  );
  await page.setViewportSize({ width: 1280, height: 800 });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "No horizontal overflow on desktop",
  );
  await page.screenshot({ path: `${screenshotDirectory}/study-plan-1280.png` });
  await seedSolved(experiencedSlugs);
  assert.equal(
    await page.locator(".plan-next h2").innerText(),
    "You’ve completed the experienced plan.",
  );
  assert.match(
    await page.getByLabel("Experienced plan progress").innerText(),
    /75 \/ 75 solved.*100%/s,
  );
  await page
    .getByRole("link", { name: "Explore all problems", exact: true })
    .click();
  await page.locator(".problem-table").waitFor();
  assert.equal(await page.locator(".problem-table tbody tr").count(), 179);
  await page.goto(`${root}/#/study-plan/invalid`);
  await page.locator(".plan-next").waitFor();
  await page.waitForFunction(
    (title) => document.title === title,
    "Beginner Study Plan — Loopcraft",
  );
  assert.equal(await page.locator("vite-error-overlay").count(), 0);
  assert.deepEqual(errors, [], "No browser errors or warnings");
  console.log(
    "PASS: 68/75 plan membership, stages, group controls, keyboard, plan navigation, real Python submission, shared saved progress, reload, next-stage recommendation, completion, catalog preservation, 1536/1280 desktop, console",
  );
} catch (error) {
  await page.screenshot({
    path: `${screenshotDirectory}/study-plan-failure.png`,
  });
  console.error(error);
  console.error("Browser errors:", errors);
  process.exitCode = 1;
} finally {
  await browser.close();
}
