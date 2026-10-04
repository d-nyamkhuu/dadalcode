import type { ProblemDefinition } from "../types";
import ConceptIllustration from "./ConceptIllustration";
import LessonFigure from "./LessonFigure";
import { ExampleInput, ExampleOutput } from "./ExampleValue";
import { lessonVocabulary } from "../data/lessonVocabulary";
import Text, { LessonTextProvider } from "./LessonText";
import "./lesson-enhancements.css";
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
      <p className="complexity-note">
        <Text>{problem.lesson.complexity.explanation}</Text>
      </p>
    </>
  );
}
export function Example({ problem }: { problem: ProblemDefinition }) {
  const example = problem.tests[0];
  return (
    <div className="example">
      <div className="example-heading">
        <h3>Example</h3>
        <p>
          <Text>{example.name}</Text>
        </p>
      </div>
      <div className="example-body">
        <div className="example-panel">
          <h4>Input</h4>
          <ExampleInput problem={problem} value={example.input} />
        </div>
        <div className="example-panel example-result">
          <h4>Output</h4>
          <ExampleOutput
            problem={problem}
            value={example.expected}
            input={example.input}
          />
        </div>
      </div>
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
  const words = mode === "practice" ? [] : lessonVocabulary(problem);
  const [mainIdea, ...ideaDetails] = editorial?.intuition ?? [l.intuition];
  const id = (section: string) => `lesson-${problem.slug}-${mode}-${section}`;
  const sections = [
    ["intuition", "Main idea"],
    ["algorithm", "Steps"],
    ["example", "Example"],
    ["code", "Code"],
    ["complexity", "Complexity"],
  ];
  return (
    <LessonTextProvider problem={problem}>
      <article className="lesson-text editorial-lesson">
        <h2>{mode === "practice" ? problem.title : l.headline}</h2>
        {mode !== "practice" && (
          <nav className="lesson-chapters" aria-label="Lesson sections">
            {sections
              .filter(
                ([key]) => editorial || !["example", "code"].includes(key),
              )
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
            <p>
              <Text>{l.statement}</Text>
            </p>
            <ConceptIllustration slug={problem.slug} mode="problem" />
            <Example problem={problem} />
          </>
        )}
        {mode === "practice" ? (
          <section>
            <h3>Constraints</h3>
            <ul>
              {l.constraints.map((c) => (
                <li key={c}>
                  <Text>{c}</Text>
                </li>
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
                    <li key={p}>
                      <Text>{p}</Text>
                    </li>
                  ))}
                </ul>
              </details>
            )}
            {words.length > 0 ? (
              <details className="lesson-vocabulary">
                <summary>
                  Words used in this lesson{" "}
                  <span>{words.length} short definitions</span>
                </summary>
                <dl>
                  {words.map(({ term, meaning }) => (
                    <div key={term}>
                      <dt>{term}</dt>
                      <dd>
                        <Text>{meaning}</Text>
                      </dd>
                    </div>
                  ))}
                </dl>
              </details>
            ) : null}
            <section id={id("intuition")} className="editorial-section">
              <span className="chapter-kicker">01 · Understand the idea</span>
              <h3>The main idea</h3>
              <p>
                <Text>{mainIdea}</Text>
              </p>
              {editorial?.keyDecision ? (
                <aside className="key-decision">
                  <h4>Key decision</h4>
                  <p>
                    <Text>{editorial.keyDecision}</Text>
                  </p>
                </aside>
              ) : null}
              {ideaDetails.map((p, i) => (
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
              <h3>Step by step</h3>
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
                  <ExampleInput
                    problem={problem}
                    value={editorial.walkthrough.input}
                  />
                </div>
                <ol className="worked-steps">
                  {editorial.walkthrough.steps.map((step, i) => (
                    <li key={i}>
                      <span className="worked-step-index">{i + 1}</span>
                      <div className="worked-step-content">
                        <p>
                          <Text>{step}</Text>
                        </p>
                        {editorial.figures
                          ?.filter((figure) => figure.afterStep === i)
                          .map((figure, index) => (
                            <LessonFigure figure={figure} key={index} />
                          ))}
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="worked-output">
                  <span>Result</span>
                  <ExampleOutput
                    problem={problem}
                    value={editorial.walkthrough.result}
                    input={editorial.walkthrough.input}
                  />
                </div>
                <a
                  className="walkthrough-link"
                  href={`#/problems/${problem.slug}/learn`}
                >
                  Try this example in the step player →
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
              <h3>Time and memory</h3>
              <Complexity problem={problem} />
            </section>
            <details className="prerequisites">
              <summary>A simpler, slower approach</summary>
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
          <span>Sources and further reading</span>
          {l.sources.map((source, i) => (
            <a href={source.url} key={i} target="_blank" rel="noreferrer">
              {source.label}
            </a>
          ))}
        </footer>
      </article>
    </LessonTextProvider>
  );
}
