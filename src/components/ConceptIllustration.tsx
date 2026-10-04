import "./lesson-enhancements.css";
const concepts: Record<
  string,
  { file: string; alt: string; problem: string; solution: string }
> = {
  "trapping-rain-water": {
    file: "rainwater",
    alt: "Water collects in low spaces between taller stone columns.",
    problem:
      "Imagine rain collecting between columns. Each column has width one; count the water held above the lower columns.",
    solution:
      "Both sides must hold the water in. The lower boundary determines the waterline; the two-pointer algorithm resolves the side whose limit is already known.",
  },
  "house-robber": {
    file: "house-robber",
    alt: "Five houses in a row. The first, third, and fifth are illuminated, with an unselected house between each pair.",
    problem:
      "The lit houses show one valid selection: no two selected houses touch. The best selection depends on the money in each house.",
    solution:
      "At each house, compare skipping it with taking it plus the best total from two houses back. Alternating houses is valid, but is not always optimal.",
  },
  "number-of-islands": {
    file: "islands",
    alt: "A tiled ocean board containing two separate clusters of raised land.",
    problem:
      "Each group of land cells connected along shared sides forms an island. Water separates the groups; touching at a corner does not connect them.",
    solution:
      "Start a flood fill at unvisited land and mark its entire connected group. One such traversal accounts for exactly one island.",
  },
};
export default function ConceptIllustration({
  slug,
  mode,
}: {
  slug: string;
  mode: "problem" | "solution";
}) {
  const concept = concepts[slug];
  if (!concept) return null;
  return (
    <figure className="concept-illustration">
      <img
        src={`${import.meta.env.BASE_URL}illustrations/${concept.file}.png`}
        alt={concept.alt}
        width="1536"
        height="1024"
        loading="lazy"
      />
      <figcaption>
        <span>Visual intuition · conceptual illustration</span>
        <p>{concept[mode]}</p>
      </figcaption>
    </figure>
  );
}
