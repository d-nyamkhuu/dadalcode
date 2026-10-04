import { useEffect, useRef, useState } from "react";
import type { ProblemDefinition, Progress } from "../types";
import {
  ensureProgress,
  readProgress,
  revisionOf,
  saveProgress,
  ProgressConflict,
} from "../data/storage";

export function useDraft(
  problem: ProblemDefinition | null,
  onProgress: (p: Progress) => void,
) {
  const [draft, setDraft] = useState(""),
    [ready, setReady] = useState(false);
  const [status, setStatus] = useState("Opening saved draft…"),
    [conflict, setConflict] = useState(false);
  const saved = useRef<Progress | undefined>(undefined),
    blocked = useRef(false);
  const queue = useRef(Promise.resolve()),
    pending = useRef(0),
    alive = useRef(true);
  const currentDraft = useRef(draft);
  currentDraft.current = draft;
  const report = useRef(onProgress);
  report.current = onProgress;
  useEffect(() => {
    alive.current = true;
    const guard = (event: BeforeUnloadEvent) => {
      if (pending.current || blocked.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", guard);
    return () => {
      alive.current = false;
      window.removeEventListener("beforeunload", guard);
    };
  }, []);
  useEffect(() => {
    if (!problem) return;
    let live = true;
    ensureProgress(problem.slug, problem.starter)
      .then((record) => {
        if (!live) return;
        saved.current = record;
        let recovery: string | null = null;
        try {
          recovery = sessionStorage.getItem(
            `loopcraft-recovery:${record.slug}`,
          );
        } catch {
          /* Recovery storage can be unavailable too. */
        }
        const hasRecovery = recovery !== null && recovery !== record.draft;
        setDraft(hasRecovery ? recovery! : record.draft);
        blocked.current = hasRecovery;
        setConflict(hasRecovery);
        report.current(record);
        setReady(true);
        setStatus(
          hasRecovery
            ? "Recovered unsaved edits from this tab. Choose which draft to keep."
            : "Saved locally",
        );
      })
      .catch((error: Error) => {
        if (!live) return;
        saved.current = {
          slug: problem.slug,
          draft: problem.starter,
          status: "started",
          updatedAt: Date.now(),
        };
        setDraft(problem.starter);
        setReady(true);
        setStatus(error.message);
      });
    return () => {
      live = false;
    };
  }, [problem]);
  function enqueue(value: string, result?: Progress["lastResult"]) {
    pending.current++;
    if (!blocked.current) setStatus("Saving…");
    queue.current = queue.current
      .then(async () => {
        if (blocked.current || !saved.current) return;
        const previous = saved.current;
        try {
          const record = await saveProgress(
            {
              ...previous,
              draft: value,
              status:
                result && result.passed === result.total
                  ? "solved"
                  : previous.status,
              lastResult: result ?? previous.lastResult,
            },
            revisionOf(previous),
          );
          saved.current = record;
          if (alive.current) report.current(record);
        } catch (error) {
          blocked.current = true;
          if (alive.current) {
            setConflict(error instanceof ProgressConflict);
            setStatus(
              error instanceof Error
                ? error.message
                : "Save failed. Download your draft.",
            );
          }
        }
      })
      .finally(() => {
        pending.current--;
        if (!pending.current && !blocked.current) {
          try {
            if (problem)
              sessionStorage.removeItem(`loopcraft-recovery:${problem.slug}`);
          } catch {
            /* Best-effort recovery only. */
          }
          if (alive.current) setStatus("Saved locally");
        }
      });
  }
  function update(value: string) {
    // Synchronizing the editor after loading a saved draft is not a user edit.
    if (value === currentDraft.current) return;
    currentDraft.current = value;
    setDraft(value);
    try {
      if (problem)
        sessionStorage.setItem(`loopcraft-recovery:${problem.slug}`, value);
    } catch {
      /* Save status still reports the IndexedDB result. */
    }
    enqueue(value);
  }
  function result(passed: number, total: number) {
    enqueue(currentDraft.current, { passed, total, at: Date.now() });
  }
  async function resolve(useMine: boolean) {
    await queue.current;
    if (!problem) return;
    try {
      const current = await readProgress(problem.slug);
      if (!current)
        throw new Error(
          "Saved progress is unavailable. Download your draft before reloading.",
        );
      saved.current = current;
      blocked.current = false;
      setConflict(false);
      if (useMine) enqueue(currentDraft.current);
      else {
        currentDraft.current = current.draft;
        setDraft(current.draft);
        try {
          sessionStorage.removeItem(`loopcraft-recovery:${current.slug}`);
        } catch {
          /* Optional recovery storage. */
        }
        report.current(current);
        setStatus("Saved locally");
      }
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Could not read saved progress.",
      );
    }
  }
  return {
    draft,
    ready,
    status,
    conflict,
    update,
    result,
    resolve,
    retry: () => {
      blocked.current = false;
      enqueue(draft);
    },
  };
}
