import { EditorState, convertFromRaw } from "draft-js";

export function stateFromRaw(content, selection) {
  if (!content) return EditorState.createEmpty();
  try {
    let state = EditorState.createWithContent(convertFromRaw(JSON.parse(content)));
    if (selection) {
      const blocks = state.getCurrentContent();
      const hasAnchor = blocks.getBlockForKey(selection.getAnchorKey());
      const hasFocus = blocks.getBlockForKey(selection.getFocusKey());
      if (hasAnchor && hasFocus) state = EditorState.acceptSelection(state, selection);
    }
    return state;
  } catch {
    return EditorState.createEmpty();
  }
}

export function previewOf(content) {
  if (!content) return "";
  try {
    const raw = JSON.parse(content);
    const line = raw.blocks.map((b) => b.text).find((t) => t.trim());
    return line ? line.slice(0, 70) : "";
  } catch {
    return "";
  }
}

export function timeAgo(date) {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 45) return "just now";
  if (seconds < 3600) return Math.floor(seconds / 60) + " min ago";
  if (seconds < 86400) return Math.floor(seconds / 3600) + " h ago";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
