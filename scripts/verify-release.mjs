import { execFileSync, spawnSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
const status = execFileSync("git", ["status", "--porcelain"], {
  encoding: "utf8",
}).trim();
if (status)
  throw new Error(
    "Commit the intended release files first. Verification requires a clean working tree.",
  );
const commit = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
const directory = await mkdtemp(join(tmpdir(), "dadalcode-release-"));
try {
  const archive = join(directory, "source.tar");
  execFileSync("git", ["archive", "--format=tar", "-o", archive, commit]);
  execFileSync("tar", ["-xf", archive, "-C", directory]);
  await rm(archive);
  const commands = [
    ["ci"],
    ["run", "format:check"],
    ["run", "lint"],
    ["test"],
    ["run", "test:e2e"],
    ["run", "build:pages"],
    ["run", "test:production"],
  ];
  for (const args of commands) {
    console.log(`Verifying ${commit}: npm ${args.join(" ")}`);
    const result = spawnSync("npm", args, {
      cwd: directory,
      stdio: "inherit",
      env: { ...process.env, BROWSER_COVERAGE: "full" },
    });
    if (result.error) throw result.error;
    if (result.status !== 0)
      throw new Error(`Release verification failed: npm ${args.join(" ")}`);
  }
  console.log(`VERIFIED RELEASE COMMIT ${commit}`);
} finally {
  await rm(directory, { recursive: true, force: true });
}
