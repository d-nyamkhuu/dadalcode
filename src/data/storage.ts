import type { Progress } from "../types";
let dbPromise: Promise<IDBDatabase> | undefined;
function database() {
  return (dbPromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open("pattern-lab", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("progress", { keyPath: "slug" });
      request.result.createObjectStore("settings");
    };
    request.onsuccess = () => resolve(request.result);
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
export async function saveProgress(progress: Progress) {
  const db = await database();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("progress", "readwrite");
    tx.objectStore("progress").put(progress);
    tx.oncomplete = () => resolve();
    tx.onerror = () =>
      reject(
        new Error("Could not save your work. Browser storage may be full."),
      );
  });
}
export async function setLastProblem(slug: string) {
  const db = await database();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("settings", "readwrite");
    tx.objectStore("settings").put(slug, "lastProblem");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
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
