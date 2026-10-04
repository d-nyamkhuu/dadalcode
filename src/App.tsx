import { useState, useEffect, lazy, Suspense, useRef } from "react";
import {
  ArrowLeft,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Copy,
  Check,
  Play,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";
import { catalog, loadProblem } from "./data/problems";
import {
  allProgress,
  saveProgress,
  setLastProblem,
  getLastProblem,
} from "./data/storage";
import type { ProblemDefinition, Progress } from "./types";
import Library from "./components/Library";
import LessonContent from "./components/LessonContent";
import Walkthrough from "./components/Walkthrough";
import Practice from "./components/Practice";
const CodeEditor = lazy(() => import("./components/CodeEditor"));
type Tab = "learn" | "practice" | "solution";
function route() {
  const parts = location.hash.replace(/^#\/?/, "").split("/");
  return {
    slug: parts[0] === "problems" ? (parts[1] ?? "") : "",
    tab: (["learn", "practice", "solution"].includes(parts[2])
      ? parts[2]
      : "learn") as Tab,
  };
}
function Sidebar({
  slug,
  progress,
  collapsed,
  onToggle,
}: {
  slug: string;
  progress: Record<string, Progress>;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const [search, setSearch] = useState("");
  const solved = Object.values(progress).filter(
    (p) => p.status === "solved",
  ).length;
  const preferred = [
    "two-sum",
    "contains-duplicate",
    "valid-anagram",
    "group-anagrams",
    "top-k-frequent-elements",
    "product-of-array-except-self",
  ];
  const sorted = [
    ...preferred.map((s) => catalog.find((p) => p.slug === s)!),
    ...catalog.filter((p) => !preferred.includes(p.slug)),
  ];
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        {!collapsed && (
          <a href="#/problems">
            <ArrowLeft size={17} />
            Back to problems
          </a>
        )}
        <button
          className="icon-button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={onToggle}
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>
      {!collapsed && (
        <>
          <div className="search-box sidebar-search">
            <Search size={17} />
            <input
              aria-label="Search sidebar problems"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <nav className="sidebar-list" aria-label="Problem navigation">
            <div className="sidebar-label">
              {search ? "SEARCH RESULTS" : "ARRAYS & HASHING"}
            </div>
            {sorted
              .filter((p) =>
                p.title.toLowerCase().includes(search.toLowerCase()),
              )
              .map((p, i) => (
                <div key={p.slug}>
                  {!search && i === 6 && (
                    <div className="sidebar-label additional">ALL PROBLEMS</div>
                  )}
                  <a
                    className={`sidebar-problem ${p.slug === slug ? "active" : ""}`}
                    href={`#/problems/${p.slug}/learn`}
                    aria-current={p.slug === slug ? "page" : undefined}
                  >
                    <span>{p.title}</span>
                    {progress[p.slug]?.status === "solved" && (
                      <CheckCircle2 size={14} />
                    )}
                  </a>
                </div>
              ))}
          </nav>
          <div className="sidebar-progress">
            <div>
              <span>{solved} of 179 solved</span>
              <span>{Math.round((solved / 179) * 100)}%</span>
            </div>
            <div className="progress-track">
              <span style={{ width: `${(solved / 179) * 100}%` }} />
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
function Solution({
  problem,
  onPractice,
}: {
  problem: ProblemDefinition;
  onPractice: () => void;
}) {
  const [copied, setCopied] = useState(false),
    [copyError, setCopyError] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(problem.solution);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyError(
        "Copy unavailable. Select the code and copy it with your keyboard.",
      );
    }
  }
  return (
    <div className="solution-workbench">
      <div className="panel solution-panel">
        <div className="panel-heading">
          <h2>Reference solution</h2>
          <button onClick={copy}>
            {copied ? <Check size={15} /> : <Copy size={15} />}{" "}
            {copied ? "Copied" : "Copy code"}
          </button>
        </div>
        {copyError && <p className="notice">{copyError}</p>}
        <Suspense fallback={<div className="loading">Loading solution…</div>}>
          <CodeEditor
            value={problem.solution}
            readOnly
            label="Python reference solution"
          />
        </Suspense>
      </div>
      <button className="primary try-button" onClick={onPractice}>
        <Play size={17} />
        Try it yourself
      </button>
      <p className="try-caption">
        Open the practice view to run and test your solution.
      </p>
    </div>
  );
}
function Workspace({
  slug,
  tab,
  progress,
  onProgress,
}: {
  slug: string;
  tab: Tab;
  progress: Record<string, Progress>;
  onProgress: (p: Progress) => void;
}) {
  const [problem, setProblem] = useState<ProblemDefinition | null>(null),
    [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0),
    [collapsed, setCollapsed] = useState(false),
    [ratio, setRatio] = useState(41),
    [draft, setDraft] = useState("");
  const split = useRef<HTMLDivElement>(null),
    dragging = useRef(false),
    latestProgress = useRef(progress);
  latestProgress.current = progress;
  useEffect(() => {
    let live = true;
    loadProblem(slug)
      .then((p) => {
        if (!live) return;
        setProblem(p);
        const existing = latestProgress.current[slug];
        setDraft(existing?.draft ?? p.starter);
        if (!existing)
          onProgress({
            slug,
            draft: p.starter,
            status: "started",
            updatedAt: Date.now(),
          });
      })
      .catch((e) => live && setError(e.message));
    return () => {
      live = false;
    };
  }, [slug, attempt]);
  useEffect(() => {
    document.title = problem
      ? `${problem.title} — Pattern Lab`
      : "Pattern Lab — Algorithm Trainer";
  }, [problem]);
  function updateDraft(value: string) {
    setDraft(value);
    onProgress({
      ...latestProgress.current[slug],
      slug,
      draft: value,
      status: latestProgress.current[slug]?.status ?? "started",
      updatedAt: Date.now(),
    });
  }
  function result(passed: number, total: number) {
    onProgress({
      ...latestProgress.current[slug],
      slug,
      draft: latestProgress.current[slug]?.draft ?? draft,
      status:
        passed === total
          ? "solved"
          : (latestProgress.current[slug]?.status ?? "started"),
      lastResult: { passed, total, at: Date.now() },
      updatedAt: Date.now(),
    });
  }
  const drag = (clientX: number) => {
    const rect = split.current?.getBoundingClientRect();
    if (rect)
      setRatio(
        Math.max(28, Math.min(64, ((clientX - rect.left) / rect.width) * 100)),
      );
  };
  const position = catalog.findIndex((p) => p.slug === slug) + 1;
  return (
    <div className={`workspace ${collapsed ? "sidebar-hidden" : ""}`}>
      <Sidebar
        slug={slug}
        progress={progress}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <main className="workspace-main">
        {error ? (
          <div className="page-error">
            <h1>Could not open this problem</h1>
            <p>{error}</p>
            <button
              onClick={() => {
                setError("");
                setAttempt((a) => a + 1);
              }}
            >
              Retry
            </button>
            <a href="#/problems">Back to problems</a>
          </div>
        ) : !problem ? (
          <div className="loading page-loading">
            <LoaderCircle className="spin" />
            Loading lesson…
          </div>
        ) : (
          <>
            <div className="problem-header">
              <div className="problem-position">
                {String(position).padStart(2, "0")} / 179
              </div>
              <div className="title-row">
                <h1>{problem.title}</h1>
                {progress[slug]?.status === "solved" && (
                  <span className="solved-badge">
                    <CheckCircle2 size={16} />
                    Solved
                  </span>
                )}
              </div>
              <div className="problem-meta">
                <span
                  className={`difficulty ${problem.difficulty.toLowerCase()}`}
                >
                  {problem.difficulty}
                </span>
                {problem.pattern.slice(0, 3).map((p) => (
                  <span key={p}>{p}</span>
                ))}
              </div>
            </div>
            <nav className="workspace-tabs" aria-label="Learning views">
              {(["learn", "practice", "solution"] as Tab[]).map((t) => (
                <a
                  key={t}
                  className={t === tab ? "active" : ""}
                  href={`#/problems/${slug}/${t}`}
                  aria-current={t === tab ? "page" : undefined}
                >
                  {t[0].toUpperCase() + t.slice(1)}
                </a>
              ))}
            </nav>
            <div
              className="split-view"
              ref={split}
              style={{
                gridTemplateColumns: `minmax(0,${ratio}fr) 12px minmax(0,${100 - ratio}fr)`,
              }}
            >
              <LessonContent
                key={`${slug}-${tab}`}
                problem={problem}
                mode={tab}
              />
              <div
                className="pane-divider"
                role="separator"
                tabIndex={0}
                aria-label="Resize lesson and workspace panes"
                aria-orientation="vertical"
                aria-valuenow={Math.round(ratio)}
                aria-valuemin={28}
                aria-valuemax={64}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                    e.preventDefault();
                    setRatio((r) =>
                      Math.max(
                        28,
                        Math.min(64, r + (e.key === "ArrowLeft" ? -2 : 2)),
                      ),
                    );
                  }
                }}
                onPointerDown={(e) => {
                  dragging.current = true;
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (dragging.current) drag(e.clientX);
                }}
                onPointerUp={() => {
                  dragging.current = false;
                }}
                onDoubleClick={() => setRatio(41)}
              />
              <div className="workspace-panel" key={`${slug}-${tab}-workspace`}>
                {tab === "learn" ? (
                  <Walkthrough problem={problem} />
                ) : tab === "practice" ? (
                  <Practice
                    problem={problem}
                    draft={draft}
                    onDraft={updateDraft}
                    onResult={result}
                  />
                ) : (
                  <Solution
                    problem={problem}
                    onPractice={() => {
                      location.hash = `/problems/${slug}/practice`;
                    }}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
export default function App() {
  const [current, setCurrent] = useState(route),
    [progress, setProgress] = useState<Record<string, Progress>>({}),
    [ready, setReady] = useState(false),
    [storageError, setStorageError] = useState(""),
    [last, setLast] = useState("two-sum");
  useEffect(() => {
    const hash = () => setCurrent(route());
    window.addEventListener("hashchange", hash);
    Promise.all([allProgress(), getLastProblem()])
      .then(([entries, lastSlug]) => {
        setProgress(Object.fromEntries(entries.map((p) => [p.slug, p])));
        if (lastSlug && catalog.some((p) => p.slug === lastSlug))
          setLast(lastSlug);
      })
      .catch((e) => setStorageError(String(e.message)))
      .finally(() => setReady(true));
    return () => window.removeEventListener("hashchange", hash);
  }, []);
  useEffect(() => {
    if (current.slug && catalog.some((p) => p.slug === current.slug)) {
      setLast(current.slug);
      setLastProblem(current.slug).catch((e) =>
        setStorageError(String(e.message)),
      );
    }
    if (!current.slug) document.title = "Pattern Lab — Algorithm Trainer";
  }, [current.slug]);
  function update(p: Progress) {
    setProgress((previous) => ({ ...previous, [p.slug]: p }));
    saveProgress(p).catch((e) => setStorageError(String(e.message)));
  }
  return (
    <>
      <header className="app-header">
        <a className="brand" href="#/problems" aria-label="Pattern Lab home">
          <svg className="brand-mark" viewBox="0 0 36 32" aria-hidden="true">
            <path
              d="M12 5H5v22h7M24 5h7v22h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            />
          </svg>
          <span>Pattern Lab</span>
        </a>
        <nav aria-label="Main navigation">
          <a className={!current.slug ? "active" : ""} href="#/problems">
            Problems
          </a>
          <a
            className={current.slug ? "active" : ""}
            href={`#/problems/${last}/learn`}
          >
            Workspace
          </a>
        </nav>
        <span className="runtime-label">
          Python 3 <span className="local-indicator">Local</span>
        </span>
      </header>
      {storageError && (
        <div className="storage-warning" role="alert">
          {storageError} Your current work is still available until this page
          closes.
        </div>
      )}
      {!ready ? (
        <div className="loading page-loading">Opening your workspace…</div>
      ) : current.slug ? (
        <Workspace
          key={current.slug}
          slug={current.slug}
          tab={current.tab}
          progress={progress}
          onProgress={update}
        />
      ) : (
        <Library progress={progress} />
      )}
    </>
  );
}
