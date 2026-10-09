# Contributing to DadalCode

DadalCode supports desktop browsers. Test at 1536×1024, 1280×800, and 1280×600;
phone layouts are not a release requirement. A narrow expanded diagram window is
still tested because desktop users resize windows.

## Local setup

Use Node.js 24 LTS (or 22.13+), npm, and Python 3.12. Application use requires no
local Python installation; Python is needed for content and regression tests.
The Python validator currently requires Linux/macOS or WSL because it uses
`SIGALRM`. CI runs Ubuntu with Python 3.12.

```sh
npm ci
npx playwright install chromium
npm run dev
```

`npm ci` installs the lockfile versions and copies the matching local Pyodide
runtime. No API keys are needed. Keep the same local origin to retain progress.

## Before a pull request

```sh
npm run format
npm run lint
npm test
npm run test:e2e
npm run build:pages
npm run test:production
```

The browser commands start and stop their own servers. Do not start another
server on ports 5190 or 4175. Screenshots go to the system temporary directory.
Append `-- --parallel` to `test:e2e` or `test:production` to run two independent
suites at a time, as CI does. The longest browser suite starts first; every suite
still runs, and any failure fails the check. Omit the flag for sequential runs on
smaller machines. Runtime benchmarks always run alone.

Normal browser checks cover every diagram family and known dense-state regression,
with the complete shared-control sequence at the shortest desktop height. They
reuse traces across viewport checks and sample autoplay on sequence and node
diagrams. To also repeat every control, autoplay, and dense-state combination:

```sh
BROWSER_COVERAGE=full npm run test:e2e -- --parallel
```

`npm run verify:release` always uses full coverage. Both modes still validate all
179 problem suites in browser Python and all lesson guides. Concept checks visit
every scene, decode every local illustration, and assert that Learn loads no
Python worker or runtime assets.

CI runs the full checks for app code, lessons, tests, dependencies, build/CI
configuration, and bundled license notices. Changes limited to the root README,
contribution/release/security guides, problem contract, issue/PR templates, or
Markdown/images under `docs/` run formatting only. Browser and production checks
report as skipped, and no deployment runs. Unknown paths or unavailable Git
history trigger full checks; manual workflow runs always do too.

Keep generated `dist/`, runtime files, and distribution notices out of commits.

Describe the user-visible problem, change, and verification. Include a desktop
screenshot for visible UI changes. Keep refactoring and lesson corrections
focused. Do not submit API keys, personal backups, private examples, or credentials.

## Lessons and review

Follow [the problem contract](PROBLEM_CONTRACT.md). Each problem has six files:
lesson, editorial (including the required conceptual lesson), solution, starter,
adapter, and tests. [Concept authoring and review](docs/CONCEPT_LESSONS.md) describes
the per-problem diagrams and local artwork. Write original prose and
code, attribute sources, and retain the source catalog's CC BY-NC license.

Run `npm run test:content` during editing. Add meaningful independent regression
cases for grading or algorithm changes. Ask a separate reviewer to check the
reasoning, intermediate states, and invalid-answer handling. Only after that
review should the maintainer run:

```sh
python scripts/record_content_review.py --slug problem-slug
```

The review ledger is a fingerprint of reviewed files, not proof of correctness.
The command records a completed review; it does not perform one. Include the
reviewer's findings and checks in the pull request. The existing curriculum was
created and checked with an agent-assisted workflow; do not interpret separate
agent reviews as external human certification.

## Runtime and storage changes

Preserve the existing IndexedDB name and old progress records. Test simultaneous
tabs, write conflicts, denied storage, backup validation, and reload persistence.
Never change an existing draft simply because a lesson is opened. Runtime changes
must pass the browser Python suite as well as native Python checks; a Web Worker
provides cancellation, not isolation from the browser origin.

## Release

See [the release guide](RELEASING.md). A public repository does not change the
catalog's license. Original application code is MIT; adapted catalog/roadmaps are
CC BY-NC 4.0. Every build must include the credits page and full runtime notices.
