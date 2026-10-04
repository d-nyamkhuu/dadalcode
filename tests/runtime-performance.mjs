import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  browserExecutable,
  screenshotDirectory,
} from "./browser-environment.mjs";
const browser = await chromium.launch({
  headless: true,
  executablePath: browserExecutable(chromium, process.env.CHROME_PATH),
});
try {
  const page = await browser.newPage();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 70,
    downloadThroughput: 1500000,
    uploadThroughput: 750000,
  });
  await page.goto(
    `${process.env.TRAINER_BASE_URL || "http://127.0.0.1:5173"}/problems/two-sum/lesson.json`,
  );
  const runs = await page.evaluate(async () => {
    const { loadProblem } = await import("/src/data/problems.ts");
    const { PythonRunner } = await import("/src/runtime/runner.ts");
    const problem = await loadProblem("two-sum");
    const runs = [];
    for (let i = 0; i < 2; i++) {
      const runner = new PythonRunner(),
        start = performance.now();
      let startupMs;
      const result = await runner.execute(
        problem,
        problem.solution,
        problem.tests.slice(0, 1),
        false,
        (stage) => {
          if (stage.startsWith("Running case"))
            startupMs = performance.now() - start;
        },
      );
      if (!result.cases[0]?.passed) throw new Error("Benchmark fixture failed");
      runs.push({
        cache: i === 0 ? "cold" : "warm assets, fresh worker",
        startupMs: Math.round(startupMs),
        totalMs: Math.round(performance.now() - start),
      });
    }
    return runs;
  });
  const report = {
    cpuSlowdown: 4,
    latencyMs: 70,
    downloadBytesPerSecond: 1500000,
    runs,
  };
  await mkdir(screenshotDirectory, { recursive: true });
  await writeFile(
    join(screenshotDirectory, "runtime-performance.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
