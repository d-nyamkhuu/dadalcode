import type { ProblemDefinition } from "../../types";
import { ConceptExampleInput, ConceptExampleOutput } from "./ConceptExample";
import "../lesson-enhancements.css";
import "./concepts.css";

export default function ConceptLesson({
  problem,
  solutionHref,
}: {
  problem: ProblemDefinition;
  solutionHref: string;
}) {
  const concept = problem.explanation!.concept,
    example = problem.explanation!.walkthrough;
  const id = (section: string) => `concept-${problem.slug}-${section}`;
  const sections = [
    ["idea", "Idea"],
    ["example", "Example"],
    ["reason", "Why it works"],
    ["cost", "Cost"],
    ["mistakes", "Mistakes"],
  ];
  return (
    <article className="lesson-text editorial-lesson concept-lesson">
      <h2>{concept.question}</h2>
      <nav className="lesson-chapters" aria-label="Lesson sections">
        {sections.map(([key, label]) => (
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
      <section id={id("idea")} className="editorial-section">
        <h3>The useful observation</h3>
        {concept.intuition.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        <aside className="key-decision">
          <h4>The rule to remember</h4>
          <p>{concept.observation}</p>
        </aside>
      </section>
      {concept.illustrations.map((illustration) => (
        <figure className="concept-illustration" key={illustration.src}>
          <img
            src={`${import.meta.env.BASE_URL}${illustration.src}`}
            alt={illustration.alt}
            width="1536"
            height="768"
            loading="lazy"
          />
          <figcaption>
            <p>{illustration.caption}</p>
          </figcaption>
        </figure>
      ))}
      <section className="editorial-section">
        <h3>Build the answer</h3>
        <ol className="approach">
          {concept.approach.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>
      <section id={id("example")} className="editorial-section">
        <h3>Explore this example</h3>
        <div className="worked-input">
          <span>Starting information</span>
          <ConceptExampleInput value={example.input} slug={problem.slug} />
        </div>
        <p>
          Follow the visual story beside this lesson. Each scene shows the next
          choice and explains why it is safe.
        </p>
        <div className="worked-output">
          <span>Answer</span>
          <ConceptExampleOutput value={example.result} />
        </div>
      </section>
      <section id={id("reason")} className="editorial-section">
        <h3>Why it works</h3>
        <p>{concept.correctness}</p>
      </section>
      <section id={id("cost")} className="editorial-section">
        <h3>How much work?</h3>
        <div className="complexity">
          <div>
            <span>Time</span>
            <strong>{concept.complexity.time}</strong>
          </div>
          <div>
            <span>Extra memory</span>
            <strong>{concept.complexity.space}</strong>
          </div>
        </div>
        <p className="complexity-note">{concept.complexity.explanation}</p>
      </section>
      <section id={id("mistakes")} className="editorial-section">
        <h3>Watch out for</h3>
        <ul>
          {concept.pitfalls.map((pitfall, i) => (
            <li key={i}>{pitfall}</li>
          ))}
        </ul>
      </section>
      <a className="walkthrough-link" href={solutionHref}>
        Connect this idea to Python →
      </a>
      <footer className="sources">
        <span>Sources and further reading</span>
        {problem.lesson.sources.map((source) => (
          <a
            key={source.url}
            href={source.url}
            target="_blank"
            rel="noreferrer"
          >
            {source.label}
          </a>
        ))}
      </footer>
    </article>
  );
}
