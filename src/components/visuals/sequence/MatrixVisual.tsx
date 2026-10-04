import {
  type SequenceVisualProps,
  type Pointer,
  EMPTY_POINTERS,
  text,
  differs,
  PointerLegend,
} from "./shared";
export function MatrixVisual({
  value,
  previousValue,
  pointers = EMPTY_POINTERS,
  variable,
  label,
  renderer,
  kind,
}: SequenceVisualProps & { value: unknown[][] }) {
  const previous = Array.isArray(previousValue) ? previousValue : undefined;
  const rows = Math.min(value.length, 16),
    columns = Math.max(0, ...value.map((row) => row.length));
  const pairs = [
    ["row", "col"],
    ["r", "c"],
    ["nr", "nc"],
  ]
    .filter(
      ([r, c]) =>
        Number.isInteger(pointers[r]) && Number.isInteger(pointers[c]),
    )
    .map(([r, c]) => ({
      row: pointers[r],
      col: pointers[c],
      rowName: r,
      colName: c,
    }));
  const mapped: Pointer[] = pairs.flatMap(
    (pair) =>
      [
        [pair.rowName, pair.row],
        [pair.colName, pair.col],
      ] as Pointer[],
  );
  return (
    <div
      className={`seq-visual seq-matrix-visual ${renderer === "dp" || kind === "dp" ? "seq-dp-matrix" : ""}`}
    >
      <div className="seq-matrix-scroll">
        <table
          className="seq-matrix"
          aria-label={label ?? `${variable || "Matrix"} row and column values`}
        >
          <thead>
            <tr>
              <th scope="col" className="seq-matrix-corner">
                r / c
              </th>
              {Array.from({ length: Math.min(columns, 20) }, (_, col) => (
                <th
                  scope="col"
                  key={col}
                  className={
                    pairs.some((pair) => pair.col === col)
                      ? "seq-axis-current"
                      : ""
                  }
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {value.slice(0, rows).map((row, r) => (
              <tr key={r}>
                <th
                  scope="row"
                  className={
                    pairs.some((pair) => pair.row === r)
                      ? "seq-axis-current"
                      : ""
                  }
                >
                  {r}
                </th>
                {row.slice(0, 20).map((cell, c) => {
                  const active = pairs.some(
                    (pair) => pair.row === r && pair.col === c,
                  );
                  const oldRow = Array.isArray(previous?.[r])
                    ? previous[r]
                    : undefined;
                  const changed = differs(
                    cell,
                    oldRow?.[c],
                    previous !== undefined,
                  );
                  const crosshair = pairs.some(
                    (pair) => pair.row === r || pair.col === c,
                  );
                  return (
                    <td
                      key={c}
                      className={`${active ? "seq-current" : crosshair ? "seq-crosshair" : ""} ${changed ? "seq-changed" : ""} ${cell === true ? "seq-true" : ""}`}
                      title={`[${r}, ${c}] = ${text(cell)}${active ? "; current cell" : ""}${changed ? `; was ${text(oldRow?.[c])}` : ""}`}
                    >
                      <span>{text(cell)}</span>
                      {active ? <i className="seq-matrix-dot" /> : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="seq-caption">
        <span>
          {value.length} captured rows × {columns} columns
          {rows < value.length || columns > 20
            ? ` · showing ${rows} × ${Math.min(columns, 20)}`
            : ""}
        </span>
        {pairs.map((pair) => (
          <span key={pair.rowName}>
            {pair.rowName}, {pair.colName} = ({pair.row}, {pair.col})
          </span>
        ))}
      </div>
      <PointerLegend
        pointers={mapped}
        mapped={mapped}
        length={Math.max(rows, columns)}
      />
    </div>
  );
}
