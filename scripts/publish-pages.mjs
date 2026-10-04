// Optional cross-repository publisher. No destination is assumed for forks.
import { execFileSync } from "node:child_process";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
  access,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repository = process.env.PAGES_REPOSITORY;
if (!repository || !/^[\w-]+\/[\w.-]+$/.test(repository))
  throw new Error(
    "Set PAGES_REPOSITORY=owner/repository to an existing Pages repository you control.",
  );
const directory = process.env.PAGES_DIRECTORY || "dadalcode";
if (!/^[\w-]+(?:\/[\w-]+)*$/.test(directory))
  throw new Error(
    "PAGES_DIRECTORY must be a relative path with simple directory names.",
  );
const branch = process.env.PAGES_BRANCH || "main";
execFileSync("git", ["check-ref-format", "--branch", branch], {
  stdio: "ignore",
});
const distribution = join(root, "dist");
const html = await readFile(join(distribution, "index.html"), "utf8");
if (!html.includes(`src="/${directory}/assets/`))
  throw new Error(
    `Build first with DEPLOY_BASE_PATH=/${directory}/ npm run build:pages.`,
  );
await access(join(distribution, "pyodide/pyodide.asm.wasm"));
await access(join(distribution, "third-party-licenses.txt"));
const temporary = await mkdtemp(join(tmpdir(), "dadalcode-pages-"));
const checkout = join(temporary, "site");
function git(args, cwd = checkout) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}
try {
  git(
    [
      "clone",
      "--quiet",
      "--depth",
      "1",
      "--branch",
      branch,
      `git@github.com:${repository}.git`,
      checkout,
    ],
    temporary,
  );
  git([
    "config",
    "user.name",
    process.env.PAGES_COMMIT_NAME || git(["config", "user.name"], root),
  ]);
  git([
    "config",
    "user.email",
    process.env.PAGES_COMMIT_EMAIL || git(["config", "user.email"], root),
  ]);
  const destination = join(checkout, directory);
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  await cp(distribution, destination, { recursive: true });
  await writeFile(join(checkout, ".nojekyll"), "");
  git(["add", "--", directory, ".nojekyll"]);
  if (!git(["diff", "--cached", "--name-only"]))
    console.log("Published files already match this build.");
  else {
    git(["commit", "--quiet", "-m", `Publish DadalCode under /${directory}/`]);
    git(["push", "origin", `HEAD:${branch}`]);
    console.log(`Published ${git(["rev-parse", "HEAD"])} to ${repository}.`);
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
