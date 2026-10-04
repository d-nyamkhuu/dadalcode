import type { ProblemDefinition } from "../types";
import "./example-value.css";

type Format =
  | "value"
  | "list"
  | "lists"
  | "grid"
  | "sudoku"
  | "boards"
  | "tree"
  | "intervals"
  | "interval"
  | "schedule"
  | "points"
  | "coordinates"
  | "edges"
  | "prerequisites"
  | "adjacency";

const treeResults = new Set([
  "construct-binary-tree-from-preorder-and-inorder-traversal",
  "invert-binary-tree",
  "maximum-binary-tree",
  "merge-two-binary-trees",
  "serialize-and-deserialize-binary-tree",
]);
const gridResults = new Set([
  "convert-1d-array-into-2d-array",
  "rotate-image",
  "set-matrix-zeroes",
]);
const intervalResults = new Set([
  "insert-interval",
  "interval-list-intersections",
  "merge-intervals",
  "employee-free-time",
]);

/** Use the problem contract, not array shape, to distinguish a grid from pairs. */
function formatFor(problem: ProblemDefinition, field?: string): Format {
  const { slug } = problem;
  const kind = problem.lesson.visualization.kind;
  if (field !== undefined) {
    if (slug === "sudoku-solver" && field === "board") return "sudoku";
    if (
      kind === "grid" &&
      ["board", "matrix", "grid", "heights"].includes(field)
    )
      return "grid";
    if (
      kind === "tree" &&
      ["root", "root1", "root2", "subRoot", "p", "q"].includes(field)
    )
      return "tree";
    if (kind === "linked-list" && /^(head|list[12]|l[12])$/.test(field))
      return "list";
    if (slug === "merge-k-sorted-lists" && field === "lists") return "lists";
    if (field === "adjacency") return "adjacency";
    if (field === "edges") return "edges";
    if (field === "prerequisites") return "prerequisites";
    if (field === "schedule") return "schedule";
    if (field === "newInterval") return "interval";
    if (["intervals", "firstList", "secondList"].includes(field))
      return "intervals";
    if (field === "points")
      return kind === "intervals" ? "intervals" : "points";
    return "value";
  }
  if (slug === "sudoku-solver") return "sudoku";
  if (slug === "n-queens" || slug === "word-squares") return "boards";
  if (treeResults.has(slug)) return "tree";
  if (gridResults.has(slug)) return "grid";
  if (intervalResults.has(slug)) return "intervals";
  if (slug === "smallest-range-covering-elements-from-k-lists")
    return "interval";
  if (slug === "k-closest-points-to-origin") return "points";
  if (slug === "pacific-atlantic-water-flow") return "coordinates";
  if (slug === "clone-graph") return "adjacency";
  if (kind === "linked-list" || slug === "merge-k-sorted-lists") return "list";
  return "value";
}

