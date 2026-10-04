import { useState, useEffect, useMemo, useRef } from "react";
import type { KeyboardEvent } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  LoaderCircle,
  CheckCircle2,
  ArrowRight,
  Code2,
} from "lucide-react";
import type { ProblemDefinition, TraceStep } from "../types";
import { PythonRunner } from "../runtime/runner";
import VisualState from "./VisualState";
import { visualizationFor } from "../data/visualizationBindings";
import "./walkthrough.css";

type StepMode = "changes" | "lines";

// Snapshot metadata identifies structures; it is not a Python variable value.
function cleanMetadata(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(cleanMetadata);
  if (value !== null && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !key.startsWith("__") || key === "__kind")
        .map(([key, item]) => [key, cleanMetadata(item)]),
    );
  return value;
}
function stateSignature(step: TraceStep) {
  const values = Object.fromEntries(
    Object.entries(step.variables).filter(([key]) => !key.startsWith("_")),
  );
  return JSON.stringify([step.function, step.depth, cleanMetadata(values)]);
}
function changedStepIndices(steps: TraceStep[]) {
  const result: number[] = [];
  let previous = "";
  steps.forEach((step, index) => {
    const signature = stateSignature(step);
    if (
      index === 0 ||
      index === steps.length - 1 ||
      step.event === "return" ||
      signature !== previous
    )
      result.push(index);
    previous = signature;
  });
  return result;
}
function compactValue(value: unknown): string {
  if (value === undefined) return "not set";
  if (value === null) return "None";
  if (typeof value === "string")
    return JSON.stringify(value.length > 48 ? `${value.slice(0, 45)}…` : value);
  if (Array.isArray(value))
    return `[${value.slice(0, 4).map(compactValue).join(", ")}${value.length > 4 ? ", …" : ""}]`;
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.__kind === "string" && Array.isArray(record.nodes)) {
      const values = record.nodes
        .slice(0, 4)
        .map((node: { value?: unknown }) => compactValue(node.value));
      return `${record.__kind} [${values.join(", ")}${record.nodes.length > 4 ? ", …" : ""}]`;
    }
    const entries = Object.entries(record).filter(
      ([name]) => !name.startsWith("__"),
    );
    return `{${entries
      .slice(0, 3)
      .map(([key, val]) => `${key}: ${compactValue(val)}`)
      .join(", ")}${entries.length > 3 ? ", …" : ""}}`;
  }
  return String(value);
}
function preview(value: unknown) {
  const text = compactValue(value);
  return text.length > 120 ? `${text.slice(0, 117)}…` : text;
}

