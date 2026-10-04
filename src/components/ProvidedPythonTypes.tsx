import pythonTypes from "../data/pythonTypes.json";
import Text from "./LessonText";

type PythonType = keyof typeof pythonTypes.types;
const contracts = pythonTypes.problems as Record<
  string,
  { type: PythonType; input: string } | undefined
>;

export default function ProvidedPythonTypes({ slug }: { slug: string }) {
  const contract = contracts[slug];
  if (!contract) return null;
  const definition = pythonTypes.types[contract.type];

  return (
    <section
      className="provided-python-types"
      aria-label="Provided Python types"
    >
      <h3>Provided Python types</h3>
      <p>
        The trainer supplies <code>{contract.type}</code> automatically. You can
        use it in your code without defining or importing it. If you run your
        solution outside the trainer, include this definition:
      </p>
      <div className="code-note">
        <pre>
          <code>{definition.code}</code>
        </pre>
      </div>
      <p>
        <Text>{definition.description}</Text>
      </p>
      <p>
        <Text>{contract.input}</Text>
      </p>
    </section>
  );
}
