import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { ProblemDefinition } from "../types";

const VariablePattern = createContext<RegExp | null>(null);
const markup =
  /(`[^`\n]+`|(?<![\w*])\*\*(?!\s)[^*\n]+(?<!\s)\*\*(?![\w*])|(?<![\w*])\*(?![\s*])[^*\n]+(?<!\s)\*(?![\w*]))/g;

export function LessonTextProvider({
  problem,
  children,
}: {
  problem: ProblemDefinition;
  children: ReactNode;
}) {
  const pattern = useMemo(() => {
    const { visualization } = problem.lesson;
    const names = [
      ...Object.keys(problem.tests[0]?.input ?? {}),
      ...visualization.focus,
      ...visualization.pointers,
      ...visualization.watch,
    ];
    // Only infer unmistakable identifiers. Ordinary words such as "left",
    // "value", and "a" need explicit backticks to preserve natural prose.
    const variables = [...new Set(names)].filter(
      (name) =>
        /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) &&
        (/^[b-z]$/.test(name) ||
          /_|[a-z][A-Z]/.test(name) ||
          /^(nums|arr|dp)$/.test(name)),
    );
    const identifiers = variables.length
      ? `|(?<![\\w'’])(?:${variables.join("|")})(?![\\w'’])(?:\\[[^\\]\\n]+\\])*`
      : "";
    return new RegExp(
      `(O\\((?:[^()\\n]|\\([^()\\n]*\\))*\\)${identifiers})`,
      "g",
    );
  }, [problem]);
  return (
    <VariablePattern.Provider value={pattern}>
      {children}
    </VariablePattern.Provider>
  );
}

/** Small, text-only markup renderer: source text is never interpreted as HTML. */
export default function LessonText({ children }: { children: string }) {
  const pattern = useContext(VariablePattern);
  function plain(text: string) {
    return pattern
      ? text.split(pattern).map((part, index) =>
          index % 2 ? (
            <code className="lesson-inline-code" key={index}>
              {part}
            </code>
          ) : (
            part
          ),
        )
      : text;
  }
  function render(text: string): ReactNode {
    return text.split(markup).map((part, index) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code className="lesson-inline-code" key={index}>
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{render(part.slice(2, -2))}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={index}>{render(part.slice(1, -1))}</em>;
      }
      return plain(part);
    });
  }
  return <>{render(children)}</>;
}
