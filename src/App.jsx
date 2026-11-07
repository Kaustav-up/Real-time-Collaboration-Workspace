import { useEffect, useState } from "react";
import { isConfigured } from "./firebase.js";
import useNotes from "./hooks/useNotes.js";
import Sidebar from "./components/Sidebar.jsx";
import NoteEditor from "./components/NoteEditor.jsx";
import Setup from "./components/Setup.jsx";

function Workspace() {
  const { notes, loading, error, createNote, saveNote, removeNote } = useNotes();
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!activeId && notes.length > 0) setActiveId(notes[0].id);
  }, [activeId, notes]);

  const activeNote = notes.find((n) => n.id === activeId);

  const handleCreate = async () => {
    const id = await createNote();
    setActiveId(id);
    setMenuOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note for everyone?")) return;
    await removeNote(id);
    if (id === activeId) setActiveId(null);
  };

  const handleSelect = (id) => {
    setActiveId(id);
    setMenuOpen(false);
  };

  return (
    <div className="app">
      <Sidebar
        notes={notes}
        activeId={activeId}
        search={search}
        open={menuOpen}
        onSearch={setSearch}
        onSelect={handleSelect}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onClose={() => setMenuOpen(false)}
      />

      <main className="main">
        <div className="topbar">
          <button className="menu-btn" onClick={() => setMenuOpen(true)}>
            Notes
          </button>
        </div>

        {error && <p className="banner">{error}</p>}

        {loading ? (
          <p className="hint">Loading your notes...</p>
        ) : activeNote ? (
          <NoteEditor key={activeNote.id} note={activeNote} onSave={saveNote} />
        ) : (
          <div className="empty">
            <h2>Nothing open</h2>
            <p>Pick a note from the list, or start a new one.</p>
            <button className="primary" onClick={handleCreate}>
              New note
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return isConfigured ? <Workspace /> : <Setup />;
}
