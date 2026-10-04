# Releasing DadalCode

## Source release

1. Review `git status`, including untracked components, tests, and license files.
   Commit the intended source and generated-image assets. Exclude credentials,
   user backups, `node_modules/`, `dist/`, and generated runtime/notices.
2. Run `npm run verify:release` from a clean checkout. It exports the exact HEAD
   into a temporary directory, installs locked dependencies, and runs formatting,
   lint, Python, build, and all browser checks. The report identifies the commit.
   Browser binaries must already be installed (`npx playwright install chromium`).
3. Push the reviewed commit/PR and wait for **Quality**, **Browser tests**, and
   **Production build**. Enable required checks before accepting contributions.
4. Create the release/tag only after the exact commit passes. Describe desktop
   support and the mixed licensing in the release notes.

Making a repository public, pushing a release, and publishing a website are
separate actions. These scripts do not change repository visibility.

## Required checks and private reports

GitHub currently rejects branch protection for this private repository under its
plan. After the repository is public (or its plan supports protection), an admin
can run:

```sh
npm run protect:main -- owner/repository
```

This enables the three release checks and up-to-date branches. Existing branch
protection is preserved apart from its required status-check list. For an
unprotected branch it also disables force pushes/deletion and applies checks to
admins. Enable private vulnerability reporting in the repository's Security
settings. Verify both settings before announcing the public release.

## Build and deploy

The build defaults to `/dadalcode/`. Set `DEPLOY_BASE_PATH` to the URL path used by
your hosting provider, including leading/trailing slashes:

```sh
DEPLOY_BASE_PATH=/dadalcode/ npm run build:pages
DEPLOY_BASE_PATH=/dadalcode/ npm run test:production
```

The Actions workflow produces a verified Pages artifact on `main`; it does not
publish automatically. This keeps forks and source releases from deploying to
an unintended website. Download the artifact or use the explicit publisher for
an existing branch-based Pages repository:

```sh
PAGES_REPOSITORY=owner/site-repository \
PAGES_DIRECTORY=dadalcode \
PAGES_BRANCH=main \
npm run publish:pages
```

The destination is required; there is no personal account default. The directory
must match the build path. Git SSH access and a configured Git name/email are
required. `PAGES_COMMIT_NAME` and `PAGES_COMMIT_EMAIL` can override the Git identity.
The publisher replaces only that directory and writes `.nojekyll`, preserving the
homepage and other site directories. It pushes a commit, so run it only when ready
to publish. The repository and its Pages configuration must already exist.

## Licenses and performance

Both standard and Pages builds regenerate full notices from the production
lockfile. Pyodide upgrades need a matching vendored upstream license. Verify
`credits.html` and `third-party-licenses.txt` in the artifact. No web fonts ship.

`npm run bench:runtime` measures two independent Python starts with Chromium CPU
and network throttling. Results go to the temporary QA directory. It is a
repeatable diagnostic, not a real-device benchmark or a hardware-independent CI
threshold. Keep cancellation and case isolation intact when optimizing startup.
