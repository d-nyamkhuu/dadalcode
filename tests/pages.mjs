// Production/static-host smoke test. Browser plugin is unavailable in this
// workspace, so use the same regular Playwright setup as the existing UI tests.
// Start the production preview first, or set APP_URL to the live Pages URL.
import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import {
  browserExecutable,
  screenshotDirectory,
} from "./browser-environment.mjs";

const root = new URL(process.env.APP_URL || "http://127.0.0.1:4173/dadalcode/");
root.search = "";
root.hash = "";
if (!root.pathname.endsWith("/")) root.pathname += "/";
const basePath = root.pathname;
const applicationAsset =
  /\/(?:problems|pyodide|illustrations|fonts|assets)(?:\/|$)|\/favicon(?:\.[^/]+)?$/;
const assetRequests = new Set();
const escapingRequests = new Set();
const failedAssets = new Set();
const consoleErrors = [];
const pageErrors = [];
function isApplicationAsset(url) {
  const parsed = new URL(url);
  return (
    parsed.origin === root.origin && applicationAsset.test(parsed.pathname)
  );
}
function route(slug, tab = "learn") {
  const url = new URL(root);
  url.hash = `/problems/${slug}/${tab}`;
  return url.href;
}
function assertHealthy() {
  assert.deepEqual(
    [...escapingRequests],
    [],
    "Application assets must stay under the deployment base path",
  );
  assert.deepEqual(
    [...failedAssets],
    [],
    "Every requested application asset must load successfully",
  );
  assert.deepEqual(pageErrors, [], "No uncaught page errors");
  assert.deepEqual(consoleErrors, [], "No browser console errors");
}

