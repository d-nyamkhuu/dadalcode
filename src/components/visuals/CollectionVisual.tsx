import type { ReactNode } from "react";
import "./collection.css";

const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const identity = (v: unknown) => JSON.stringify(v);
const LIMIT = 24;

/** Maps compare keys; sets compare membership, independent of iteration order. */
export default function CollectionVisual({
  value,
  previousValue,
  variable,
  kind = "map",
  renderItem,
}: {
  value: unknown;
  previousValue?: unknown;
  variable: string;
  kind?: "map" | "set";
  renderItem: (value: unknown) => ReactNode;
}) {
  if (kind === "set" && Array.isArray(value)) {
    const old = Array.isArray(previousValue) ? previousValue : undefined;
    const prior = new Set(old?.map(identity));
    const current = new Set(value.map(identity));
    const removed = old?.filter((item) => !current.has(identity(item))) ?? [];
    return (
      <div
        className="collection-visual collection-set"
        role="group"
        aria-label={`${variable} set membership`}
      >
        <div className="collection-members">
          {value.slice(0, LIMIT).map((item, i) => (
            <span
              key={i}
              className={
                old && !prior.has(identity(item)) ? "collection-added" : ""
              }
              title={
                old && !prior.has(identity(item))
                  ? "Added since previous step"
                  : undefined
              }
            >
              {renderItem(item)}
            </span>
          ))}
          {!value.length && <span className="empty-value">Empty set</span>}
        </div>
        <div className="collection-caption">
          {value.length} captured members
          {value.length > LIMIT ? " · showing 24" : ""} · membership, unordered
        </div>
        {removed.length > 0 && (
          <div className="collection-removed">
            Removed:{" "}
            {removed.slice(0, 4).map((item, i) => (
              <span key={i}>{renderItem(item)}</span>
            ))}
            {removed.length > 4 ? ` +${removed.length - 4} more` : ""}
          </div>
        )}
      </div>
    );
  }
  if (!record(value))
    return <span className="empty-value">No captured {kind}</span>;
  const entries = Object.entries(value).filter(([key]) => key !== "__ref");
  const old = record(previousValue) ? previousValue : undefined;
  const removed = old
    ? Object.keys(old).filter(
        (key) => key !== "__ref" && !Object.hasOwn(value, key),
      )
    : [];
  return (
    <div className="collection-visual collection-map">
      <div className="map-wrap">
        <table
          className="map-table"
          aria-label={`${variable} key and value entries`}
        >
          <thead>
            <tr>
              <th scope="col">Key</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {entries.slice(0, LIMIT).map(([key, item]) => {
              const added = old !== undefined && !Object.hasOwn(old, key);
              const changed =
                old !== undefined && identity(old[key]) !== identity(item);
              return (
                <tr key={key} className={changed ? "changed-entry" : ""}>
                  <th scope="row">
                    {key || "∅"}
                    {added && <small className="collection-new">new</small>}
                  </th>
                  <td>
                    {changed && !added && (
                      <span
                        className="collection-before"
                        title="Previous value"
                      >
                        {renderItem(old[key])}
                        <span aria-label="changed to"> → </span>
                      </span>
                    )}
                    {renderItem(item)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!entries.length && <div className="empty-value">Empty map</div>}
      <div className="collection-caption">
        {entries.length} captured entries
        {entries.length > LIMIT ? " · showing 24" : ""}
        {removed.length
          ? ` · ${removed.length} removed since previous step`
          : ""}
      </div>
    </div>
  );
}
