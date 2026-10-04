import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
const lock = JSON.parse(await readFile("package-lock.json", "utf8"));
const sections = [
  await readFile("LICENSE", "utf8"),
  await readFile("THIRD_PARTY_NOTICES.md", "utf8"),
];
for (const [directory, entry] of Object.entries(lock.packages)) {
  if (!directory || entry.dev || entry.devOptional) continue;
  const pkg = JSON.parse(
    await readFile(join(directory, "package.json"), "utf8"),
  );
  let license;
  if (pkg.name === "pyodide") {
    license = await readFile(`licenses/pyodide-${pkg.version}.txt`, "utf8");
  } else {
    const names = (await readdir(directory)).filter((name) =>
      /^(licen[cs]e|copying|copyright|notice)(\.|$)/i.test(name),
    );
    if (!names.length)
      throw new Error(
        `Missing distribution license for ${pkg.name}@${pkg.version}. Add its upstream notice before building.`,
      );
    license = (
      await Promise.all(
        names.map((name) => readFile(join(directory, name), "utf8")),
      )
    ).join("\n\n");
  }
  sections.push(
    `\n${"=".repeat(72)}\n${pkg.name}@${pkg.version}\n${pkg.repository?.url ?? pkg.repository ?? ""}\n\n${license}`,
  );
}
const packageCount = sections.length - 2;
sections.push(await readFile("licenses/README.md", "utf8"));
const runtime = JSON.parse(
  await readFile("node_modules/pyodide/pyodide-lock.json", "utf8"),
).info;
const python = runtime.python;
const emscripten = runtime.platform
  .replace("emscripten_", "")
  .replaceAll("_", ".");
for (const file of [
  `python-${python}.txt`,
  `python-${python}-third-party.txt`,
  `emscripten-${emscripten}.txt`,
]) {
  sections.push(
    `\n${"=".repeat(72)}\n${file}\n\n${await readFile(`licenses/${file}`, "utf8")}`,
  );
}
await writeFile("public/third-party-licenses.txt", sections.join("\n\n"));
console.log(
  `Prepared distribution notices for ${packageCount} runtime packages plus bundled Python and Emscripten.`,
);
