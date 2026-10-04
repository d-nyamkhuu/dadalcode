import type { LessonFigure as Figure } from "../types";
import Text from "./LessonText";

/** Authored example states, independent of playback and editable trace inputs. */
export default function LessonFigure({ figure }: { figure: Figure }) {
  return (
    <figure className="lesson-figure">
      <figcaption>
        <span className="figure-kicker">See the step</span>
        <h4>
          <Text>{figure.title}</Text>
        </h4>
        <p>
          <Text>{figure.caption}</Text>
        </p>
      </figcaption>
      <ol className="figure-panels">
        {figure.panels.map((panel, index) => (
          <li className="figure-panel" key={index}>
            <h5>
              <span>{index + 1}</span>
              <Text>{panel.title}</Text>
            </h5>
            {panel.rows.map((row, rowIndex) => (
              <div className="figure-row" key={rowIndex}>
                <span className="figure-row-label">
                  <Text>{row.label}</Text>
                </span>
                <div
                  className={`figure-cells${row.columns ? " figure-grid" : ""}`}
                  style={
                    row.columns
                      ? {
                          gridTemplateColumns: `repeat(${row.columns}, minmax(0, 1fr))`,
                        }
                      : undefined
                  }
                >
                  {row.values.map((value, cellIndex) => (
                    <div className="figure-item" key={cellIndex}>
                      {row.connector && cellIndex > 0 ? (
                        <span className="figure-connector" aria-hidden="true">
                          {row.connector}
                        </span>
                      ) : null}
                      <span
                        className={`figure-cell${row.highlight?.includes(cellIndex) ? " figure-cell-active" : ""}`}
                      >
                        {row.labels?.[cellIndex] ? (
                          <small>{row.labels[cellIndex]}</small>
                        ) : null}
                        <code>{value}</code>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <p>
              <Text>{panel.note}</Text>
            </p>
          </li>
        ))}
      </ol>
    </figure>
  );
}
