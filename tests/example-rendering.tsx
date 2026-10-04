import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { ExampleInput, ExampleOutput } from "../src/components/ExampleValue";
import type { ProblemDefinition, TestCase } from "../src/types";

// Browser-only fixture harness, served by Vite and never imported by the app.
const container = document.createElement("div");
container.className = "lesson-text editorial-lesson";
container.style.cssText =
  "width:320px;position:absolute;left:0;top:0;background:#101518";
document.body.append(container);
const root = createRoot(container);

export function renderExample(problem: ProblemDefinition, fixture: TestCase) {
  flushSync(() =>
    root.render(
      <div className="example">
        <div className="example-panel">
          <ExampleInput problem={problem} value={fixture.input} />
        </div>
        <div className="example-panel example-result">
          <ExampleOutput
            problem={problem}
            value={fixture.expected}
            input={fixture.input}
          />
        </div>
      </div>,
    ),
  );
  return container;
}
export function cleanup() {
  root.unmount();
  container.remove();
}
