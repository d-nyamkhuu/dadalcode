import { execFileSync } from "node:child_process";
const repository = process.argv[2];
if (!repository || !/^[\w-]+\/[\w.-]+$/.test(repository))
  throw new Error(
    "Usage: npm run protect:main -- owner/repository (requires repository admin access). Run after making the repository public or enabling a plan that supports branch protection.",
  );
const required = {
  strict: true,
  contexts: ["Quality", "Browser tests", "Production build"],
};
const endpoint = `repos/${repository}/branches/main/protection`;
function request(method, path, body) {
  return execFileSync(
    "gh",
    ["api", "--method", method, path, ...(body ? ["--input", "-"] : [])],
    { encoding: "utf8", input: body ? JSON.stringify(body) : undefined },
  );
}
try {
  request("GET", endpoint);
  request("PATCH", `${endpoint}/required_status_checks`, required);
} catch (error) {
  if (!String(error.stderr).includes("404")) throw error;
  request("PUT", endpoint, {
    required_status_checks: required,
    enforce_admins: true,
    required_pull_request_reviews: null,
    restrictions: null,
    allow_force_pushes: false,
    allow_deletions: false,
  });
}
console.log(`Required release checks enabled for ${repository}:main.`);
