import { useEffect, useRef, useState } from "react";
import { Editor, RichUtils, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import Toolbar from "./Toolbar.jsx";
import { CLIENT_ID } from "../firebase.js";
import { stateFromRaw } from "../utils.js";

const statusText = {
  saved: "All changes saved",
  saving: "Saving...",
  synced: "Updated from another device",
  error: "Could not save, check your connection",
};

const blockClass = (block) => (block.getType() === "blockquote" ? "quote-block" : "");

export default function NoteEditor({ note, onSave }) {
  const [title, setTitle] = useState(note.title);
  const [editorState, setEditorState] = useState(() => stateFromRaw(note.content));
  const [status, setStatus] = useState("saved");
  const editor = useRef(null);
  const timer = useRef(null);
  const pending = useRef(null);
  const lastSaved = useRef(note.content);

  const flush = async () => {
    clearTimeout(timer.current);
    if (!pending.current) return;
    const { nextTitle, state } = pending.current;
    pending.current = null;
    const content = JSON.stringify(convertToRaw(state.getCurrentContent()));
    lastSaved.current = content;
    try {
      await onSave(note.id, { title: nextTitle, content });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  const queue = (nextTitle, state) => {
    pending.current = { nextTitle, state };
    setStatus("saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, 700);
  };

  useEffect(() => {
    return () => {
      flush();
    };
  }, []);

  useEffect(() => {
    if (note.lastEditor === CLIENT_ID) return;
    if (note.content !== lastSaved.current) {
      lastSaved.current = note.content;
      setEditorState((prev) => stateFromRaw(note.content, prev.getSelection()));
      setStatus("synced");
    }
    setTitle(note.title);
  }, [note.content, note.title, note.lastEditor]);

  const handleChange = (state) => {
    const changed = state.getCurrentContent() !== editorState.getCurrentContent();
    setEditorState(state);
    if (changed) queue(title, state);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
    queue(e.target.value, editorState);
  };

  const handleKeyCommand = (command, state) => {
    const next = RichUtils.handleKeyCommand(state, command);
    if (next) {
      handleChange(next);
      return "handled";
    }
    return "not-handled";
  };

  return (
    <section className="note">
      <div className="note-top">
        <Toolbar editorState={editorState} onChange={handleChange} />
        <span className={"status " + status}>{statusText[status]}</span>
      </div>

      <div className="page">
        <input
          className="title-input"
          value={title}
          onChange={handleTitle}
          placeholder="Untitled"
          maxLength={120}
        />
        <div className="editor-box" onClick={() => editor.current && editor.current.focus()}>
          <Editor
            ref={editor}
            editorState={editorState}
            onChange={handleChange}
            handleKeyCommand={handleKeyCommand}
            onTab={(e) => handleChange(RichUtils.onTab(e, editorState, 4))}
            blockStyleFn={blockClass}
            placeholder="Start typing, or use the toolbar to format..."
          />
        </div>
      </div>
    </section>
  );
}
