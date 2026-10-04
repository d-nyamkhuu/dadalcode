import harness from "./harness.py?raw";
import type { WorkerRequest, WorkerResponse } from "../types";

import type { PyodideInterface } from "pyodide";
let runtime: Promise<PyodideInterface> | undefined;
function loadRuntime() {
  return (runtime ??= (async () => {
    const indexURL = new URL(
      `${import.meta.env.BASE_URL}pyodide/`,
      self.location.origin,
    ).href;
    const url = new URL("pyodide.mjs", indexURL).href;
    const { loadPyodide } = await import(/* @vite-ignore */ url);
    const py = await loadPyodide({ indexURL });
    py.runPython(harness);
    return py;
  })());
}
const send = (message: WorkerResponse) => self.postMessage(message);
self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const request = event.data;
  try {
    const py = await loadRuntime();
    send({ id: request.id, type: "ready" });
    let steps = [],
      truncated = false;
    for (let index = 0; index < request.cases.length; index++) {
      send({ id: request.id, type: "case-start", index });
      py.globals.set(
        "_request_json",
        JSON.stringify({ ...request, fixture: request.cases[index] }),
      );
      const raw = py.runPython(
        `_request = json.loads(_request_json)\n_response = run_case(_request['code'], _request['adapter'], _request['fixture'], _request['trace'], _request['visualization'])\njson.dumps(_response)`,
      );
      const response = JSON.parse(raw);
      send({
        id: request.id,
        type: "case-result",
        result: response.result,
        index,
      });
      steps = response.steps;
      truncated = response.truncated;
      // Yield between test cases so progress messages can paint.
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    send({ id: request.id, type: "complete", steps, truncated });
  } catch (error) {
    send({ id: request.id, type: "error", error: String(error) });
  }
};