function literal(value: unknown): string {
  if (value === null) return "None";
  if (typeof value === "boolean") return value ? "True" : "False";
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(literal).join(", ")}]`;
  return String(value);
}

function ValueTable({
  headings,
  rows,
  label,
}: {
  headings: string[];
  rows: unknown[][];
  label: string;
}) {
  return (
    <div
      className="example-table-scroll"
      tabIndex={0}
      role="region"
      aria-label={label}
    >
      <table className="example-table">
        <caption>{label}</caption>
        <thead>
          <tr>
            {headings.map((h) => (
              <th scope="col" key={h}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>
                  <ExampleValue value={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Board({ value, sudoku }: { value: unknown[]; sudoku: boolean }) {
  const rows = value.map((row) =>
    typeof row === "string" ? Array.from(row) : row,
  );
  if (!rows.every((row): row is unknown[] => Array.isArray(row)))
    return <ExampleValue value={value} />;
  const width = rows[0]?.length ?? 0;
  // Ragged collections are lists of rows, not rectangular boards.
  if (!width || !rows.every((row) => row.length === width))
    return <ExampleValue value={value} />;
  return (
    <div
      className="example-table-scroll"
      tabIndex={0}
      role="region"
      aria-label={sudoku ? "Sudoku board" : "Matrix"}
    >
      <table className={`example-grid${sudoku ? " example-sudoku" : ""}`}>
        <caption>
          {sudoku ? "Sudoku · " : ""}
          {rows.length} × {width}
          {sudoku ? " · . = empty" : " · row / column indices"}
        </caption>
        {!sudoku && (
          <thead>
            <tr>
              <th aria-label="Row / column" />
              {rows[0].map((_, col) => (
                <th scope="col" key={col}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {!sudoku && <th scope="row">{r}</th>}
              {row.map((cell, c) => (
                <td
                  key={c}
                  className={cell === "." ? "example-grid-empty" : undefined}
                >
                  <span
                    aria-label={`Row ${r}, column ${c}: ${cell === "." ? "empty (.)" : String(cell)}`}
                  >
                    {typeof cell === "string" ? cell : literal(cell)}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type Tree = { value: unknown; left?: Tree; right?: Tree };
function TreeBranch({ node, side }: { node?: Tree; side: string }) {
  return (
    <li>
      <span className="example-tree-side">{side}</span>{" "}
      <code className="example-scalar">{literal(node?.value ?? null)}</code>
      {node && (node.left || node.right) ? (
        <ul>
          <TreeBranch node={node.left} side="Left" />
          <TreeBranch node={node.right} side="Right" />
        </ul>
      ) : null}
    </li>
  );
}
function TreeValue({ values }: { values: unknown[] }) {
  if (values[0] === null) return <ExampleValue value={values} />;
  const root: Tree = { value: values[0] };
  const queue = [root];
  let index = 1;
  for (let i = 0; i < queue.length && index < values.length; i++) {
    for (const side of ["left", "right"] as const) {
      if (index >= values.length) break;
      const value = values[index++];
      if (value !== null) {
        const child = { value };
        queue[i][side] = child;
        queue.push(child);
      }
    }
  }
  return (
    <div className="example-tree" role="group" aria-label="Binary tree">
      <ul>
        <TreeBranch node={root} side="Root" />
      </ul>
    </div>
  );
}

function Operations({
  input,
  output,
}: {
  input: Record<string, unknown>;
  output?: unknown[];
}) {
  const operations = input.operations as unknown[];
  const args = input.args;
  const rows = operations.map((op, i) => {
    const [name, ...inlineArgs] = Array.isArray(op) ? op : [op];
    const row = [i, name, Array.isArray(args) ? args[i] : inlineArgs];
    if (output) row.push(output[i]);
    return row;
  });
  return (
    <ValueTable
      headings={[
        "Step",
        "Operation",
        "Arguments",
        ...(output ? ["Result"] : []),
      ]}
      rows={rows}
      label="Operations in order"
    />
  );
}

function GridType({
  problem,
  field,
}: {
  problem: ProblemDefinition;
  field: string;
}) {
  const format = formatFor(problem, field);
  if (format !== "grid" && format !== "sudoku") return null;
  const character = [
    "sudoku-solver",
    "number-of-islands",
    "word-search",
    "word-search-ii",
  ].includes(problem.slug);
  return (
    <p className="example-type-note">
      Python: <code>{character ? "list[list[str]]" : "list[list[int]]"}</code>.{" "}
      <code>{field}[row][col]</code> is{" "}
      {character ? "one character" : "an integer"}; indices start at 0.
      {format === "sudoku"
        ? ' The example’s row strings become mutable lists of characters. Digits are "1"–"9"; "." means empty.'
        : null}
      {problem.slug === "number-of-islands"
        ? ' "1" is land and "0" is water.'
        : null}
    </p>
  );
}

export function ExampleInput({
  problem,
  value,
}: {
  problem: ProblemDefinition;
  value: Record<string, unknown>;
}) {
  const operations = Array.isArray(value.operations);
  return (
    <dl className="example-fields">
      {Object.entries(value)
        .filter(([name]) => !(operations && name === "args"))
        .map(([name, item]) => (
          <div className="example-field" key={name}>
            <dt>
              <code>{name}</code>
            </dt>
            <dd>
              <GridType problem={problem} field={name} />
              {name === "operations" && operations ? (
                <Operations input={value} />
              ) : (
                <ExampleValue value={item} format={formatFor(problem, name)} />
              )}
              {name === "head" &&
              typeof value.pos === "number" &&
              value.pos >= 0 ? (
                <span className="example-note">
                  Tail connects to node at index {value.pos}.
                </span>
              ) : null}
            </dd>
          </div>
        ))}
    </dl>
  );
}
export function ExampleOutput({
  problem,
  value,
  input,
}: {
  problem: ProblemDefinition;
  value: unknown;
  input: Record<string, unknown>;
}) {
  if (Array.isArray(input.operations) && Array.isArray(value))
    return <Operations input={input} output={value} />;
  return (
    <>
      {["sudoku-solver", "rotate-image", "set-matrix-zeroes"].includes(
        problem.slug,
      ) ? (
        <p className="example-type-note">
          Updated {problem.slug === "sudoku-solver" ? "board" : "matrix"}; the
          method modifies it in place and returns <code>None</code>.
        </p>
      ) : null}
      <ExampleValue value={value} format={formatFor(problem)} />
    </>
  );
}

/** Compact fallback retains grouping, order, empty values and Python literals. */
export default function ExampleValue({
  value,
  format = "value",
}: {
  value: unknown;
  format?: Format;
}) {
  if (Array.isArray(value) && value.length > 0) {
    if (format === "grid" || format === "sudoku")
      return <Board value={value} sudoku={format === "sudoku"} />;
    if (format === "tree") return <TreeValue values={value} />;
    if (format === "list")
      return (
        <div
          className="example-linked"
          role="list"
          aria-label="Linked list in order"
        >
          {value.map((item, i) => (
            <span className="example-list-node" role="listitem" key={i}>
              {i > 0 && (
                <span className="example-link" aria-hidden="true">
                  →
                </span>
              )}
              <code className="example-scalar">{literal(item)}</code>
            </span>
          ))}
        </div>
      );
    if (format === "interval")
      return (
        <ValueTable
          headings={["Start", "End"]}
          rows={[value]}
          label="Interval"
        />
      );
    if (format === "adjacency")
      return (
        <ValueTable
          headings={["Node", "Neighbors"]}
          rows={value.map((v, i) => [i + 1, v])}
          label="Graph adjacency list"
        />
      );
    const headings = {
      intervals: ["Start", "End"],
      points: ["X", "Y"],
      coordinates: ["Row", "Column"],
      edges: ["Endpoint 1", "Endpoint 2"],
      prerequisites: ["Course", "Prerequisite"],
    };
    if (format in headings && value.every(Array.isArray))
      return (
        <ValueTable
          headings={headings[format as keyof typeof headings]}
          rows={value}
          label={
            {
              intervals: "Intervals",
              points: "Points",
              coordinates: "Coordinates",
              edges: "Undirected edges",
              prerequisites: "Course dependencies",
            }[format as keyof typeof headings]
          }
        />
      );
    if (["boards", "schedule", "lists"].includes(format))
      return (
        <div className="example-groups">
          {value.map((item, i) => (
            <div className="example-group" key={i}>
              <span className="example-note">
                {format === "boards"
                  ? "Board"
                  : format === "schedule"
                    ? "Employee"
                    : "List"}{" "}
                {i + 1}
              </span>
              <ExampleValue
                value={item}
                format={
                  format === "boards"
                    ? "grid"
                    : format === "schedule"
                      ? "intervals"
                      : "list"
                }
              />
            </div>
          ))}
        </div>
      );
    if (
      value.some(
        (item) =>
          Array.isArray(item) || (item !== null && typeof item === "object"),
      )
    )
      return (
        <div
          className="example-groups"
          role="list"
          aria-label="Nested list in order"
        >
          {value.map((item, i) => (
            <div className="example-group" role="listitem" key={i}>
              <span className="example-index">[{i}]</span>
              <ExampleValue value={item} />
            </div>
          ))}
        </div>
      );
  }
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    if (Object.keys(value).length === 0)
      return <code className="example-scalar">{"{}"}</code>;
    return (
      <dl className="example-fields">
        {Object.entries(value).map(([name, item]) => (
          <div className="example-field" key={name}>
            <dt>{name}</dt>
            <dd>
              <ExampleValue value={item} />
            </dd>
          </div>
        ))}
      </dl>
    );
  }
  return <code className="example-scalar">{literal(value)}</code>;
}
