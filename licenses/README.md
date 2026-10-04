# Vendored runtime notices

`pyodide-0.29.5.txt` is the unmodified license from
https://raw.githubusercontent.com/pyodide/pyodide/0.29.5/LICENSE.
It contains the Pyodide MPL-2.0 license. The npm runtime
package does not include this file, so it is retained here and copied into the
website's generated notices during every build. Review and vendor the matching
license when upgrading Pyodide; a missing version fails the build.

Other production dependency notices are read from installed, lockfile-pinned
packages by `scripts/build-notices.mjs`. Development-only dependencies are not
redistributed with the site. No font files are bundled.

The matching bundled-runtime versions are recorded in Pyodide's lockfile:

- Python 3.13.2: `python-3.13.2.txt` from https://raw.githubusercontent.com/python/cpython/v3.13.2/LICENSE.
- Python's additional component notices: `python-3.13.2-third-party.txt` from https://raw.githubusercontent.com/python/cpython/v3.13.2/Doc/license.rst.
- Emscripten 4.0.9: `emscripten-4.0.9.txt` from https://raw.githubusercontent.com/emscripten-core/emscripten/4.0.9/LICENSE.

These are unmodified upstream texts. The build checks the bundled versions and
fails if matching notices are missing. Pyodide's corresponding source is available
at https://github.com/pyodide/pyodide/tree/0.29.5; Python and Emscripten source are
available at the versioned repositories linked above. No runtime source changes
are made by Loopcraft.
