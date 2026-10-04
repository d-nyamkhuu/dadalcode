import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";
const benchmark = process.argv.includes("--benchmark");
const production = process.argv.includes("--production");
const parallel = process.argv.includes("--parallel");
if (benchmark && parallel)
  throw new Error("Benchmarks must run alone; omit --parallel.");
const port = benchmark ? 5290 : production ? 4175 : 5190;
const path = production ? process.env.DEPLOY_BASE_PATH || "/dadalcode/" : "/";
const origin = `http://127.0.0.1:${port}`;
const root = origin + path;
const args = [
  "node_modules/vite/bin/vite.js",
  ...(production ? ["preview", "--mode", "github-pages"] : []),
  "--host",
  "127.0.0.1",
  "--port",
  String(port),
  "--strictPort",
];
const server = spawn(process.execPath, args, { stdio: "inherit" });
const children = new Set();
let stopping = false;
function stop() {
  if (!stopping) {
    stopping = true;
    for (const child of children) child.kill();
    server.kill();
  }
}
process.on("SIGINT", () => {
  stop();
  process.exitCode = 130;
});
process.on("SIGTERM", () => {
  stop();
  process.exitCode = 143;
});
const run = (file) =>
  new Promise((resolve, reject) => {
    const started = performance.now();
    console.log(`Starting browser suite: ${file}`);
    const child = spawn(process.execPath, [`tests/${file}.mjs`], {
      stdio: "inherit",
      env: {
        ...process.env,
        APP_URL: production ? root : origin,
        TRAINER_BASE_URL: origin,
      },
    });
    children.add(child);
    child.on("error", reject);
    child.on("close", (code) => {
      children.delete(child);
      console.log(
        `Browser suite ${file}: ${code === 0 ? "passed" : "failed"} in ${((performance.now() - started) / 1000).toFixed(1)}s`,
      );
      code === 0 ? resolve() : reject(new Error(`${file} failed (${code})`));
    });
  });
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null)
      throw new Error("Test server exited before starting.");
    try {
      ready = (await fetch(root)).ok;
    } catch {
      /* Server still starting. */
    }
    if (ready) break;
    await setTimeout(250);
  }
  if (!ready) throw new Error("Test server did not become ready.");
  const suites = benchmark
    ? ["runtime-performance"]
    : production
      ? ["pages", "release"]
      : [
          "browser",
          "study-plans",
          "learning",
          "visualizations",
          "visualization-viewer",
          "runtime-browser",
        ];
  // Start the longest suite first so it overlaps the shorter suites. Each suite
  // launches its own browser/context; only the read-only Vite server is shared.
  if (parallel && !production) {
    suites.splice(suites.indexOf("visualization-viewer"), 1);
    suites.unshift("visualization-viewer");
  }
  const failures = [];
  async function work() {
    while (suites.length && !stopping) {
      const suite = suites.shift();
      try {
        await run(suite);
      } catch (error) {
        failures.push(error);
      }
    }
  }
  await Promise.all(Array.from({ length: parallel ? 2 : 1 }, work));
  if (failures.length)
    throw new AggregateError(failures, "Browser suites failed.");
} finally {
  stop();
}
