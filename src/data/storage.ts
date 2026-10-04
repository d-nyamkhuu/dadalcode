import type { Progress } from "../types";

let dbPromise: Promise<IDBDatabase> | undefined;
const channel =
  typeof BroadcastChannel === "undefined"
    ? null
    : new BroadcastChannel("loopcraft-progress");
const changed = new EventTarget();
export function subscribeProgress(listener: () => void) {
  channel?.addEventListener("message", listener);
  changed.addEventListener("change", listener);
  return () => {
    channel?.removeEventListener("message", listener);
    changed.removeEventListener("change", listener);
  };
}
function announce() {
  channel?.postMessage("changed");
  changed.dispatchEvent(new Event("change"));
}
function database() {
  return (dbPromise ??= new Promise((resolve, reject) => {
    // Preserve the original database name so existing users keep their drafts.
    const request = indexedDB.open("pattern-lab", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("progress", { keyPath: "slug" });
      request.result.createObjectStore("settings");
    };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => {
        db.close();
        dbPromise = undefined;
      };
      resolve(db);
    };
    request.onerror = () => {
      dbPromise = undefined;
      reject(
        new Error("Browser storage is unavailable. Changes will not persist."),
      );
    };
  }));
}
export async function allProgress(): Promise<Progress[]> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const r = db.transaction("progress").objectStore("progress").getAll();
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
export async function readProgress(
  slug: string,
): Promise<Progress | undefined> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const r = db.transaction("progress").objectStore("progress").get(slug);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
export function revisionOf(progress?: Progress) {
  return progress
    ? (progress.revision ?? `legacy:${progress.updatedAt}`)
    : undefined;
}
export class ProgressConflict extends Error {
  constructor() {
    super("Another tab saved a newer version. Your draft has been kept here.");
  }
}
/** Read and create in one transaction: opening a stale tab must never replace work. */
export async function ensureProgress(
  slug: string,
  starter: string,
): Promise<Progress> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("progress", "readwrite"),
      store = tx.objectStore("progress");
    let result: Progress,
      created = false;
    const request = store.get(slug);
    request.onsuccess = () => {
      result = request.result;
      if (!result) {
        result = {
          slug,
          draft: starter,
          status: "started",
          updatedAt: Date.now(),
          revision: crypto.randomUUID(),
        };
        store.add(result);
        created = true;
      }
    };
    tx.oncomplete = () => {
      if (created) announce();
      resolve(result);
    };
    tx.onabort = () =>
      reject(tx.error ?? new Error("Could not open saved progress."));
  });
}
/** Compare and write in the same transaction; a stale editor cannot overwrite a newer draft. */
export async function saveProgress(
  progress: Progress,
  expectedRevision: string | undefined,
): Promise<Progress> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("progress", "readwrite"),
      store = tx.objectStore("progress");
    let conflict = false;
    const result = {
      ...progress,
      updatedAt: Date.now(),
      revision: crypto.randomUUID(),
    };
    const request = store.get(progress.slug);
    request.onsuccess = () => {
      if (revisionOf(request.result) !== expectedRevision) {
        conflict = true;
        tx.abort();
      } else store.put(result);
    };
    tx.oncomplete = () => {
      announce();
      resolve(result);
    };
    tx.onabort = () =>
      reject(
        conflict
          ? new ProgressConflict()
          : new Error(
              "Could not save your work. Download your draft before closing this page.",
            ),
      );
  });
}
/** Restore only missing records. Never silently replace an existing draft. */
export async function importProgress(entries: Progress[]) {
  const db = await database();
  return new Promise<number>((resolve, reject) => {
    const tx = db.transaction("progress", "readwrite"),
      store = tx.objectStore("progress");
    let added = 0;
    for (const entry of entries) {
      const request = store.get(entry.slug);
      request.onsuccess = () => {
        if (!request.result) {
          store.add({ ...entry, revision: crypto.randomUUID() });
          added++;
        }
      };
    }
    tx.oncomplete = () => {
      announce();
      resolve(added);
    };
    tx.onabort = () =>
      reject(new Error("Import failed. No progress was changed."));
  });
}
export async function setLastProblem(slug: string) {
  const db = await database();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("settings", "readwrite");
    tx.objectStore("settings").put(slug, "lastProblem");
    tx.oncomplete = () => resolve();
    tx.onabort = () =>
      reject(tx.error ?? new Error("Could not save the last problem."));
  });
}
export async function getLastProblem(): Promise<string | undefined> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const r = db
      .transaction("settings")
      .objectStore("settings")
      .get("lastProblem");
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
