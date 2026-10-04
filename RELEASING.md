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

Merging into `main` triggers website deployment after all checks pass. Creating a
release/tag and changing repository visibility remain separate actions; the
workflow does not change visibility.

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

The **Release checks and deploy** workflow runs on PRs and pushes to `main`.
After a PR is merged, the resulting push runs **Quality**, **Browser tests**, and
**Production build**. If all three pass, **Deploy website** publishes that run's
verified artifact to this repository's GitHub Pages site. Direct pushes to `main`
also deploy; PRs and manual runs on other branches never deploy. A manual run on
`main` can retry deployment. An in-progress main-branch deployment is not canceled
by a newer push.

One-time setup: in **Settings → Pages → Build and deployment**, select **GitHub
Actions** as the source. The expected site URL for this repository is
`https://d-nyamkhuu.github.io/dadalcode/`. GitHub currently rejects Pages activation
for this private repository under its plan. Make the repository public or use a
plan that supports private-repository Pages, then enable that setting before
merging. No personal access token or deployment secret is required; the deploy
job uses the repository token and GitHub's identity token.

For an alternative destination in an existing branch-based Pages repository,
the explicit publisher remains available:

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
