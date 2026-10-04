# Sources and third-party notices

## Problem collection

The catalog is adapted from [Sean Prashad's LeetCode Patterns](https://seanprashad.com/leetcode-patterns/) and its [source repository](https://github.com/seanprashad/leetcode-patterns). Original catalog copyright © 2026 Sean Prashad, licensed [Creative Commons Attribution–NonCommercial 4.0](https://creativecommons.org/licenses/by-nc/4.0/). The retained snapshot reports an update timestamp of 2026-09-27. The collection contains 179 problems.

Changes include corrected canonical LeetCode numbers, omission of company-frequency data from the working catalog, original teaching material, Python solutions, fixtures, adapters, and visualizations. Original source IDs and the unmodified metadata snapshot are retained for provenance. This trainer is intended for personal noncommercial study. The repository's MIT license applies to original application code, not a relicensing of the source catalog or third-party material.

Study plan memberships, group titles, and ordering in `src/data/study-plans.json` are adapted from Sean Prashad’s [beginner](https://seanprashad.com/leetcode-patterns/?view=beginner) and [experienced](https://seanprashad.com/leetcode-patterns/?view=experienced) roadmaps, retrieved on 2026-10-04, under the same source license. The beginner track contains 68 problems and the experienced track contains the Blind 75. Group goals and interface guidance are paraphrased for this trainer, and beginner group numbers are sequential rather than retaining gaps and duplicates in the source labels.

Each lesson links its problem sources. Premium-listed problems have an accessible alternative statement, primarily [Doocs LeetCode Wiki](https://leetcode.doocs.org/) and [LeetCode.ca](https://leetcode.ca/). Educational prose, examples, implementation comments, and reference implementations were independently authored. Third-party pages remain the property of their respective authors; links do not imply affiliation or endorsement.

## Runtime and interface dependencies

React, CodeMirror, Lucide, and Pyodide retain their respective licenses. Pyodide includes Python and its standard library. Every build collects runtime dependency licenses into `third-party-licenses.txt`, linked from the published Credits and licenses page. Exact Pyodide, Python, and Emscripten license texts are vendored in `licenses/`. Unmodified Pyodide source for the bundled version is available at https://github.com/pyodide/pyodide/tree/0.29.5; the corresponding Python and compiler sources are linked in `licenses/README.md`. Vite, TypeScript, Playwright, and lint/format tools are development dependencies. The interface uses system fonts; no font files are distributed. Earlier revisions bundled Inter under the SIL Open Font License; that dependency has been removed.

## Design references

The four desktop mockups in `design/` were generated with the built-in ImageGen tool for this project. Exact prompts are retained in `design/prompts.json`. They guide the implemented interface and are not rendered as working application controls.

The three contextual lesson illustrations in `public/illustrations/` were also generated with the built-in ImageGen tool. Their exact prompts are retained in `design/illustrations/prompts.json`. They illustrate physical concepts; executable algorithm states are rendered separately from trace data.

The teaching sequence of [AlgoMonster's Word Squares explanation](https://algo.monster/liteproblems/425) was consulted as a structural reference at the user's request. The trainer's expanded intuition, worked examples, and source-code annotations were independently written against its own Python implementations. No third-party editorial text or images are reproduced.
