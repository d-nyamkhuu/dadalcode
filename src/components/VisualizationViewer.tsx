import { useId, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  SlidersHorizontal,
  X,
} from "lucide-react";

type Props = {
  title: string;
  resetKey: unknown;
  toolbar: ReactNode;
  visualization: ReactNode;
  summary: ReactNode;
  details: ReactNode;
  instruction: ReactNode;
  truncated?: boolean;
};

export default function VisualizationViewer({
  title,
  resetKey,
  toolbar,
  visualization,
  summary,
  details,
  instruction,
  truncated = false,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [manualScale, setManualScale] = useState<number | null>(null);
  const [size, setSize] = useState({ width: 720, height: 400, scale: 1 });
  // The portal target never changes. Moving this host preserves the diagram's
  // node-position caches, DOM identities, and focus while using native modality.
  const [host] = useState(() => document.createElement("div"));
  const inline = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const modalSlot = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const enlargeButton = useRef<HTMLButtonElement>(null);
  const detailsToggle = useRef<HTMLButtonElement>(null);
  const detailsClose = useRef<HTMLButtonElement>(null);
  const hadDetails = useRef(false);
  const wasExpanded = useRef(false);
  const id = useId();

  useLayoutEffect(() => {
    const target = expanded ? modalSlot.current : inline.current;
    if (!target || !dialog.current) return;
    target.appendChild(host);
    if (expanded) {
      dialog.current.showModal();
      closeButton.current?.focus({ preventScroll: true });
    } else if (wasExpanded.current) {
      dialog.current.close();
      enlargeButton.current?.focus({ preventScroll: true });
    }
    wasExpanded.current = expanded;
  }, [expanded, host]);

  useLayoutEffect(() => () => host.remove(), [host]);

  useLayoutEffect(() => {
    if (!expanded) return;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    const modal = dialog.current!;
    // Native modality makes the background inert. Explicitly wrap Tab as well
    // so keyboard navigation does not escape into the browser's chrome.
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = [
        ...modal.querySelectorAll<HTMLElement>(
          "button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex='-1'])",
        ),
      ].filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (
        (event.shiftKey && document.activeElement === first) ||
        (!event.shiftKey && document.activeElement === last)
      ) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus({ preventScroll: true });
      }
    };
    modal.addEventListener("keydown", trapFocus);
    return () => {
      root.style.overflow = overflow;
      modal.removeEventListener("keydown", trapFocus);
    };
  }, [expanded]);

  useLayoutEffect(() => {
    if (detailsOpen) detailsClose.current?.focus({ preventScroll: true });
    else if (hadDetails.current)
      detailsToggle.current?.focus({ preventScroll: true });
    hadDetails.current = detailsOpen;
  }, [detailsOpen]);

  useLayoutEffect(() => {
    setManualScale(null);
    setDetailsOpen(false);
  }, [resetKey]);

  useLayoutEffect(() => {
    const slot = inline.current;
    const pane = slot?.closest<HTMLElement>(".workspace-panel");
    const panel = slot?.closest<HTMLElement>(".walkthrough.panel");
    if (!slot || !pane || !panel) return;
    const measure = () => {
      // Reserve the heading and compact example controls. The input disclosure
      // may intentionally scroll, but opening it never resizes the diagrams.
      const editor =
        panel.querySelector<HTMLDetailsElement>(".wt-input-editor");
      const editorExtra = editor?.open
        ? editor.offsetHeight -
          (editor.querySelector("summary")?.clientHeight ?? 0)
        : 0;
      const reserved =
        (anchor.current ?? slot).getBoundingClientRect().top -
        pane.getBoundingClientRect().top +
        pane.scrollTop -
        editorExtra +
        parseFloat(getComputedStyle(panel).paddingBottom) +
        8;
      slot.style.height = `${Math.max(170, pane.clientHeight - reserved)}px`;
    };
    // ResizeObserver runs during layout. Defer its height write to the next
    // frame so resizing the pane cannot create an undelivered observer loop.
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    });
    observer.observe(pane);
    const heading = panel.querySelector(".panel-heading");
    const example = panel.querySelector(".wt-example-row");
    if (heading) observer.observe(heading);
    if (example) observer.observe(example);
    measure();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  useLayoutEffect(() => {
    const surface = viewport.current;
    const content = canvas.current;
    if (!surface || !content) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = Math.ceil(
          Math.max(content.offsetWidth, content.scrollWidth),
        );
        const height = Math.ceil(
          Math.max(content.offsetHeight, content.scrollHeight),
        );
        const availableWidth = Math.max(1, surface.clientWidth - 24);
        const availableHeight = Math.max(1, surface.clientHeight - 24);
        const scale = Math.min(
          1,
          availableWidth / Math.max(1, width),
          availableHeight / Math.max(1, height),
        );
        setSize((previous) =>
          previous.width === width &&
          previous.height === height &&
          Math.abs(previous.scale - scale) < 0.001
            ? previous
            : { width, height, scale },
        );
      });
    };
    const resize = new ResizeObserver(measure);
    resize.observe(surface);
    resize.observe(content);
    const mutations = new MutationObserver(measure);
    mutations.observe(content, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    measure();
    return () => {
      resize.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const scale = manualScale ?? size.scale;
  function zoom(delta: number) {
    setManualScale(
      Math.max(0.1, Math.min(3, Math.round((scale + delta) * 100) / 100)),
    );
  }
  function fit() {
    setManualScale(null);
    if (viewport.current) {
      viewport.current.scrollLeft = 0;
      viewport.current.scrollTop = 0;
    }
  }

  return (
    <>
      <div ref={anchor} />
      <div className="vv-inline" ref={inline} />
      <dialog
        className="vv-dialog"
        ref={dialog}
        aria-label={`${title} expanded walkthrough`}
        onCancel={(event) => {
          event.preventDefault();
          setExpanded(false);
        }}
      >
        <div className="vv-modal-slot" ref={modalSlot} />
      </dialog>
      {createPortal(
        <section
          className={`vv-content ${expanded ? "vv-expanded" : ""}`}
          aria-label="Visualization viewer"
          tabIndex={0}
        >
          <header className="vv-heading">
            <div>
              <span className="vv-eyebrow">
                {expanded ? title : "LIVE WALKTHROUGH"}
              </span>
              <h3>Visualization</h3>
            </div>
            <div className="vv-view-actions">
              <button
                aria-label="Fit visualization"
                aria-pressed={manualScale === null}
                onClick={fit}
              >
                Fit
              </button>
              <button
                aria-label="Zoom out"
                disabled={scale <= 0.1}
                onClick={() => zoom(-0.1)}
              >
                <Minus size={14} />
              </button>
              <output className="vv-zoom" aria-label="Visualization zoom">
                {Math.round(scale * 100)}%
              </output>
              <button
                aria-label="Zoom in"
                disabled={scale >= 3}
                onClick={() => zoom(0.1)}
              >
                <Plus size={14} />
              </button>
              <button
                className="vv-enlarge"
                ref={expanded ? closeButton : enlargeButton}
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                {expanded ? "Close" : "Enlarge"}
              </button>
            </div>
          </header>
          <div className="vv-body">
            <div
              className={`vv-viewport ${manualScale === null ? "vv-fit" : "vv-manual"}`}
              ref={viewport}
              aria-label="Algorithm diagram"
            >
              <div
                className="vv-scaled"
                style={{
                  width: size.width * scale,
                  height: size.height * scale,
                }}
              >
                <div
                  className="vv-canvas"
                  ref={canvas}
                  style={{ transform: `scale(${scale})` }}
                >
                  {visualization}
                </div>
              </div>
            </div>
            <aside
              className="vv-details"
              id={`${id}-details`}
              aria-label="State details"
              hidden={!detailsOpen}
            >
              <div className="vv-details-heading">
                <h4>State details</h4>
                <button
                  ref={detailsClose}
                  aria-label="Close state details"
                  onClick={() => setDetailsOpen(false)}
                >
                  <X size={15} />
                </button>
              </div>
              {details}
            </aside>
          </div>
          <div className="vv-summary">{summary}</div>
          {truncated && (
            <p className="notice vv-trace-notice" role="status">
              Trace limited to 2,000 Python events · use a smaller input for the
              full walkthrough.
            </p>
          )}
          <div className="vv-controls">
            <button
              ref={detailsToggle}
              className="vv-details-toggle"
              aria-expanded={detailsOpen}
              aria-controls={`${id}-details`}
              onClick={() => setDetailsOpen((value) => !value)}
            >
              <SlidersHorizontal size={13} /> State details
            </button>
            {toolbar}
          </div>
          <footer className="vv-instruction">{instruction}</footer>
        </section>,
        host,
      )}
    </>
  );
}