export default function Walkthrough({
  problem,
}: {
  problem: ProblemDefinition;
}) {
  const [inputText, setInputText] = useState(() =>
    JSON.stringify(problem.tests[0].input, null, 2),
  );
  const [input, setInput] = useState(problem.tests[0].input);
  const [example, setExample] = useState("0");
  const [steps, setSteps] = useState<TraceStep[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [mode, setMode] = useState<StepMode>("changes");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [truncated, setTruncated] = useState(false);
  const [busy, setBusy] = useState(true);
  const [showAllChanges, setShowAllChanges] = useState(false);
  const runner = useRef<PythonRunner | null>(null);
  if (runner.current === null) runner.current = new PythonRunner();
  const generation = useRef(0);
  const activeLine = useRef<HTMLDivElement>(null);
  const changeIndices = useMemo(() => changedStepIndices(steps), [steps]);
  const navigationIndices = useMemo(
    () =>
      mode === "changes" ? changeIndices : steps.map((_, position) => position),
    [mode, steps, changeIndices],
  );
  const position = Math.max(0, navigationIndices.indexOf(index));
  const step = steps[index];
  const previousStep = steps[index - 1];
  const changes = useMemo(() => {
    if (!step) return [];
    const previous = previousStep?.variables ?? {};
    const names = new Set([
      ...Object.keys(previous),
      ...Object.keys(step.variables),
    ]);
    return [...names]
      .filter((name) => !name.startsWith("_"))
      .filter(
        (name) =>
          JSON.stringify(cleanMetadata(previous[name])) !==
          JSON.stringify(cleanMetadata(step.variables[name])),
      )
      .map((name) => ({
        name,
        before: cleanMetadata(previous[name]),
        after: cleanMetadata(step.variables[name]),
      }));
  }, [step, previousStep]);
  const sourceLines = useMemo(
    () => problem.solution.split("\n"),
    [problem.solution],
  );
  const topLevelReturn = step?.event === "return" && step.depth === 1;

  async function generate(text: string) {
    const token = ++generation.current;
    runner.current!.cancel();
    setPlaying(false);
    setError("");
    setStatus("");
    setBusy(false);
    let parsed: Record<string, unknown>;
    try {
      if (text.length > 15000)
        throw new Error("Please use a smaller input for the walkthrough.");
      parsed = JSON.parse(text);
      if (!parsed || Array.isArray(parsed) || typeof parsed !== "object")
        throw new Error(
          "Use a JSON object with the input fields shown in the example.",
        );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return;
    }
    setInput(parsed);
    setBusy(true);
    setSteps([]);
    setIndex(0);
    setTruncated(false);
    try {
      const out = await runner.current!.execute(
        problem,
        problem.solution,
        [
          {
            name: "Walkthrough",
            input: parsed,
            expected: null,
            evaluateOnly: true,
          },
        ],
        true,
        (message) => {
          if (token === generation.current) setStatus(message);
        },
      );
      if (token !== generation.current) return;
      if (out.cases[0]?.error) throw new Error(out.cases[0].error);
      setSteps(out.steps);
      setTruncated(out.truncated);
      setStatus("");
    } catch (err) {
      if (token === generation.current)
        setError(err instanceof Error ? err.message : String(err));
    } finally {
      if (token === generation.current) setBusy(false);
    }
  }
  useEffect(() => {
    const firstInput = JSON.stringify(problem.tests[0].input, null, 2);
    setInputText(firstInput);
    setExample("0");
    generate(firstInput);
    return () => {
      generation.current++;
      runner.current!.cancel();
    };
  }, [problem.slug]);
  useEffect(() => {
    if (!playing) return;
    if (position >= navigationIndices.length - 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(
      () => setIndex(navigationIndices[position + 1]),
      1000 / speed,
    );
    return () => clearTimeout(id);
  }, [playing, speed, position, navigationIndices]);
  useEffect(() => {
    const line = activeLine.current,
      container = line?.parentElement;
    if (!line || !container) return;
    const y = line.offsetTop;
    if (y < container.scrollTop) container.scrollTop = y;
    else if (
      y + line.offsetHeight >
      container.scrollTop + container.clientHeight
    )
      container.scrollTop = y + line.offsetHeight - container.clientHeight;
  }, [index]);
  function move(delta: number) {
    setPlaying(false);
    const next = Math.max(
      0,
      Math.min(navigationIndices.length - 1, position + delta),
    );
    if (navigationIndices[next] !== undefined)
      setIndex(navigationIndices[next]);
  }
  function togglePlayback() {
    if (position === navigationIndices.length - 1) setIndex(0);
    setPlaying((value) => !value);
  }
  function keyboardStep(event: KeyboardEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      target.closest(
        "input, textarea, select, [contenteditable], .cm-editor",
      ) ||
      !steps.length ||
      busy
    )
      return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowRight" ? 1 : -1);
    } else if (event.target === event.currentTarget && event.key === " ") {
      event.preventDefault();
      togglePlayback();
    } else if (
      event.target === event.currentTarget &&
      (event.key === "Home" || event.key === "End")
    ) {
      event.preventDefault();
      setPlaying(false);
      setIndex(event.key === "Home" ? 0 : steps.length - 1);
    }
  }
  function changeMode(nextMode: StepMode) {
    setPlaying(false);
    setMode(nextMode);
    if (nextMode === "changes")
      setIndex(
        changeIndices.find((candidate) => candidate >= index) ??
          changeIndices.at(-1) ??
          0,
      );
  }
  const stop = () => {
    generation.current++;
    runner.current!.cancel();
    setBusy(false);
    setStatus("");
    setError("Walkthrough stopped. Apply the input to restart.");
  };
  return (
    <div
      className="walkthrough panel"
      tabIndex={0}
      aria-label="Algorithm walkthrough controls"
      onKeyDown={keyboardStep}
    >
      <div className="panel-heading">
        <h2>Algorithm walkthrough</h2>
        <span className="algorithm-label">
          {problem.lesson.visualization.kind.replaceAll("-", " ")}
        </span>
      </div>
      <div className="trace-input">
        <div className="wt-example-row">
          <label htmlFor="walkthrough-example">Choose an example</label>
          <select
            id="walkthrough-example"
            value={example}
            onChange={(event) => {
              const chosen = event.target.value;
              setExample(chosen);
              if (chosen === "custom") return;
              const text = JSON.stringify(
                problem.tests[Number(chosen)].input,
                null,
                2,
              );
              setInputText(text);
              generate(text);
            }}
          >
            {problem.tests.map((test, testIndex) => (
              <option value={testIndex} key={testIndex}>
                {test.name}
              </option>
            ))}
            <option value="custom">Custom input</option>
          </select>
        </div>
        <label htmlFor="trace-input">
          Example input <span>JSON · edit and apply</span>
        </label>
        <div className="input-action">
          <textarea
            id="trace-input"
            value={inputText}
            spellCheck={false}
            onChange={(event) => {
              setInputText(event.target.value);
              setExample("custom");
            }}
            rows={Math.max(1, Math.min(4, inputText.split("\n").length))}
          />
          <button
            className="primary"
            disabled={busy}
            onClick={() => generate(inputText)}
          >
            Apply
          </button>
        </div>
      </div>
      {busy ? (
        <div className="loading">
          <LoaderCircle className="spin" size={24} />
          <span>{status || "Preparing walkthrough…"}</span>
          <button className="subtle" onClick={stop}>
            Stop
          </button>
        </div>
      ) : error ? (
        <div className="error" role="alert">
          {error}
        </div>
      ) : (
        <>
          <div className="wt-toolbar">
            <div className="wt-step-options">
              <div className="wt-step-mode" role="group" aria-label="Step mode">
                <button
                  aria-pressed={mode === "changes"}
                  onClick={() => changeMode("changes")}
                >
                  State changes
                </button>
                <button
                  aria-pressed={mode === "lines"}
                  onClick={() => changeMode("lines")}
                >
                  Every Python line
                </button>
              </div>
              <span className="wt-shortcuts">Focus here · ← / → to step</span>
            </div>
            <div className="playback">
              <div className="playback-buttons">
                <button
                  aria-label="Previous step"
                  disabled={position === 0 || !steps.length}
                  onClick={() => move(-1)}
                >
                  <SkipBack size={17} />
                </button>
                <button
                  className="primary"
                  disabled={!steps.length}
                  onClick={togglePlayback}
                >
                  {playing ? <Pause size={16} /> : <Play size={16} />}{" "}
                  {playing ? "Pause" : "Play"}
                </button>
                <button
                  aria-label="Next step"
                  disabled={
                    !steps.length || position >= navigationIndices.length - 1
                  }
                  onClick={() => move(1)}
                >
                  <SkipForward size={17} />
                </button>
                <button
                  aria-label="Reset walkthrough"
                  disabled={!steps.length}
                  onClick={() => {
                    setPlaying(false);
                    setIndex(0);
                  }}
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  aria-label="Last step"
                  disabled={
                    !steps.length || position >= navigationIndices.length - 1
                  }
                  onClick={() => {
                    setPlaying(false);
                    setIndex(steps.length - 1);
                  }}
                >
                  End
                </button>
              </div>
              <span className="step-count">
                Step {steps.length ? position + 1 : 0} of{" "}
                {navigationIndices.length}
              </span>
              <select
                aria-label="Playback speed"
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
              >
                <option value={0.5}>0.5×</option>
                <option value={1}>1×</option>
                <option value={2}>2×</option>
                <option value={4}>4×</option>
              </select>
            </div>
            <input
              className="scrubber"
              aria-label="Algorithm step"
              aria-valuetext={`Step ${position + 1} of ${navigationIndices.length}, Python event ${index + 1} of ${steps.length}`}
              disabled={!steps.length}
              type="range"
              min={0}
              max={Math.max(0, navigationIndices.length - 1)}
              value={position}
              onChange={(event) => {
                setPlaying(false);
                setIndex(navigationIndices[Number(event.target.value)] ?? 0);
              }}
            />
            <div className="wt-progress-note">
              <span>
                {mode === "changes"
                  ? `${changeIndices.length} meaningful states`
                  : "Full Python execution trace"}
              </span>
              <span>
                Python event {steps.length ? index + 1 : 0} / {steps.length}
              </span>
            </div>
            {step && (
              <div className="wt-live-instruction" title={step.explanation}>
                <span>
                  {step.event === "return" ? "Return" : "Before"} line{" "}
                  {step.line}
                </span>
                <code>{sourceLines[step.line - 1]?.trim()}</code>
              </div>
            )}
          </div>
          <VisualState
            slug={problem.slug}
            step={step}
            previousStep={steps[index - 1]}
            config={visualizationFor(
              problem.slug,
              problem.lesson.visualization,
            )}
            input={input}
          />
          <div
            className={`insight wt-instruction ${topLevelReturn ? "returned" : ""}`}
          >
            {topLevelReturn ? <CheckCircle2 size={18} /> : <Code2 size={18} />}
            <div>
              <div className="wt-event-heading">
                <strong>
                  {step?.event === "return"
                    ? step.depth > 1
                      ? "Helper returned"
                      : "Function returned"
                    : "Next instruction"}
                </strong>
                {step && (
                  <span>
                    {step.function} · line {step.line} · depth {step.depth}
                  </span>
                )}
              </div>
              <p>
                {step?.explanation ??
                  "Choose a small example to follow each algorithm decision."}
              </p>
              <span className="wt-semantics">
                {step?.event === "return"
                  ? "This snapshot includes this function’s returned value; other calls may continue."
                  : "The highlighted line has not executed yet. Values show the state before it runs."}
              </span>
            </div>
          </div>
          <div className="wt-changes">
            <div className="wt-changes-heading">
              <span>
                {index === 0
                  ? "Starting values"
                  : "What changed since the previous Python event"}
              </span>
              {changes.length > 5 && (
                <button
                  className="subtle"
                  onClick={() => setShowAllChanges((value) => !value)}
                >
                  {showAllChanges ? "Show less" : `Show all ${changes.length}`}
                </button>
              )}
            </div>
            {changes.length ? (
              <div className="wt-change-list">
                {(showAllChanges ? changes : changes.slice(0, 5)).map(
                  (change) => (
                    <div className="wt-change" key={change.name}>
                      <strong title={change.name}>
                        {problem.lesson.visualization.labels[change.name] ??
                          change.name}
                      </strong>
                      <code title={JSON.stringify(change.before)}>
                        {preview(change.before)}
                      </code>
                      <ArrowRight size={13} aria-label="changed to" />
                      <code
                        className="wt-after"
                        title={JSON.stringify(change.after)}
                      >
                        {preview(change.after)}
                      </code>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p>
                No tracked values changed at this event. Follow the highlighted
                instruction or switch to State changes.
              </p>
            )}
          </div>
          {truncated && (
            <p className="notice">
              Showing the first 2,000 Python events. Choose a smaller example
              for a complete walkthrough.
            </p>
          )}
          <div className="trace-code">
            <div className="structure-label">
              Python reference <span> · {step?.function ?? "solution"}</span>
            </div>
            <div className="code-lines">
              {sourceLines.map((line, lineIndex) => (
                <div
                  ref={lineIndex + 1 === step?.line ? activeLine : undefined}
                  className={`code-line ${lineIndex + 1 === step?.line ? "highlighted" : ""}`}
                  key={lineIndex}
                >
                  <span className="line-number">{lineIndex + 1}</span>
                  <code
                    className={line.trim().startsWith("#") ? "comment" : ""}
                  >
                    {line || " "}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
