// Publish only dist/ into the site's blind-75/ directory. The source repository
// remains private. The public repository and Pages setting must already exist.
import { execFileSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distribution = join(root, "dist");
const siteURL = "https://d-nyamkhuu.github.io/blind-75/";
const remote = "git@github.com:d-nyamkhuu/d-nyamkhuu.github.io.git";
const html = await readFile(join(distribution, "index.html"), "utf8");
if (!html.includes('src="/blind-75/assets/')) {
  throw new Error("Run npm run build:pages first; the output must target /blind-75/.");
}
await access(join(distribution, "pyodide/pyodide.asm.wasm"));
await access(join(distribution, "problems/two-sum/lesson.json"));

const temporary = await mkdtemp(join(tmpdir(), "pattern-lab-pages-"));
const checkout = join(temporary, "site");
function git(args, cwd = checkout) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}
try {
  git(["clone", "--quiet", "--depth", "1", remote, checkout], temporary);
  git(["checkout", "-B", "main"]);
  git(["config", "user.name", git(["config", "user.name"], root)]);
  git(["config", "user.email", "d-nyamkhuu@users.noreply.github.com"]);
  const destination = join(checkout, "blind-75");
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  await cp(distribution, destination, { recursive: true });
  await writeFile(join(checkout, ".nojekyll"), "");
  git(["add", "--", "blind-75", ".nojekyll"]);
  // Preserve an existing homepage if the Pages repository already has one.
  try {
    await access(join(checkout, "index.html"));
  } catch {
    await writeFile(join(checkout, "index.html"), '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Projects</title><h1>Projects</h1><p><a href="./blind-75/">Pattern Lab — Algorithm Trainer</a></p></html>\n');
    git(["add", "--", "index.html"]);
  }
  if (!git(["diff", "--cached", "--name-only"])) {
    console.log(`The published files already match this build: ${siteURL}`);
  } else {
    git(["commit", "--quiet", "-m", "Publish Pattern Lab under /blind-75/"]);
    git(["push", "origin", "HEAD:main"]);
    console.log(`Published commit ${git(["rev-parse", "HEAD"])}. GitHub Pages will build ${siteURL}`);
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
