import { useMemo, useState } from "react";
import {
  Search,
  CheckCircle2,
  Circle,
  Clock3,
  ArrowUpRight,
} from "lucide-react";
import { catalog } from "../data/problems";
import type { Progress } from "../types";
export default function Library({
  progress,
}: {
  progress: Record<string, Progress>;
}) {
  const [search, setSearch] = useState(""),
    [pattern, setPattern] = useState(""),
    [difficulty, setDifficulty] = useState(""),
    [status, setStatus] = useState("");
  const patterns = useMemo(
    () => [...new Set(catalog.flatMap((p) => p.pattern))].sort(),
    [],
  );
  const solved = Object.values(progress).filter(
    (p) => p.status === "solved",
  ).length;
  const filtered = catalog.filter(
    (p) =>
      `${p.title} ${p.id}`.toLowerCase().includes(search.toLowerCase()) &&
      (!pattern || p.pattern.includes(pattern)) &&
      (!difficulty || p.difficulty === difficulty) &&
      (!status ||
        (status === "new"
          ? !progress[p.slug]
          : progress[p.slug]?.status === status)),
  );
  return (
    <main className="library">
      <div className="library-heading">
        <div>
          <h1>Your next breakthrough.</h1>
          <p>179 problems. One pattern at a time.</p>
        </div>
        <div className="library-progress">
          <div>
            <span>{solved} / 179 solved</span>
            <span>{Math.round((solved / 179) * 100)}%</span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${(solved / 179) * 100}%` }} />
          </div>
        </div>
      </div>
      <div className="filters">
        <div className="search-box">
          <Search size={19} />
          <input
            aria-label="Search problems"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          aria-label="Filter by pattern"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
        >
          <option value="">All patterns</option>
          {patterns.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select
          aria-label="Filter by difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">All difficulties</option>
          {["Easy", "Medium", "Hard"].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          aria-label="Filter by progress"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All progress</option>
          <option value="new">Not started</option>
          <option value="started">In progress</option>
          <option value="solved">Solved</option>
        </select>
      </div>
      <table className="problem-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>#</th>
            <th>Problem</th>
            <th>Pattern</th>
            <th>Difficulty</th>
            <th>
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.slug}>
              <td>
                <span
                  aria-label={progress[p.slug]?.status ?? "Not started"}
                  className={
                    progress[p.slug]?.status === "solved" ? "solved" : "muted"
                  }
                >
                  {progress[p.slug]?.status === "solved" ? (
                    <CheckCircle2 size={18} />
                  ) : progress[p.slug] ? (
                    <Clock3 size={18} />
                  ) : (
                    <Circle size={18} />
                  )}
                </span>
              </td>
              <td>{p.id}</td>
              <td>
                <a href={`#/problems/${p.slug}/learn`}>{p.title}</a>
              </td>
              <td>{p.pattern[0]}</td>
              <td>
                <span className={`difficulty ${p.difficulty.toLowerCase()}`}>
                  {p.difficulty}
                </span>
              </td>
              <td>
                <ArrowUpRight size={15} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!filtered.length && (
        <div className="no-results">
          <h2>No problems match these filters.</h2>
          <button
            onClick={() => {
              setSearch("");
              setPattern("");
              setDifficulty("");
              setStatus("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      <footer className="library-footer">
        <span>Showing {filtered.length} problems</span>
        <span>
          Problem collection by{" "}
          <a
            href="https://seanprashad.com/leetcode-patterns/"
            target="_blank"
            rel="noreferrer"
          >
            Sean Prashad
          </a>
        </span>
      </footer>
    </main>
  );
}
