import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import {
  browserExecutable,
  screenshotDirectory,
} from "./browser-environment.mjs";
const fullCoverage = process.env.BROWSER_COVERAGE === "full";
const browser = await chromium.launch({
  headless: true,
  executablePath: browserExecutable(chromium, process.env.CHROME_PATH),
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const root = process.env.APP_URL || "http://127.0.0.1:5173";
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
await mkdir(screenshotDirectory, { recursive: true });
async function open(slug) {
  await page.goto(`${root}/#/problems/${slug}/solution`);
  await page
    .getByRole("button", { name: "Execution walkthrough", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Play", exact: true })
    .waitFor({ timeout: 60000 });
  assert.equal(await page.locator(".error").count(), 0, `${slug} trace loads`);
  assert.equal(await page.locator(".vite-error-overlay").count(), 0);
  await page
    .getByRole("button", { name: "Reset walkthrough", exact: true })
    .click();
}
async function fitted(label) {
  await page.waitForFunction(() => {
    const surface = document.querySelector(".vv-viewport"),
      frame = document.querySelector(".vv-scaled");
    const canvas = document.querySelector(".vv-canvas");
    if (!surface || !frame || !canvas) return false;
    const expected = Math.min(
      1,
      (surface.clientWidth - 24) /
        Math.max(canvas.offsetWidth, canvas.scrollWidth),
      (surface.clientHeight - 24) /
        Math.max(canvas.offsetHeight, canvas.scrollHeight),
    );
    const actual = new DOMMatrix(getComputedStyle(canvas).transform).a;
    if (Math.abs(expected - actual) > 0.002) return false;
    const a = surface.getBoundingClientRect(),
      b = frame.getBoundingClientRect();
    return (
      b.width > 0 &&
      b.height > 0 &&
      b.left >= a.left - 1 &&
      b.right <= a.right + 1 &&
      b.top >= a.top - 1 &&
      b.bottom <= a.bottom + 1
    );
  });
  const state = await page.evaluate(() => {
    const viewer = document.querySelector(".vv-content"),
      surface = document.querySelector(".vv-viewport"),
      pane = document.querySelector(".workspace-panel"),
      dialog = document.querySelector(".vv-dialog");
    const boundary = dialog.open
        ? dialog.getBoundingClientRect()
        : pane.getBoundingClientRect(),
      rect = viewer.getBoundingClientRect();
    return {
      fits: rect.top >= boundary.top - 1 && rect.bottom <= boundary.bottom + 1,
      surfaceHeight: surface.clientHeight,
      surfaceOverflow:
        surface.scrollHeight > surface.clientHeight + 1 ||
        surface.scrollWidth > surface.clientWidth + 1,
      viewerOverflow: viewer.scrollHeight > viewer.clientHeight + 1,
      nested: [
        ...document.querySelectorAll(
          ".vv-canvas .nv-scroll, .vv-canvas .seq-array-scroll, .vv-canvas .seq-matrix-scroll, .vv-canvas .islands-grid-scroll",
        ),
      ].some((element) => getComputedStyle(element).overflow !== "visible"),
    };
  });
  const clipped = await page
    .locator(".vv-canvas .nv-svg")
    .evaluateAll((diagrams) =>
      diagrams.flatMap((svg) => {
        const content = svg.getBBox(),
          frame = svg.viewBox.baseVal;
        return content.x < frame.x - 1 ||
          content.y < frame.y - 1 ||
          content.x + content.width > frame.x + frame.width + 1 ||
          content.y + content.height > frame.y + frame.height + 1
          ? [
              {
                viewBox: svg.getAttribute("viewBox"),
                bounds: [content.x, content.y, content.width, content.height],
              },
            ]
          : [];
      }),
    );
  assert.equal(
    clipped.length,
    0,
    `${label}: SVG bounds include nodes, links, and labels: ${JSON.stringify(clipped)}`,
  );
  assert(state.fits, `${label}: viewer stays within window/pane`);
  assert(state.surfaceHeight >= 25, `${label}: diagram has space`);
  assert(
    !state.surfaceOverflow && !state.viewerOverflow,
    `${label}: fit has no scroll overflow`,
  );
  assert(!state.nested, `${label}: no nested diagram scrolling`);
}
try {
  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 1536, height: 1024 },
    { width: 1280, height: 600 },
  ]) {
    await page.setViewportSize(viewport);
    await open("same-tree");
    assert.match(await page.title(), /Same Tree/);
    assert.equal(
      await page.locator(".wt-input-editor").getAttribute("open"),
      null,
    );
    await fitted(`same-tree compact ${viewport.width}x${viewport.height}`);
    await page.evaluate(() => {
      window.viewerCanvas = document.querySelector(".vv-canvas");
      window.viewerNode = document.querySelector(".nv-node");
    });
    const before = await page.locator(".step-count").innerText();
    const scrollBefore = await page
      .locator(".workspace-panel")
      .evaluate((el) => el.scrollTop);
    await page.getByRole("button", { name: "Enlarge", exact: true }).click();
    await fitted(`same-tree expanded ${viewport.width}x${viewport.height}`);
    assert.equal(await page.getByRole("dialog").count(), 1);
    assert.equal(await page.locator(".step-count").innerText(), before);
    assert(
      await page.evaluate(
        () =>
          window.viewerCanvas === document.querySelector(".vv-canvas") &&
          window.viewerNode === document.querySelector(".nv-node"),
      ),
      "Expansion preserves canvas and node DOM identities",
    );
    // Geometry is viewport-dependent; the shared controls need their complete
    // interaction sequence only at the most constrained desktop size.
    if (!fullCoverage && viewport.height !== 600) {
      await page.keyboard.press("Escape");
      continue;
    }
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      assert(
        await page.evaluate(() =>
          document.querySelector(".vv-dialog").contains(document.activeElement),
        ),
        "Modal traps focus",
      );
    }
    await page
      .getByRole("button", { name: "State details", exact: true })
      .click();
    assert(await page.locator(".vv-details").isVisible());
    await page
      .getByRole("button", { name: "Close state details", exact: true })
      .click();
    assert.equal(
      await page.evaluate(() => document.activeElement.textContent.trim()),
      "State details",
    );
    await page.getByRole("button", { name: "Next step", exact: true }).click();
    assert.match(await page.locator(".step-count").innerText(), /Step 2 of/);
    await page.getByRole("button", { name: "Zoom in", exact: true }).click();
    const zoom = await page.locator(".vv-zoom").innerText();
    await page.getByRole("button", { name: "Next step", exact: true }).click();
    assert.equal(
      await page.locator(".vv-zoom").innerText(),
      zoom,
      "Manual zoom survives stepping",
    );
    await page
      .getByRole("button", { name: "Fit visualization", exact: true })
      .click();
    await fitted("restored fit");
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("dialog").count(), 0);
    assert.equal(
      await page.evaluate(() => document.activeElement.textContent.trim()),
      "Enlarge",
    );
    assert.equal(
      await page.locator(".workspace-panel").evaluate((el) => el.scrollTop),
      scrollBefore,
      "Closing preserves lesson scroll",
    );
    await page.locator(".vv-content").focus();
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowRight");
    assert.match(await page.locator(".step-count").innerText(), /Step 2 of/);
    await fitted("compact keyboard step");
  }
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const slug of [
    "two-sum",
    "add-two-numbers",
    "number-of-islands",
    "find-median-from-data-stream",
    "design-search-autocomplete-system",
    "contains-duplicate",
    "valid-parentheses",
    "merge-intervals",
    "reverse-bits",
    "coin-change",
    "course-schedule-ii",
  ]) {
    await open(slug);
    await fitted(`${slug} initial`);
    const count = Number(
      await page
        .getByLabel("Algorithm step", { exact: true })
        .getAttribute("max"),
    );
    for (const position of [
      Math.floor(count / 3),
      Math.floor((count * 2) / 3),
      count,
    ]) {
      await page
        .getByLabel("Algorithm step", { exact: true })
        .fill(String(position));
      await fitted(`${slug} step ${position}`);
    }
    await page.getByRole("button", { name: "Enlarge", exact: true }).click();
    await fitted(`${slug} expanded return`);
    await page.getByRole("button", { name: "Close", exact: true }).click();
    if (!fullCoverage) {
      // Reuse this trace to cover the short layout instead of reloading Python.
      await page.setViewportSize({ width: 1280, height: 600 });
      await page
        .getByLabel("Algorithm step", { exact: true })
        .fill(String(Math.floor(count / 2)));
      await fitted(`${slug} short dense state`);
      await page.setViewportSize({ width: 1280, height: 800 });
      // Playback belongs to the shared viewer. Exercise a sequence and a node
      // diagram; all families retain their initial, intermediate and end states.
      if (!["two-sum", "add-two-numbers"].includes(slug)) continue;
    }
    await page
      .getByRole("button", { name: "Reset walkthrough", exact: true })
      .click();
    const scroll = await page
      .locator(".workspace-panel")
      .evaluate((el) => el.scrollTop);
    await page.getByLabel("Playback speed").selectOption("4");
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await page.getByRole("button", { name: "Enlarge", exact: true }).click();
    await page.waitForFunction(
      () =>
        !document
          .querySelector(".step-count")
          .textContent.includes("Step 1 of"),
    );
    await page.getByRole("button", { name: "Pause", exact: true }).click();
    await fitted(`${slug} autoplay`);
    await page.keyboard.press("Escape");
    assert.equal(
      await page.locator(".workspace-panel").evaluate((el) => el.scrollTop),
      scroll,
      "Autoplay does not scroll lesson",
    );
  }
  await page.setViewportSize({ width: 1280, height: 600 });
  for (const slug of fullCoverage
    ? [
        "two-sum",
        "add-two-numbers",
        "number-of-islands",
        "find-median-from-data-stream",
        "design-search-autocomplete-system",
        "contains-duplicate",
        "valid-parentheses",
        "merge-intervals",
        "reverse-bits",
        "coin-change",
        "course-schedule-ii",
      ]
    : []) {
    await open(slug);
    const last = Number(
      await page
        .getByLabel("Algorithm step", { exact: true })
        .getAttribute("max"),
    );
    await page
      .getByLabel("Algorithm step", { exact: true })
      .fill(String(Math.floor(last / 2)));
    await fitted(`${slug} short dense state`);
  }
  // Dense algorithm states need useful primary content, not just valid bounds.
  const complex = [
    ["sudoku-solver", 0],
    ["sudoku-solver", 1],
    ["sudoku-solver", 8],
    ["n-queens", 4],
    ["longest-common-subsequence", 0],
    ["partition-to-k-equal-sum-subsets", 0],
    ["prefix-and-suffix-search", 0],
    ["design-search-autocomplete-system", 0],
    ["construct-binary-tree-from-preorder-and-inorder-traversal", 5],
  ];
  for (const height of [800, 600]) {
    await page.setViewportSize({ width: 1280, height });
    for (const [slug, example] of complex) {
      // Every dense regression runs at 600px. Keep the additional 800px checks
      // where height changes the assertion: readable tries and a grid sample.
      if (
        !fullCoverage &&
        height === 800 &&
        ![
          "prefix-and-suffix-search",
          "design-search-autocomplete-system",
        ].includes(slug) &&
        !(slug === "sudoku-solver" && example === 0)
      )
        continue;
      await open(slug);
      if (example) {
        await page
          .getByLabel("Choose an example")
          .selectOption(String(example));
        await page
          .getByRole("button", { name: "Play", exact: true })
          .waitFor({ timeout: 60000 });
      }
      const last = Number(
        await page
          .getByLabel("Algorithm step", { exact: true })
          .getAttribute("max"),
      );
      for (const position of [
        ...(slug === "partition-to-k-equal-sum-subsets"
          ? [Math.floor(last * 0.375)]
          : []),
        Math.floor(last / 2),
        Math.floor(last * 0.75),
        last,
      ]) {
        await page
          .getByLabel("Algorithm step", { exact: true })
          .fill(String(position));
        await fitted(`${slug} example ${example} dense compact ${height}`);
        await page
          .getByRole("button", { name: "Enlarge", exact: true })
          .click();
        await fitted(`${slug} example ${example} dense expanded ${height}`);
        const labels = await page
          .locator(".vv-canvas .structure-label")
          .allTextContents();
        if (slug === "sudoku-solver") assert.deepEqual(labels, ["Board"]);
        if (slug === "longest-common-subsequence")
          assert.deepEqual(labels, ["Previous", "Current"]);
        if (slug === "n-queens") {
          assert.equal(
            labels.length,
            0,
            "Queen board replaces duplicate state tables",
          );
          assert(await page.locator(".vv-canvas .queens-board").isVisible());
        }
        if (
          slug === "construct-binary-tree-from-preorder-and-inorder-traversal"
        ) {
          assert.equal(
            await page.locator(".vv-canvas .nv-svg").count(),
            1,
            "Subtree alias does not duplicate root diagram",
          );
        }
        if (slug === "partition-to-k-equal-sum-subsets") {
          assert(
            await page.locator(".vv-dialog .vv-trace-notice").isVisible(),
            "Trace limit stays visible while enlarged",
          );
          const mask = await page
            .locator(".vv-summary .pointer-values > span")
            .filter({ has: page.locator("code", { hasText: /^mask$/ }) })
            .locator("b")
            .innerText();
          const remainder = page.locator(".vv-canvas .structure").filter({
            has: page.locator(".structure-label", {
              hasText: "Unfinished bucket sum per mask",
            }),
          });
          const captured = Number(
            (await remainder.locator(".seq-caption").innerText()).match(
              /^(\d+) captured/,
            )[1],
          );
          if (Number(mask) < captured) {
            assert(
              await remainder
                .locator(`.seq-cell[aria-label^="Index ${mask}:"]`)
                .isVisible(),
              "Active captured bitmask stays in the displayed DP page",
            );
          } else {
            assert.match(
              await remainder.locator(".seq-index-legend").innerText(),
              /outside captured range/,
              "Uncaptured active bitmask is explicitly marked",
            );
            assert(await remainder.locator(".snapshot-limit").isVisible());
          }
        }
        if (
          slug === "prefix-and-suffix-search" ||
          slug === "design-search-autocomplete-system"
        ) {
          assert.equal(
            await page.locator('.vv-canvas .nv-root[data-kind="trie"]').count(),
            1,
          );
          assert(
            await page
              .locator('.vv-canvas .nv-root[data-kind="trie"]')
              .evaluate(
                (node) =>
                  node.getBoundingClientRect().width >=
                  node.closest(".primary-structures").getBoundingClientRect()
                    .width *
                    0.95,
              ),
            "A single trie uses the whole canvas width",
          );
          const nodeValuesReadable = () =>
            page.locator(".vv-canvas .nv-node-value").evaluateAll((nodes) =>
              nodes.every((node) => {
                const transform = node.getScreenCTM();
                return (
                  Math.hypot(transform.a, transform.b) *
                    parseFloat(getComputedStyle(node).fontSize) >=
                  9
                );
              }),
            );
          if (!(await nodeValuesReadable())) {
            assert.equal(
              height,
              600,
              `${slug}: standard expanded view remains legible`,
            );
            // A short window is an overview for large captured tries. Deliberate
            // zoom exposes readable values; Fit restores every captured node.
            for (let i = 0; i < 3 && !(await nodeValuesReadable()); i++) {
              await page
                .getByRole("button", { name: "Zoom in", exact: true })
                .click();
            }
            assert(
              await nodeValuesReadable(),
              `${slug}: manual zoom permits readable inspection`,
            );
            await page
              .getByRole("button", { name: "Fit visualization", exact: true })
              .click();
            await fitted(`${slug} restored large trie overview`);
          }
        }
        if (height === 800 && position === Math.floor(last / 2)) {
          await page.screenshot({
            path: `${screenshotDirectory}/complex-${slug}-${example}.png`,
          });
        }
        if (
          height === 600 &&
          position === last &&
          ["sudoku-solver", "prefix-and-suffix-search"].includes(slug)
        ) {
          await page.setViewportSize({ width: 390, height: 844 });
          await fitted(`${slug} narrow expanded`);
          await page.setViewportSize({ width: 1280, height });
        }
        await page.keyboard.press("Escape");
      }
    }
  }
  await page.setViewportSize({ width: 1280, height: 600 });
  for (const [slug, example] of [
    ["reverse-linked-list", 0],
    ["reverse-linked-list-ii", 0],
    ["palindrome-linked-list", 3],
    ["path-sum-iii", 0],
    ["merge-two-binary-trees", 0],
    ["average-of-levels-in-binary-tree", 5],
    ["number-of-connected-components-in-an-undirected-graph", 7],
    ["maximum-width-of-binary-tree", 1],
    ["odd-even-linked-list", 0],
    ["linked-list-cycle", 0],
    ["all-nodes-distance-k-in-binary-tree", 0],
    ["index-pairs-of-a-string", 0],
  ]) {
    await open(slug);
    if (example) {
      await page.getByLabel("Choose an example").selectOption(String(example));
      await page
        .getByRole("button", { name: "Play", exact: true })
        .waitFor({ timeout: 60000 });
    }
    const last = Number(
      await page
        .getByLabel("Algorithm step", { exact: true })
        .getAttribute("max"),
    );
    for (const position of [Math.floor(last / 2), last]) {
      await page
        .getByLabel("Algorithm step", { exact: true })
        .fill(String(position));
      await fitted(`${slug} short compact state ${position}`);
      if (
        [
          "odd-even-linked-list",
          "linked-list-cycle",
          "all-nodes-distance-k-in-binary-tree",
        ].includes(slug)
      ) {
        assert.equal(
          await page.locator(".vv-canvas .nv-svg").count(),
          1,
          "Combined pointers do not duplicate diagrams",
        );
      }
      if (slug === "odd-even-linked-list")
        assert.equal(
          await page.locator(".vv-canvas .nv-node").count(),
          5,
          "Detached even chain remains on the canvas",
        );
      if (slug === "reverse-linked-list")
        assert.equal(
          await page.locator(".vv-canvas .nv-node").count(),
          5,
          "Detached reversed and remaining chains stay visible",
        );
      if (slug === "index-pairs-of-a-string") {
        // A supplemental subtree is useful only when it exposes nodes omitted
        // from the captured main trie. Repeating identical diagrams adds clutter.
        const duplicate = await page
          .locator(".vv-canvas .nv-svg")
          .evaluateAll((diagrams) => {
            const ids = diagrams.map((svg) =>
              [...svg.querySelectorAll(".nv-node > title")].map(
                (title) => title.textContent.match(/identity ([^;]+)/)?.[1],
              ),
            );
            return ids.some((values, i) =>
              ids.some(
                (other, j) =>
                  j < i &&
                  values.length === other.length &&
                  values.every((id) => other.includes(id)),
              ),
            );
          });
        assert.equal(
          duplicate,
          false,
          "Trie aliases do not repeat identical diagrams",
        );
      }
      await page.evaluate(() => {
        window.listCanvas = document.querySelector(".vv-canvas");
        window.listNode = document.querySelector(".nv-node");
      });
      const count = await page.locator(".step-count").innerText();
      await page.getByRole("button", { name: "Enlarge", exact: true }).click();
      await fitted(`${slug} short expanded state ${position}`);
      assert.equal(await page.locator(".step-count").innerText(), count);
      assert(
        await page.evaluate(
          () =>
            window.listCanvas === document.querySelector(".vv-canvas") &&
            window.listNode === document.querySelector(".nv-node"),
        ),
        "Expansion preserves the combined diagram",
      );
      await page.keyboard.press("Escape");
    }
  }
  await page.setViewportSize({ width: 1280, height: 800 });
  await open("same-tree");
  await page.getByRole("button", { name: "Next step", exact: true }).click();
  await page.getByRole("button", { name: "Next step", exact: true }).click();
  await fitted("screenshot compact");
  await page.screenshot({ path: `${screenshotDirectory}/viewer-compact.png` });
  await page.getByRole("button", { name: "Enlarge", exact: true }).click();
  await fitted("screenshot expanded");
  await page.screenshot({ path: `${screenshotDirectory}/viewer-expanded.png` });
  await page
    .getByRole("button", { name: "State details", exact: true })
    .click();
  await page.screenshot({ path: `${screenshotDirectory}/viewer-details.png` });
  await page
    .getByRole("button", { name: "Close state details", exact: true })
    .click();
  await page.setViewportSize({ width: 390, height: 844 });
  await fitted("narrow expanded view");
  await page.screenshot({ path: `${screenshotDirectory}/viewer-narrow.png` });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await page.locator(".wt-input-editor > summary").click();
  await page.getByLabel("Example input").fill('{"p":[1],"q":[1]}');
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await page
    .getByRole("button", { name: "Play", exact: true })
    .waitFor({ timeout: 60000 });
  assert.equal(
    await page
      .getByRole("button", { name: "Fit visualization", exact: true })
      .getAttribute("aria-pressed"),
    "true",
    "Applying input resets fit",
  );
  assert.deepEqual(errors, [], "No browser errors");
  console.log(
    `PASS (${fullCoverage ? "full" : "focused"} coverage): fitted diagrams, 3 desktop sizes, narrow expanded view, all figure families, 9 complex examples, 12 additional diagram/short-window cases, dense/return states, DP pages/capture limits, canonical diagrams, zoom, drawer, focus, stable DOM, keyboard, autoplay, scroll preservation, input reset`,
  );
} catch (error) {
  await page.screenshot({ path: `${screenshotDirectory}/viewer-failure.png` });
  console.error(error);
  console.error("Browser errors:", errors);
  process.exitCode = 1;
} finally {
  await browser.close();
}
