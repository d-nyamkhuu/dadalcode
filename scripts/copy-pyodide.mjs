import { mkdir, cp, readdir } from "node:fs/promises";
await mkdir("public/pyodide", { recursive: true });
for (const file of await readdir("node_modules/pyodide")) {
  if (
    /\.(wasm|zip|json|js|mjs)$/.test(file) &&
    !["package.json"].includes(file)
  )
    await cp(`node_modules/pyodide/${file}`, `public/pyodide/${file}`);
}
console.log("Local Python runtime ready.");
