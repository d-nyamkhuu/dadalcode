# Pattern Lab

A desktop Python algorithm trainer covering all **179 problems** in [Sean Prashad's LeetCode Patterns collection](https://seanprashad.com/leetcode-patterns/). Includes beginner-friendly theory, executable reference walkthroughs, a Python editor, commented solutions, and locally saved progress. All 13 premium-listed problems include publicly accessible alternative statement sources.

## Run locally

Requires Node.js 22.12+ and npm. In this directory:

```sh
npm install
npm run dev
```

Open **http://127.0.0.1:5173**. Keep this origin/port to retain the same browser progress. Installation copies Pyodide's matching runtime and standard library into `public/pyodide/`; Python, fonts, content, and diagrams are subsequently served locally. No API keys, server-side Python, or accounts are required. Internet is needed for initial dependency installation and external source links, not normal study or execution.

## Study and practice

- **Problems:** search the entire catalog and filter by pattern, difficulty, or progress.
- **Learn:** read developed intuition, algorithm steps, a concrete worked example, and key Python blocks explained. Every one of the 179 lessons includes an independently reviewed editorial; 537 code annotations point to exact source fragments. Choose an authored example or edit the JSON and Apply.
- **Walkthrough:** step through meaningful state changes or every Python line; play, scrub, reset, jump to the end, and change speed. Focus the walkthrough and use Left/Right, Home/End, or Space. Sticky controls remain visible while the diagrams scroll. Line snapshots show the state **before** the highlighted instruction; return events include that function's result.
- **Diagrams:** inspect indexed arrays and strings, paired grid coordinates, heap trees, stack/queue order, shared interval scales, bit positions, and rolling DP state. Stable node identities keep pointers attached as linked-list links change; graph views distinguish current, visited, and queued nodes. Changed values and links are highlighted. Word Squares, N-Queens, elevation profiles, coin transitions, and flood-fill grids have additional visual explanations.
- **Practice:** write Python, Run the selected example or custom input, or Submit against the complete local fixture suite. `Ctrl/⌘ + Enter` runs; add Shift to submit. Passing all tests marks a problem solved.
- **Solution:** read the same complete editorial beside the commented Python reference. Code notes explain the purpose of specific source blocks. Opening this view never replaces your draft.
- The lesson and workspace panes scroll independently. Use the chapter buttons to jump among Intuition, Algorithm, Walkthrough, Code, and Complexity. Drag the divider or focus it and use arrow keys; collapse the problem sidebar for more room.

Drafts, completion, and the last submission summary are stored in IndexedDB in your current browser. Clearing browser/site data removes them. This is a personal local practice tool; test cases are inspectable and are independent of LeetCode's judge. Completion records the last successful full submission, even if you later edit the draft.

Code runs in a terminable Web Worker to keep the interface responsive. Each case has a three-second execution limit and each suite fifteen seconds, excluding Python initialization. Console capture is bounded to 64 KiB. Visualization inputs should be small: traces stop at 2,000 steps and complex snapshots show bounded portions of large structures. A visible notice identifies trace truncation. Stop or a timeout terminates the worker; subsequent runs start cleanly. A worker is a responsiveness boundary for this personal tool, not a hosted multi-user security sandbox.

## Verify

```sh
npm test                 # Python 3: regression suites + curriculum fixtures + review fingerprints
npm run test:content     # Content checks during edits, before recording a new review
npm run build           # TypeScript checks + production build
npm run test:visuals    # pointer, graph, trie, heap, grid rendering regressions
npx playwright install chromium
npm run dev             # leave running in another terminal
npm run test:browser     # desktop interactions and persistence
npm run test:runtime     # all 179 suites and traces in browser Pyodide
```

Browser tests default to `http://127.0.0.1:5173`. UI tests accept `APP_URL` and `CHROME_PATH`; runtime tests accept `TRAINER_BASE_URL` and `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. Screenshots go to the operating system's temporary directory under `pattern-lab-qa`, not the application bundle. Tests use fresh browser storage.

## Project structure

- `public/problems/<slug>/`: original lesson, `explanation.json` editorial, Python solution/starter, fixtures, and adapter.
- `public/illustrations/`: ImageGen concept illustrations for trapped water, non-adjacent houses, and connected islands. Their captions describe the idea rather than the current editable trace input.
- `src/runtime/`: shared CPython/Pyodide harness, worker, timeout/cancellation controller.
- `src/components/`: lesson, editor, results, and trace renderers.
- `src/data/`: pinned original catalog, corrected metadata, work queue, loading, persistence.
- `design/`: four ImageGen desktop references, exact prompts, and comparison notes.
- `tests/review-ledger.json`: independent curriculum and editorial review, repaired findings, and hashes of all six files in each reviewed problem package.
- `tests/test_curriculum_group_*.py`: generated boundary cases, seeded independent oracles, and invalid-candidate regressions. Large cases stay out of the teaching walkthroughs.
- `scripts/content_contracts.py`: shared authoring contracts for metadata, JSON fixtures, public signatures, adapter hooks, and review fingerprints.
- `PROBLEM_CONTRACT.md`: contract for maintaining problem packages.

Integer answers are compared exactly even if a learner returns a float. Median and other floating-answer problems declare their own tolerance checks. Encoding problems verify reconstruction with fresh class/global state; explicit arithmetic and library-sort restrictions have source checks. Linked-list output supports the full 50,000-node Sort List domain while visual snapshots remain bounded.

After reviewing a content change, use `python scripts/record_content_review.py --slug <slug>` to refresh its six-file review fingerprint. `npm test` detects subsequent changes to any reviewed package file.

Five independent authors created disjoint packages; a separate reviewer checked all 179 before integration. Original source IDs are preserved separately from canonical LeetCode numbers. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for source attribution and licenses.

Desktop only, verified at 1536×1024 and 1280×800. No mobile layout, cloud sync, or analytics is included.

## GitHub Pages

Published site: [Pattern Lab](https://d-nyamkhuu.github.io/blind-75/).

The production build targets `/blind-75/`. Lessons, illustrations, bundled fonts, the Python worker, and the Pyodide runtime all resolve under that path. Hash routes support direct links and reloads on static hosting.

```sh
npm test
npm run build:pages
npm run preview:pages       # leave running in another terminal
npm run test:pages          # production-build browser checks
```

`APP_URL` can point the Pages test at another preview port or the published site. For example, `APP_URL=http://127.0.0.1:4175/blind-75/ npm run test:pages`.

The private source repository's current GitHub plan does not support Pages. The built site is published in the public `d-nyamkhuu.github.io` repository under `blind-75/`, with branch-based Pages serving `main` from `/`. `npm run publish:pages` publishes only the current `dist/` build and preserves other site directories and an existing homepage. Source files, review reports, and local development files outside the production build are not copied.

The GitHub Actions workflow validates source changes, tests the production subpath, and uploads a Pages build artifact. Publishing across the private source and public site repositories uses the explicit publisher command with your Git access; no long-lived cross-repository token is stored in Actions.

## Illustration sources

The built-in ImageGen tool generated `public/illustrations/rainwater.png`, `public/illustrations/house-robber.png`, and `public/illustrations/islands.png`. Exact prompts are saved in [design/illustrations/prompts.json](design/illustrations/prompts.json). The original generated files are included locally; illustrations load only in relevant lessons. Precise algorithm states and numeric diagrams remain CSS/SVG views of Python execution.
