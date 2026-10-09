import { useId } from "react";
import type { ConceptDrawing } from "../../types";

/** Only drawing geometry is shared: every scene supplies its own authored composition. */
export default function ConceptDiagram({
  drawing,
}: {
  drawing: ConceptDrawing;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className="concept-diagram"
      viewBox="0 0 720 400"
      role="img"
      aria-labelledby={`${id}-description`}
    >
      <title id={`${id}-description`}>{drawing.description}</title>
      <defs>
        <marker
          id={`${id}-arrow`}
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto-start-reverse"
          markerUnits="strokeWidth"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" fill="context-stroke" />
        </marker>
      </defs>
      {drawing.shapes.map((shape, i) => {
        const className = `concept-shape concept-${shape.tone ?? "context"}`;
        if (shape.type === "path")
          return (
            <path
              key={i}
              className={className}
              d={shape.d}
              fill="none"
              strokeWidth="2"
              strokeDasharray={shape.dashed ? "6 5" : undefined}
              markerEnd={shape.arrow ? `url(#${id}-arrow)` : undefined}
            />
          );
        if (shape.type === "text") {
          const anchor = shape.anchor ?? "middle";
          const available =
            anchor === "start"
              ? 700 - shape.x
              : anchor === "end"
                ? shape.x - 20
                : 2 * Math.min(shape.x - 20, 700 - shape.x);
          const size = shape.size ?? 18;
          const limit = Math.max(12, Math.floor(available / (size * 0.55)));
          const lines: string[] = [];
          for (const word of shape.label.split(" ")) {
            const last = lines.length - 1;
            if (last >= 0 && lines[last].length + word.length + 1 <= limit)
              lines[last] += ` ${word}`;
            else lines.push(word);
          }
          const firstY = Math.min(
            shape.y,
            390 - (lines.length - 1) * (size + 3),
          );
          return (
            <text
              key={i}
              className={className}
              textAnchor={anchor}
              fontSize={size}
            >
              {lines.map((line, index) => (
                <tspan x={shape.x} y={firstY + index * (size + 3)} key={index}>
                  {line}
                </tspan>
              ))}
            </text>
          );
        }
        const width = shape.width ?? 72,
          height = shape.height ?? 58;
        const fontSize = Math.min(
          20,
          Math.max(12, (width - 12) / Math.max(shape.label.length * 0.6, 1)),
        );
        const characters = Math.max(
          1,
          Math.floor((width - 12) / (fontSize * 0.6)),
        );
        const chunks: string[] = [];
        for (const word of shape.label.split(" ")) {
          const pieces = word.match(new RegExp(`.{1,${characters}}`, "g")) ?? [
            "",
          ];
          for (const piece of pieces) {
            const last = chunks.length - 1;
            if (
              last >= 0 &&
              chunks[last].length + piece.length + 1 <= characters
            )
              chunks[last] += ` ${piece}`;
            else chunks.push(piece);
          }
        }
        const lineHeight = Math.min(
          fontSize + 2,
          (height - 10) / Math.max(chunks.length, 1),
        );
        const startY = shape.y + 5 - ((chunks.length - 1) * lineHeight) / 2;
        return (
          <g key={i} className={className}>
            {shape.type === "circle" ? (
              <circle cx={shape.x} cy={shape.y} r={width / 2} />
            ) : (
              <rect
                x={shape.x - width / 2}
                y={shape.y - height / 2}
                width={width}
                height={height}
                rx="10"
              />
            )}
            <text textAnchor="middle" fontSize={fontSize}>
              {chunks.map((chunk, index) => (
                <tspan x={shape.x} y={startY + index * lineHeight} key={index}>
                  {chunk}
                </tspan>
              ))}
            </text>
            {shape.detail && (
              <text
                className="concept-detail"
                x={shape.x}
                y={shape.y + 19}
                textAnchor="middle"
                fontSize="11"
              >
                {shape.detail}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
