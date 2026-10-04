import { useRef, useState } from "react";
import { allProgress, importProgress } from "../data/storage";
import {
  downloadFile,
  makeBackup,
  parseBackup,
  MAX_BACKUP_BYTES,
} from "../data/backup";

export default function ProgressTools() {
  const dialog = useRef<HTMLDialogElement>(null),
    opener = useRef<HTMLButtonElement>(null);
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function exportBackup() {
    setBusy(true);
    try {
      downloadFile(
        `dadalcode-progress-${new Date().toISOString().slice(0, 10)}.json`,
        makeBackup(await allProgress()),
        "application/json",
      );
      setMessage(
        "Backup downloaded. It contains saved drafts and completion records.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Export failed.");
    } finally {
      setBusy(false);
    }
  }
  async function restore(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      if (file.size > MAX_BACKUP_BYTES)
        throw new Error("Backup must be no larger than 5 MB.");
      const entries = parseBackup(await file.text()),
        added = await importProgress(entries);
      setMessage(
        `Imported ${added} problems. Kept ${entries.length - added} existing drafts unchanged.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button
        ref={opener}
        className="subtle"
        onClick={() => dialog.current?.showModal()}
      >
        Your progress
      </button>
      <dialog
        className="progress-dialog"
        ref={dialog}
        aria-labelledby="progress-title"
        onClose={() => opener.current?.focus()}
      >
        <h2 id="progress-title">Your progress</h2>
        <p>
          Drafts and completion are saved in this browser. Back them up before
          clearing browser data or moving to another computer.
        </p>
        <button onClick={exportBackup} disabled={busy}>
          Export saved progress
        </button>
        <label className="backup-input">
          Import progress backup
          <input
            type="file"
            accept=".json,application/json"
            disabled={busy}
            onChange={(event) => {
              void restore(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
        <p>
          Import adds missing problems and preserves existing drafts. Unsaved or
          conflicting edits must be downloaded from the workspace first.
        </p>
        <p role="status">{message}</p>
        <p>
          <a
            href={`${import.meta.env.BASE_URL}credits.html`}
            target="_blank"
            rel="noreferrer"
          >
            Credits and licenses
          </a>
        </p>
        <button onClick={() => dialog.current?.close()}>Close</button>
      </dialog>
    </>
  );
}
