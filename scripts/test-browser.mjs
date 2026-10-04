import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";
const benchmark = process.argv.includes("--benchmark");
const production = process.argv.includes("--production");
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
let stopping = false;
function stop() {
  if (!stopping) {
    stopping = true;
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
    const child = spawn(process.execPath, [`tests/${file}.mjs`], {
      stdio: "inherit",
      env: {
        ...process.env,
        APP_URL: production ? root : origin,
        TRAINER_BASE_URL: origin,
      },
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${file} failed (${code})`)),
    );
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
          "examples",
          "visualizations",
          "visualization-viewer",
          "runtime-browser",
        ];
  for (const suite of suites) await run(suite);
} finally {
  stop();
}
