import type {
  ProblemDefinition,
  TestCase,
  RunResult,
  WorkerResponse,
  WorkerRequest,
  CaseResult,
} from "../types";

export class PythonRunner {
  private worker?: Worker;
  private abort?: (reason: Error) => void;
  cancel(reason = "Execution stopped.") {
    this.worker?.terminate();
    this.worker = undefined;
    this.abort?.(new Error(reason));
    this.abort = undefined;
  }
  execute(
    problem: ProblemDefinition,
    code: string,
    cases: TestCase[],
    trace = false,
    onStage?: (stage: string) => void,
  ): Promise<RunResult> {
    this.cancel();
    const worker = (this.worker = new Worker(
      new URL("./python.worker.ts", import.meta.url),
      { type: "module" },
    ));
    const id = crypto.randomUUID();
    onStage?.("Loading local Python runtime…");
    return new Promise((resolve, reject) => {
      const results: CaseResult[] = [];
      let caseTimer: ReturnType<typeof setTimeout> | undefined;
      let suiteTimer: ReturnType<typeof setTimeout> | undefined;
      const initTimer = setTimeout(
        () =>
          this.cancel(
            "Python could not start. Retry to reload the local runtime.",
          ),
        60000,
      );
      const clean = () => {
        clearTimeout(initTimer);
        clearTimeout(caseTimer);
        clearTimeout(suiteTimer);
        this.abort = undefined;
        worker.terminate();
        if (this.worker === worker) this.worker = undefined;
      };
      this.abort = (error) => {
        clean();
        reject(error);
      };
      worker.onerror = (event) => {
        clean();
        reject(new Error(event.message || "Python worker failed to load."));
      };
      worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const message = event.data;
        if (message.id !== id) return;
        if (message.type === "ready") {
          clearTimeout(initTimer);
          suiteTimer = setTimeout(
            () =>
              this.cancel(
                "Time limit exceeded: the suite has a 15-second execution limit.",
              ),
            15000,
          );
        }
        if (message.type === "case-start") {
          onStage?.(
            trace
              ? "Building algorithm walkthrough…"
              : `Running case ${(message.index ?? 0) + 1} of ${cases.length}…`,
          );
          clearTimeout(caseTimer);
          caseTimer = setTimeout(
            () =>
              this.cancel(
                "Time limit exceeded: a test case ran for more than 3 seconds.",
              ),
            3000,
          );
        }
        if (message.type === "case-result" && message.result) {
          clearTimeout(caseTimer);
          results.push(message.result);
        }
        if (message.type === "complete") {
          clean();
          resolve({
            cases: results,
            steps: message.steps ?? [],
            truncated: message.truncated ?? false,
          });
        }
        if (message.type === "error") {
          clean();
          reject(new Error(message.error));
        }
      };
      const request: WorkerRequest = {
        id,
        type: "execute",
        code,
        adapter: problem.adapter,
        cases,
        trace,
        visualization: problem.lesson.visualization,
      };
      worker.postMessage(request);
    });
  }
}
