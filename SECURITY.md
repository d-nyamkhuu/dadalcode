# Security policy

Report vulnerabilities privately using the repository's **Security → Report a
vulnerability** feature. If that option is unavailable, contact the repository
owner privately before posting details; do not put secrets or exploit payloads
in a public issue. Maintainers should enable private vulnerability reporting
before the public release. There is no guaranteed response or remediation SLA.

Include the affected commit/version, browser, reproduction steps, impact, and a
minimal example. Use synthetic data. Never include real credentials or someone
else's browser storage.

DadalCode executes Python locally in a terminable browser Web Worker. This is a
personal practice tool, not an isolation boundary for hostile code: Python's
JavaScript bridge can access worker APIs and the site's origin. Only run code you
trust. No server evaluates submissions; no account, telemetry, or cloud storage
is used. Drafts and progress remain in IndexedDB and can be exported by the user.

Do not introduce automatic execution of externally shared submissions without a
separate origin and a reviewed isolation design. Host the trainer on an origin
that does not carry sensitive application data.

The supported security target is the latest release. Dependency and workflow
updates are proposed by Dependabot; maintainers review the changes and license
notices before merging.