await mkdir(screenshotDirectory, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: browserExecutable(chromium, process.env.CHROME_PATH),
});
const context = await browser.newContext({
  viewport: { width: 1536, height: 1024 },
});
// Context-level events also observe assets loaded by the dedicated Python worker.
context.on("request", (request) => {
  if (!isApplicationAsset(request.url())) return;
  assetRequests.add(request.url());
  const pathname = new URL(request.url()).pathname;
  if (!pathname.startsWith(basePath)) escapingRequests.add(request.url());
});
context.on("response", (response) => {
  if (isApplicationAsset(response.url()) && response.status() >= 400)
    failedAssets.add(`${response.status()} ${response.url()}`);
});
context.on("requestfailed", (request) => {
  if (isApplicationAsset(request.url()))
    failedAssets.add(
      `${request.failure()?.errorText || "request failed"} ${request.url()}`,
    );
});
const page = await context.newPage();
page.on("pageerror", (error) => pageErrors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
try {
  const response = await page.goto(root.href);
  assert(
    response?.ok(),
    "The deployed index must return a successful response",
  );
  await page
    .getByRole("heading", { name: "Your next breakthrough." })
    .waitFor();
  assert.equal(await page.title(), "DadalCode — Visual Algorithm Practice");
  assert.equal(await page.locator(".problem-table tbody tr").count(), 179);
  assert.equal(
    await page.locator("vite-error-overlay, .page-error, .error").count(),
    0,
  );
  assert(
    (await page.locator("body").innerText()).length > 1000,
    "Catalog contains meaningful rendered content",
  );
  assertHealthy();
  await page.screenshot({
    path: join(screenshotDirectory, "pages-library.png"),
  });

  await page
    .locator(".problem-table")
    .getByRole("link", { name: "Two Sum", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Two Sum", exact: true, level: 1 })
    .waitFor();
  await page
    .getByRole("button", { name: "Play", exact: true })
    .waitFor({ timeout: 60000 });
  assert(
    (await page.locator(".editorial-lesson").innerText()).length > 1000,
    "Lesson and explanation load from static assets",
  );
  assert.match(await page.locator(".step-count").innerText(), /Step 1 of \d+/);
  await page.getByRole("button", { name: "Next step", exact: true }).click();
  assert.match(await page.locator(".step-count").innerText(), /Step 2 of/);
  assert.equal(
    await page.locator("vite-error-overlay, .page-error, .error").count(),
    0,
  );
  assertHealthy();
  await page.screenshot({
    path: join(screenshotDirectory, "pages-walkthrough.png"),
  });

  await page
    .getByRole("navigation", { name: "Learning views" })
    .getByRole("link", { name: "Practice", exact: true })
    .click();
  const editor = page.getByRole("textbox", { name: "Python code editor" });
  await editor.waitFor();
  const solution = await readFile(
    new URL("../public/problems/two-sum/solution.py", import.meta.url),
    "utf8",
  );
  await editor.fill(solution);
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await page
    .getByText("Accepted — all tests passed.", { exact: true })
    .waitFor({ timeout: 60000 });
  assert.equal(await page.locator(".case-result.failed").count(), 0);
  assert(
    (await page.locator(".case-result").count()) >= 5,
    "Python executes the actual authored test suite",
  );
  assertHealthy();
  await page.screenshot({
    path: join(screenshotDirectory, "pages-python-accepted.png"),
  });

  await page.goto(route("house-robber"));
  await page
    .getByRole("heading", { name: "House Robber", exact: true, level: 1 })
    .waitFor();
  await page
    .getByRole("button", { name: "Play", exact: true })
    .waitFor({ timeout: 60000 });
  const illustration = page.locator(".concept-illustration img").first();
  await illustration.scrollIntoViewIfNeeded();
  await illustration.waitFor();
  await page.waitForFunction(() => {
    const image = document.querySelector(".concept-illustration img");
    return (
      image instanceof HTMLImageElement &&
      image.complete &&
      image.naturalWidth > 0
    );
  });
  const illustrationURL = new URL(
    await illustration.getAttribute("src"),
    page.url(),
  );
  assert.equal(illustrationURL.origin, root.origin);
  assert.equal(
    illustrationURL.pathname,
    `${basePath}illustrations/house-robber.webp`,
  );
  assertHealthy();
  await page.screenshot({
    path: join(screenshotDirectory, "pages-illustration.png"),
  });

  // Hash deep links use the same static index; reloading must retain the route.
  await page.goto(route("two-sum", "practice"));
  await page.getByRole("textbox", { name: "Python code editor" }).waitFor();
  const deepLink = page.url();
  const reloadResponse = await page.reload();
  assert(
    reloadResponse?.ok(),
    "Hash deep-link reload must serve the static index",
  );
  await page
    .getByRole("heading", { name: "Two Sum", exact: true, level: 1 })
    .waitFor();
  await page.getByRole("textbox", { name: "Python code editor" }).waitFor();
  assert.equal(page.url(), deepLink);
  assert.equal(new URL(page.url()).pathname, basePath);
  assert.equal(new URL(page.url()).hash, "#/problems/two-sum/practice");
  assert.equal(
    await page.locator("vite-error-overlay, .page-error, .error").count(),
    0,
  );
  assertHealthy();

  for (const directory of ["assets", "problems", "pyodide", "illustrations"])
    assert(
      [...assetRequests].some((url) =>
        new URL(url).pathname.startsWith(`${basePath}${directory}/`),
      ),
      `Smoke test observed a successful ${directory} request under ${basePath}`,
    );
  assert(
    ![...assetRequests].some((url) =>
      /\.(woff2?|ttf|otf)$/.test(new URL(url).pathname),
    ),
    "System fonts require no font download",
  );
  console.log(
    `PASS: production Pages at ${root.href}; 179 catalog entries, lesson, walkthrough, Python acceptance, illustration, hash reload, asset base paths, console`,
  );
} catch (error) {
  await page
    .screenshot({ path: join(screenshotDirectory, "pages-failure.png") })
    .catch(() => {});
  console.error("PAGES SMOKE FAIL", error);
  console.error({
    escapingRequests: [...escapingRequests],
    failedAssets: [...failedAssets],
    consoleErrors,
    pageErrors,
  });
  console.error(
    (
      await page
        .locator("body")
        .innerText()
        .catch(() => "")
    ).slice(-5000),
  );
  process.exitCode = 1;
} finally {
  await browser.close();
}
