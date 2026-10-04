import { useState } from "react";
import { ArrowRight, CheckCircle2, Circle, Clock3 } from "lucide-react";
import {
  difficulties,
  orderedPlanProblems,
  planProblemHref,
  studyPlans,
  type StudyPlan as Plan,
} from "../data/studyPlans";
import type { Progress } from "../types";
import "./study-plan.css";

export default function StudyPlan({
  plan,
  progress,
}: {
  plan: Plan;
  progress: Record<string, Progress>;
}) {
  const [expandAll, setExpandAll] = useState<boolean | null>(null);
  const ordered = orderedPlanProblems(plan);
  const isSolved = (slug: string) => progress[slug]?.status === "solved";
  const solved = ordered.filter((p) => isSolved(p.slug)).length;
  const next = ordered.find((p) => !isSolved(p.slug));
  const percent = Math.round((solved / ordered.length) * 100);

  return (
    <main className="library study-plan">
      <div className="library-heading">
        <div>
          <h1>A plan for your next step.</h1>
          <p>Build pattern recognition through related problems.</p>
        </div>
        <div
          className="library-progress"
          aria-label={`${plan.title} plan progress`}
        >
          <div>
            <span>
              {solved} / {ordered.length} solved
            </span>
            <span>{percent}%</span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>

      <nav className="plan-tracks" aria-label="Study tracks">
        {studyPlans.map((track) => (
          <a
            key={track.id}
            href={`#/study-plan/${track.id}`}
            className={`plan-track ${track.id === plan.id ? "active" : ""}`}
            aria-current={track.id === plan.id ? "page" : undefined}
          >
            <span className="plan-track-title">
              {track.title}
              <span>{orderedPlanProblems(track).length} problems</span>
            </span>
            <span className="plan-track-description">{track.description}</span>
          </a>
        ))}
      </nav>

      <section className="plan-next" aria-label="Next study step">
        <div>
          <span className="plan-eyebrow">
            {next ? "UP NEXT" : "PLAN COMPLETE"}
          </span>
          <h2>
            {next
              ? next.title
              : `You’ve completed the ${plan.title.toLowerCase()} plan.`}
          </h2>
          <p>
            {next
              ? `${next.difficulty} · ${plan.groups.find((g) => g.problems.some((p) => p.slug === next.slug))?.title}`
              : "Revisit the problems you found challenging, then explore the full catalog."}
          </p>
        </div>
        <a
          className="plan-action"
          href={next ? planProblemHref(next.slug, plan) : "#/problems"}
        >
          {next
            ? solved || progress[next.slug]
              ? "Continue plan"
              : "Start plan"
            : "Explore all problems"}
          <ArrowRight size={17} />
        </a>
      </section>

      <div className="plan-guidance">
        <p>
          Work through Easy, then Medium
          {ordered.some((p) => p.difficulty === "Hard") ? ", then Hard" : ""}.
          Try each problem for {plan.id === "beginner" ? "30" : "15"} minutes
          before opening the lesson or solution. Explain the approach in your
          own words, solve it, and revisit it in your next study session.
        </p>
        <p>
          Problems shared by both tracks use the same saved progress. There are
          no deadlines; move on when you can explain the pattern.
        </p>
      </div>

      <div className="plan-outline-heading">
        <h2>Your study sequence</h2>
        <button onClick={() => setExpandAll((value) => !value)}>
          {expandAll ? "Collapse groups" : "Expand all groups"}
        </button>
      </div>
      {difficulties.map((difficulty) => {
        const problems = ordered.filter((p) => p.difficulty === difficulty);
        if (!problems.length) return null;
        const complete = problems.filter((p) => isSolved(p.slug)).length;
        return (
          <section
            key={difficulty}
            className="plan-stage"
            aria-label={`${difficulty} stage`}
          >
            <div className="plan-stage-heading">
              <h2>
                <span className={`difficulty ${difficulty.toLowerCase()}`}>
                  {difficulty}
                </span>
                <span>
                  {difficulty === "Easy"
                    ? "Build your foundation"
                    : difficulty === "Medium"
                      ? "Connect the patterns"
                      : "Take on the challenges"}
                </span>
              </h2>
              <span>
                {complete} / {problems.length} solved
              </span>
            </div>
            {plan.groups.map((group, index) => {
              const members = group.problems.filter(
                (p) => p.difficulty === difficulty,
              );
              if (!members.length) return null;
              const done = members.filter((p) => isSolved(p.slug)).length;
              const containsNext = members.some((p) => p.slug === next?.slug);
              return (
                <details
                  key={`${group.id}-${expandAll}-${next?.slug}`}
                  className="plan-group"
                  open={expandAll ?? containsNext}
                >
                  <summary>
                    <span className="plan-group-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="plan-group-info">
                      <strong>{group.title}</strong>
                      <span>{group.goal}</span>
                    </span>
                    <span
                      className={`plan-group-count ${done === members.length ? "solved" : ""}`}
                    >
                      {done === members.length && <CheckCircle2 size={16} />}
                      {done} / {members.length}
                    </span>
                  </summary>
                  <ol className="plan-problems">
                    {members.map((problem) => (
                      <li key={problem.slug}>
                        <a
                          href={planProblemHref(problem.slug, plan)}
                          aria-current={
                            problem.slug === next?.slug ? "step" : undefined
                          }
                        >
                          <span
                            className={
                              isSolved(problem.slug) ? "solved" : "muted"
                            }
                            aria-label={
                              isSolved(problem.slug)
                                ? "Solved"
                                : progress[problem.slug]
                                  ? "In progress"
                                  : "Not started"
                            }
                          >
                            {isSolved(problem.slug) ? (
                              <CheckCircle2 size={17} />
                            ) : progress[problem.slug] ? (
                              <Clock3 size={17} />
                            ) : (
                              <Circle size={17} />
                            )}
                          </span>
                          <span className="plan-problem-title">
                            {problem.title}
                          </span>
                          {problem.slug === next?.slug && (
                            <span className="plan-next-label">Up next</span>
                          )}
                          <span
                            className={`difficulty ${problem.difficulty.toLowerCase()}`}
                          >
                            {problem.difficulty}
                          </span>
                          <ArrowRight size={15} />
                        </a>
                      </li>
                    ))}
                  </ol>
                </details>
              );
            })}
          </section>
        );
      })}
      <footer className="library-footer">
        <span>
          {ordered.length} problems · {plan.groups.length} pattern groups
        </span>
        <span>
          Groups adapted from{" "}
          <a
            href={`https://seanprashad.com/leetcode-patterns/?view=${plan.id}`}
            target="_blank"
            rel="noreferrer"
          >
            Sean Prashad’s {plan.title.toLowerCase()} roadmap
          </a>
        </span>
      </footer>
    </main>
  );
}
