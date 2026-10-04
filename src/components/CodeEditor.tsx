import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
type Props = {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  label?: string;
};
export default function CodeEditor({
  value,
  onChange,
  readOnly = false,
  label = "Python code editor",
}: Props) {
  const parent = useRef<HTMLDivElement>(null),
    view = useRef<EditorView | undefined>(undefined),
    change = useRef(onChange);
  change.current = onChange;
  useEffect(() => {
    if (!parent.current) return;
    const editor = new EditorView({
      doc: value,
      parent: parent.current,
      extensions: [
        basicSetup,
        python(),
        oneDark,
        ...(readOnly ? [EditorView.lineWrapping] : []),
        keymap.of([indentWithTab]),
        EditorState.readOnly.of(readOnly),
        EditorView.editable.of(!readOnly),
        EditorState.tabSize.of(4),
        EditorView.contentAttributes.of({ "aria-label": label }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) change.current?.(update.state.doc.toString());
        }),
        EditorView.theme({
          "&": { backgroundColor: "#111518", fontSize: "14px" },
          ".cm-scroller": {
            fontFamily: '"SFMono-Regular",Consolas,"Liberation Mono",monospace',
            lineHeight: "1.75",
          },
          ".cm-gutters": {
            backgroundColor: "#13171a",
            borderRight: "1px solid #262d33",
          },
          ".cm-content": { padding: "16px 0" },
          ".cm-activeLine": { backgroundColor: "#c1f17a08" },
          "&.cm-focused .cm-cursor": { borderLeftColor: "#c1f17a" },
        }),
      ],
    });
    view.current = editor;
    return () => {
      editor.destroy();
      view.current = undefined;
    };
  }, [readOnly, label]);
  useEffect(() => {
    const editor = view.current;
    if (editor && editor.state.doc.toString() !== value)
      editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: value },
      });
  }, [value]);
  return <div className="code-editor" ref={parent} />;
}
