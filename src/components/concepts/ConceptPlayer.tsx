import { useEffect, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import type { ConceptDrawings, ProblemDefinition } from "../../types";
import { diagramLoaders } from "./registry";
import ConceptDiagram from "./ConceptDiagram";
import "./concepts.css";

export default function ConceptPlayer({
  problem,
}: {
  problem: ProblemDefinition;
}) {
  const concept = problem.explanation!.concept;
  const [index, setIndex] = useState(0);
  const [drawings, setDrawings] = useState<ConceptDrawings | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let live = true;
    diagramLoaders[problem.slug]()
      .then((module) => {
        if (live) {
          setDrawings(module.default);
          setError("");
        }
      })
      .catch(() => {
        if (live) setError("The visual story could not load. Please retry.");
      });
    return () => {
      live = false;
    };
  }, [problem.slug, attempt]);
  const scene = concept.scenes[index];
  function keyboard(event: KeyboardEvent<HTMLElement>) {
    if (
      event.target !== event.currentTarget ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") setIndex(0);
    else if (event.key === "End") setIndex(concept.scenes.length - 1);
    else
      setIndex((value) =>
        Math.max(
          0,
          Math.min(
            concept.scenes.length - 1,
            value + (event.key === "ArrowRight" ? 1 : -1),
          ),
        ),
      );
  }
  return (
    <section
      className="concept-player panel"
      aria-label={`${problem.title} visual story`}
      tabIndex={0}
      onKeyDown={keyboard}
    >
      <div className="concept-player-header">
        <h2>See the idea unfold</h2>
        <span className="concept-progress">
          Scene {index + 1} of {concept.scenes.length}
        </span>
      </div>
      <div className="concept-toolbar">
        <button onClick={() => setIndex(0)} aria-label="Replay visual story">
          <RotateCcw size={16} /> Replay
        </button>
        <label className="concept-scene-selector">
          Scene
          <select
            aria-label="Choose scene"
            value={index}
            onChange={(event) => setIndex(Number(event.target.value))}
          >
            {concept.scenes.map((item, i) => (
              <option value={i} key={item.id}>
                {i + 1}. {item.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="concept-navigation">
        <button
          disabled={index === 0}
          onClick={() => setIndex((value) => value - 1)}
          aria-label="Previous scene"
        >
          <ArrowLeft size={16} /> Previous
        </button>
        <progress
          value={index + 1}
          max={concept.scenes.length}
          aria-label="Visual story progress"
        />
        <button
          className="primary"
          disabled={index === concept.scenes.length - 1}
          onClick={() => setIndex((value) => value + 1)}
          aria-label="Next scene"
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
      {error ? (
        <div className="notice" role="alert">
          {error}
          <button onClick={() => setAttempt((value) => value + 1)}>
            Retry visual story
          </button>
        </div>
      ) : drawings ? (
        <div className="concept-stage" key={scene.id}>
          <ConceptDiagram drawing={drawings[scene.id]} />
        </div>
      ) : (
        <div className="concept-stage concept-loading" role="status">
          Loading the visual story…
        </div>
      )}
      <div className="concept-narration" aria-live="polite" aria-atomic="true">
        <h3>{scene.title}</h3>
        <p>{scene.narration}</p>
        <div className="concept-decision">
          <strong>Why this matters</strong>
          <p>{scene.decision}</p>
        </div>
      </div>
      <p className="concept-keyboard-hint">
        Focus this panel to use ← / →. Home starts again; End shows the final
        scene.
      </p>
    </section>
  );
}
