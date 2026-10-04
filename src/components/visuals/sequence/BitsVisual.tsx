import { type SequenceVisualProps } from "./shared";
export function BitsVisual({
  value,
  previousValue,
  variable,
  label,
}: SequenceVisualProps & { value: number }) {
  const unsigned = value >>> 0,
    bits = unsigned.toString(2).padStart(32, "0");
  const oldBits =
    typeof previousValue === "number"
      ? (previousValue >>> 0).toString(2).padStart(32, "0")
      : undefined;
  return (
    <div
      className="seq-visual seq-bits-visual"
      role="group"
      aria-label={label ?? `${variable || "Value"} as 32 bits`}
    >
      <div className="seq-bit-groups">
        {Array.from({ length: 4 }, (_, group) => (
          <div className="seq-byte" key={group}>
            <div className="seq-byte-indices">
              <span>{31 - group * 8}</span>
              <span>{24 - group * 8}</span>
            </div>
            <div className="seq-byte-bits">
              {Array.from({ length: 8 }, (_, offset) => {
                const i = group * 8 + offset,
                  changed = oldBits !== undefined && bits[i] !== oldBits[i];
                return (
                  <span
                    key={i}
                    className={`seq-bit ${bits[i] === "1" ? "seq-bit-one" : ""} ${changed ? "seq-changed" : ""}`}
                    title={`Bit ${31 - i}: ${bits[i]}`}
                  >
                    {bits[i]}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="seq-caption">
        <span>32-bit view · most significant bit first</span>
        <code>
          {value} · 0x{unsigned.toString(16).padStart(8, "0")}
        </code>
      </div>
      {value !== unsigned ? (
        <div className="seq-heap-note">
          Showing the low 32 bits of the traced integer.
        </div>
      ) : null}
    </div>
  );
}
