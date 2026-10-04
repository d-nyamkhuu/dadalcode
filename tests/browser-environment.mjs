import { existsSync, readdirSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
export const screenshotDirectory = join(tmpdir(), "pattern-lab-qa");
export function browserExecutable(chromium, override) {
  if (override) return override;
  if (existsSync(chromium.executablePath())) return undefined;
  // Reuse a preinstalled Chromium on Linux development workspaces.
  const cache = join(homedir(), ".cache", "ms-playwright");
  if (existsSync(cache))
    for (const name of readdirSync(cache)
      .filter((n) => n.startsWith("chromium-"))
      .sort()
      .reverse()) {
      const executable = join(cache, name, "chrome-linux64", "chrome");
      if (existsSync(executable)) return executable;
    }
  return undefined;
}
