import { previewOf, timeAgo } from "../utils.js";

export default function Sidebar({
  notes,
  activeId,
  search,
  open,
  onSearch,
  onSelect,
  onCreate,
  onDelete,
  onClose,
}) {
  const term = search.trim().toLowerCase();
  const shown = term
    ? notes.filter(
        (n) => n.title.toLowerCase().includes(term) || previewOf(n.content).toLowerCase().includes(term)
      )
    : notes;

  return (
    <>
      {open && <div className="scrim" onClick={onClose} />}
      <aside className={open ? "sidebar open" : "sidebar"}>
        <div className="side-head">
          <h1>Workspace</h1>
          <button className="primary small" onClick={onCreate}>
            + New
          </button>
        </div>

        <input
          className="search"
          placeholder="Search notes"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />

        {shown.length === 0 ? (
          <p className="hint">{term ? "No notes match that search." : "No notes yet."}</p>
        ) : (
          <ul className="note-list">
            {shown.map((n) => (
              <li key={n.id} className={n.id === activeId ? "note-item active" : "note-item"}>
                <button className="note-open" onClick={() => onSelect(n.id)}>
                  <span className="note-title">{n.title || "Untitled"}</span>
                  <span className="note-preview">{previewOf(n.content) || "Empty note"}</span>
                  <span className="note-time">{timeAgo(n.updatedAt)}</span>
                </button>
                <button
                  className="note-delete"
                  aria-label="Delete note"
                  onClick={() => onDelete(n.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </>
  );
}
