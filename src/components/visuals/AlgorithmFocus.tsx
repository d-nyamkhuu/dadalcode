import "./focus.css";
type Props = {
  slug: string;
  variables: Record<string, unknown>;
  input: Record<string, unknown>;
};
const number = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);
export default function AlgorithmFocus({ slug, variables: v, input }: Props) {
  if (
    slug === "number-of-islands" &&
    Array.isArray(input.grid) &&
    Array.isArray(v.grid)
  ) {
    const original = input.grid as unknown[][],
      grid = v.grid as unknown[][];
    if (!grid.every(Array.isArray) || !original.every(Array.isArray))
      return null;
    const pairs = [
      ["S", "row", "col"],
      ["C", "r", "c"],
      ["N", "nr", "nc"],
    ];
    return (
      <section className="algorithm-focus">
        <div className="focus-heading">
          Flood fill one connected island
          <span>{String(v.islands ?? 0)} discovered</span>
        </div>
        <div className="islands-grid-scroll">
          <table
            className="islands-board"
            aria-label="Island grid: water, unvisited land, and marked land"
          >
            <thead>
              <tr>
                <th>r / c</th>
                {(grid[0] ?? []).slice(0, 20).map((_, c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.slice(0, 16).map((row, r) => (
                <tr key={r}>
                  <th>{r}</th>
                  {row.slice(0, 20).map((cell, c) => {
                    const land = original[r]?.[c] === "1",
                      visited = land && cell === "0",
                      markers = pairs
                        .filter(
                          ([, rowKey, colKey]) =>
                            v[rowKey] === r && v[colKey] === c,
                        )
                        .map(([tag]) => tag);
                    return (
                      <td
                        key={c}
                        className={`${land ? (visited ? "island-visited" : "island-land") : "island-water"} ${markers.length ? "island-pointer" : ""}`}
                        title={`[${r}, ${c}]: ${visited ? "marked land" : land ? "unvisited land" : "water"}${markers.length ? "; " + markers.join(", ") : ""}`}
                      >
                        <span>{String(cell)}</span>
                        {markers.length > 0 && (
                          <small>{markers.join("·")}</small>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="islands-legend">
          <span className="island-water">Water</span>
          <span className="island-land">Land</span>
          <span className="island-visited">Marked land</span>
        </div>
        <p>
          S = outer scan · C = cell removed from the queue · N = neighbor being
          checked. Marked land contains 0 in Python; its original position stays
          visible here.
        </p>
        {(grid.length > 16 || grid.some((row) => row.length > 20)) && (
          <p>Showing at most 16 rows and 20 columns of the captured grid.</p>
        )}
      </section>
    );
  }
  if (slug === "word-squares") {
    const words = input.words as string[] | undefined;
    const size = words?.[0]?.length ?? 0;
    if (!size || size > 8) return null;
    const square = Array.isArray(v.square) ? (v.square as string[]) : [];
    const depth = square.length,
      prefix = square.map((word) => word[depth] ?? "").join("");
    return (
      <section className="algorithm-focus">
        <div className="focus-heading">
          Rows constrain the next column<span>Word square</span>
        </div>
        <div
          className="word-square-board"
          style={{ gridTemplateColumns: `repeat(${size}, 36px)` }}
          role="img"
          aria-label={`Partial word square with ${depth} rows; next prefix ${prefix || "empty"}`}
        >
          {Array.from({ length: size * size }, (_, i) => {
            const row = Math.floor(i / size),
              col = i % size;
            return (
              <span
                key={i}
                className={
                  row < depth && col === depth
                    ? "crossing-letter"
                    : row === depth && col < depth
                      ? "required-letter"
                      : ""
                }
              >
                {square[row]?.[col] ??
                  (row === depth ? prefix[col] : "") ??
                  "·"}
              </span>
            );
          })}
        </div>
        <p>
          {depth === size ? (
            "Every row now matches its corresponding column."
          ) : (
            <>
              The next row must start with{" "}
              <strong>{prefix || "any prefix"}</strong>. Read the highlighted
              column from the rows already chosen.
            </>
          )}
        </p>
      </section>
    );
  }
  if (slug === "n-queens") {
    const size = Number(input.n),
      placement = Array.isArray(v.placement) ? (v.placement as number[]) : [];
    if (!Number.isInteger(size) || size < 1 || size > 12) return null;
    return (
      <section className="algorithm-focus">
        <div className="focus-heading">
          Place one queen per row
          <span>
            {placement.length} of {size} placed
          </span>
        </div>
        <div
          className="queens-board"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(26px, 38px))` }}
          role="img"
          aria-label={`Chessboard with ${placement.length} queens. Crosses mark attacked empty squares.`}
        >
          {Array.from({ length: size * size }, (_, i) => {
            const row = Math.floor(i / size),
              col = i % size,
              queen = placement[row] === col,
              attacked = placement.some(
                (p, r) =>
                  p === col ||
                  Math.abs(r - row) === Math.abs(p - col) ||
                  r === row,
              ),
              candidate =
                row === v.row && col === v.col && row === placement.length;
            return (
              <span
                key={i}
                title={`Row ${row}, column ${col}${queen ? ": queen" : attacked ? ": attacked" : ": open"}`}
                className={`${(row + col) % 2 ? "dark-square" : ""} ${queen ? "has-queen" : ""} ${candidate ? "candidate-square" : ""}`}
              >
                {queen ? "♛" : attacked ? "×" : ""}
              </span>
            );
          })}
        </div>
        <p>
          Queens attack along rows, columns, and diagonals. A bordered square is
          the current candidate; crosses are attacks from the placed queens.
        </p>
      </section>
    );
  }
  if (slug === "trapping-rain-water" || slug === "container-with-most-water") {
    const heights = (v.height ?? input.height) as number[];
    if (!Array.isArray(heights) || !heights.length || !heights.every(number))
      return null;
    const max = Math.max(1, ...heights);
    return (
      <section className="algorithm-focus">
        <div className="focus-heading">
          Elevation profile<span>Height at each index</span>
        </div>
        <div
          className="elevation-profile"
          role="img"
          aria-label={`Column heights ${heights.slice(0, 32).join(", ")}`}
        >
          {heights.slice(0, 32).map((height, index) => (
            <div
              key={index}
              className={
                index === v.left || index === v.right ? "active-column" : ""
              }
            >
              <small>{height}</small>
              <i style={{ height: `${Math.max(2, (height / max) * 90)}px` }} />
              <span>{index}</span>
            </div>
          ))}
        </div>
        <p>
          {slug === "trapping-rain-water"
            ? "A low column can hold water only when both sides provide a taller boundary."
            : "The shorter of the two selected boundaries limits the height; their distance supplies the width."}
        </p>
        {heights.length > 32 && <p>Showing 32 of {heights.length} columns.</p>}
      </section>
    );
  }
  if (slug === "two-sum" && number(v.target) && number(v.num ?? v.value)) {
    const current = (v.num ?? v.value) as number;
    return (
      <section className="algorithm-focus equation-focus">
        <div className="focus-heading">The number we still need</div>
        <div className="focus-equation">
          <b>{v.target}</b>
          <span>−</span>
          <b>{current}</b>
          <span>=</span>
          <strong>{v.target - current}</strong>
        </div>
        <p>Look for this complement among the numbers stored earlier.</p>
      </section>
    );
  }
  if (
    slug === "coin-change" &&
    number(v.value) &&
    number(v.coin) &&
    v.coin <= v.value &&
    Array.isArray(v.dp)
  ) {
    const prior = v.dp[v.value - v.coin];
    return (
      <section className="algorithm-focus">
        <div className="focus-heading">Try this as the final coin</div>
        <div className="recurrence-path">
          <code>
            dp[{v.value - v.coin}] = {String(prior)}
          </code>
          <span>+ 1 coin →</span>
          <code>dp[{v.value}]</code>
        </div>
        <p>
          Keep the smaller of the current answer and this candidate. A value of{" "}
          {Number(input.amount) + 1} represents an unreachable amount.
        </p>
      </section>
    );
  }
  return null;
}
