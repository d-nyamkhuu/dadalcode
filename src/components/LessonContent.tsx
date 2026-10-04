import type { ProblemDefinition } from "../types";
import ConceptIllustration from "./ConceptIllustration";
import "./lesson-enhancements.css";

function Text({ children }: { children: string }) {
  return (
    <>
      {children
        .split(/(`[^`]+`)/g)
        .map((part, i) =>
          part.startsWith("`") && part.endsWith("`") ? (
            <code key={i}>{part.slice(1, -1)}</code>
          ) : (
            part
          ),
        )}
    </>
  );
}
export function Complexity({ problem }: { problem: ProblemDefinition }) {
  return (
    <>
      <div className="complexity">
        <div>
          <span>Time complexity</span>
          <strong>{problem.lesson.complexity.time}</strong>
        </div>
        <div>
          <span>Space complexity</span>
          <strong>{problem.lesson.complexity.space}</strong>
        </div>
      </div>
      <p className="complexity-note">{problem.lesson.complexity.explanation}</p>
    </>
  );
}
export function Example({ problem }: { problem: ProblemDefinition }) {
  const example = problem.tests[0];
  return (
    <div className="example">
      <h3>Example</h3>
      <div>
        <b>Input:</b>
        <code>{JSON.stringify(example.input)}</code>
      </div>
      <div>
        <b>Output:</b>
        <code>{JSON.stringify(example.expected)}</code>
      </div>
      <p>{example.name}</p>
    </div>
  );
}
export default function LessonContent({
  problem,
  mode,
}: {
  problem: ProblemDefinition;
  mode: "learn" | "practice" | "solution";
}) {
  const l = problem.lesson,
    editorial = problem.explanation;
  const id = (section: string) => `lesson-${problem.slug}-${mode}-${section}`;
  const sections = [
    ["intuition", "Intuition"],
    ["algorithm", "Algorithm"],
    ["example", "Walkthrough"],
    ["code", "Code"],
    ["complexity", "Complexity"],
  ];
  return (
    <article className="lesson-text editorial-lesson">
      <h2>{mode === "practice" ? problem.title : l.headline}</h2>
      {mode !== "practice" && (
        <nav className="lesson-chapters" aria-label="Lesson sections">
          {sections
            .filter(([key]) => editorial || !["example", "code"].includes(key))
            .map(([key, label]) => (
              <button
                key={key}
                onClick={() =>
                  document
                    .getElementById(id(key))
                    ?.scrollIntoView({ block: "start" })
                }
              >
                {label}
              </button>
            ))}
        </nav>
      )}
      {mode !== "solution" && (
        <>
          <p>{l.statement}</p>
          <ConceptIllustration slug={problem.slug} mode="problem" />
          <Example problem={problem} />
        </>
      )}
      {mode === "practice" ? (
        <section>
          <h3>Constraints</h3>
          <ul>
            {l.constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      ) : (
        <>
          {mode === "learn" && (
            <details className="prerequisites">
              <summary>Before you begin</summary>
              <ul>
                {l.prerequisites.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </details>
          )}
          <section id={id("intuition")} className="editorial-section">
            <span className="chapter-kicker">01 · Understand the idea</span>
            <h3>Intuition</h3>
            {(editorial?.intuition ?? [l.intuition]).map((p, i) => (
              <p key={i}>
                <Text>{p}</Text>
              </p>
            ))}
            {mode === "solution" && (
              <ConceptIllustration slug={problem.slug} mode="solution" />
            )}
          </section>
          <section id={id("algorithm")} className="editorial-section">
            <span className="chapter-kicker">
              02 · Turn the idea into steps
            </span>
            <h3>Algorithm</h3>
            <ol className="approach">
              {l.approach.map((step, i) => (
                <li key={i}>
                  <Text>{step}</Text>
                </li>
              ))}
            </ol>
          </section>
          {editorial && (
            <section
              id={id("example")}
              className="editorial-section worked-example"
            >
              <span className="chapter-kicker">
                03 · Follow a concrete example
              </span>
              <h3>Example walkthrough</h3>
              <div className="worked-input">
                <span>Input</span>
                <code>{JSON.stringify(editorial.walkthrough.input)}</code>
              </div>
              <ol className="worked-steps">
                {editorial.walkthrough.steps.map((step, i) => (
                  <li key={i}>
                    <span className="worked-step-index">{i + 1}</span>
                    <p>
                      <Text>{step}</Text>
                    </p>
                  </li>
                ))}
              </ol>
              <div className="worked-output">
                <span>Result</span>
                <code>{JSON.stringify(editorial.walkthrough.result)}</code>
              </div>
              <a
                className="walkthrough-link"
                href={`#/problems/${problem.slug}/learn`}
              >
                Explore the executable walkthrough →
              </a>
            </section>
          )}
          {editorial && (
            <section
              id={id("code")}
              className="editorial-section code-explanation"
            >
              <span className="chapter-kicker">
                04 · Connect the code to the reasoning
              </span>
              <h3>Key code, explained</h3>
              {editorial.codeNotes.map(({ code, note }, i) => {
                const offset = problem.solution.indexOf(code),
                  line =
                    offset >= 0
                      ? problem.solution.slice(0, offset).split("\n").length
                      : null;
                return (
                  <div className="code-note" key={i}>
                    <span className="code-note-line">
                      Python{line ? ` · line ${line}` : ""}
                    </span>
                    <pre>
                      <code>{code}</code>
                    </pre>
                    <p>
                      <Text>{note}</Text>
                    </p>
                  </div>
                );
              })}
            </section>
          )}
          <section className="editorial-section">
            <h3>Why it works</h3>
            <p>
              <Text>{l.correctness}</Text>
            </p>
          </section>
          <section id={id("complexity")} className="editorial-section">
            <h3>Complexity analysis</h3>
            <Complexity problem={problem} />
          </section>
          <details className="prerequisites">
            <summary>The brute-force starting point</summary>
            <p>
              <Text>{l.bruteForce}</Text>
            </p>
          </details>
          <section>
            <h3>Common mistakes</h3>
            <ul>
              {l.pitfalls.map((p) => (
                <li key={p}>
                  <Text>{p}</Text>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
      <footer className="sources">
        <span>Problem sources</span>
        {l.sources.map((source, i) => (
          <a href={source.url} key={i} target="_blank" rel="noreferrer">
            {source.label}
          </a>
        ))}
      </footer>
    </article>
  );
}
