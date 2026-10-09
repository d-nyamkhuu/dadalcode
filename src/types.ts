export type CatalogEntry = {
  id: number;
  sourceId: number;
  slug: string;
  title: string;
  pattern: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  premium: boolean;
};
export type TestCase = {
  name: string;
  input: Record<string, unknown>;
  expected: unknown;
  evaluateOnly?: boolean;
};
export type FigureKind =
  | "array"
  | "string"
  | "matrix"
  | "dp"
  | "map"
  | "set"
  | "stack"
  | "queue"
  | "heap"
  | "intervals"
  | "bits"
  | "tree"
  | "linked-list"
  | "graph"
  | "trie";
export type Visualization = {
  kind: string;
  focus: string[];
  pointers: string[];
  watch: string[];
  labels: Record<string, string>;
  pointerTargets?: Record<string, string[]>;
  /** Per-variable presentation; captured data and pointer semantics stay intact. */
  renderers?: Record<string, FigureKind>;
};
export type Lesson = {
  slug: string;
  headline: string;
  statement: string;
  prerequisites: string[];
  constraints: string[];
  intuition: string;
  approach: string[];
  correctness: string;
  bruteForce: string;
  complexity: { time: string; space: string; explanation: string };
  pitfalls: string[];
  sources: { label: string; url: string }[];
  visualization: Visualization;
};
export type ProblemDefinition = CatalogEntry & {
  lesson: Lesson;
  solution: string;
  starter: string;
  adapter: string;
  tests: TestCase[];
  explanation?: Explanation;
};
export type Explanation = {
  concept: ConceptLesson;
  intuition: string[];
  keyDecision?: string;
  figures?: LessonFigure[];
  walkthrough: {
    input: Record<string, unknown>;
    steps: string[];
    result: unknown;
  };
  codeNotes: { code: string; note: string }[];
};
export type ConceptLesson = {
  question: string;
  intuition: string[];
  observation: string;
  approach: string[];
  correctness: string;
  complexity: { time: string; space: string; explanation: string };
  pitfalls: string[];
  illustrations: {
    src: string;
    alt: string;
    caption: string;
    prompt: string;
  }[];
  scenes: ConceptScene[];
};
export type ConceptScene = {
  id: string;
  title: string;
  narration: string;
  decision: string;
};
export type ConceptShape =
  | {
      type: "box" | "circle";
      x: number;
      y: number;
      width?: number;
      height?: number;
      label: string;
      detail?: string;
      tone?: "active" | "context" | "muted" | "warning";
    }
  | {
      type: "text";
      x: number;
      y: number;
      label: string;
      size?: number;
      tone?: "active" | "context" | "muted" | "warning";
      anchor?: "start" | "middle" | "end";
    }
  | {
      type: "path";
      d: string;
      arrow?: boolean;
      dashed?: boolean;
      tone?: "active" | "context" | "muted" | "warning";
    };
export type ConceptDrawing = { description: string; shapes: ConceptShape[] };
export type ConceptDrawings = Record<string, ConceptDrawing>;
export type LessonFigure = {
  title: string;
  caption: string;
  /** Place the figure immediately after this zero-based worked-example step. */
  afterStep: number;
  panels: {
    title: string;
    rows: {
      label: string;
      values: string[];
      labels?: string[];
      highlight?: number[];
      connector?: string;
      columns?: number;
    }[];
    note: string;
  }[];
};
export type TraceStep = {
  line: number;
  event: string;
  function: string;
  depth: number;
  explanation: string;
  variables: Record<string, unknown>;
  limits?: Record<string, string>;
};
export type CaseResult = {
  name: string;
  input: Record<string, unknown>;
  expected: unknown;
  actual: unknown;
  passed: boolean;
  error?: string;
  stdout: string;
  duration: number;
};
export type RunResult = {
  cases: CaseResult[];
  steps: TraceStep[];
  truncated: boolean;
};
export type WorkerRequest = {
  id: string;
  type: "execute";
  code: string;
  adapter: string;
  cases: TestCase[];
  trace: boolean;
  visualization: Visualization;
};
export type WorkerResponse = {
  id: string;
  type: "ready" | "case-start" | "case-result" | "complete" | "error";
  index?: number;
  result?: CaseResult;
  steps?: TraceStep[];
  truncated?: boolean;
  error?: string;
};
export type Progress = {
  revision?: string;
  slug: string;
  draft: string;
  status: "started" | "solved";
  lastResult?: { passed: number; total: number; at: number };
  updatedAt: number;
};
