import { RichUtils } from "draft-js";

const inlineStyles = [
  { style: "BOLD", label: "B", className: "t-bold" },
  { style: "ITALIC", label: "I", className: "t-italic" },
  { style: "UNDERLINE", label: "U", className: "t-underline" },
  { style: "CODE", label: "</>", className: "t-code" },
];

const blockTypes = [
  { type: "header-one", label: "H1" },
  { type: "header-two", label: "H2" },
  { type: "unordered-list-item", label: "Bullets" },
  { type: "ordered-list-item", label: "Numbered" },
  { type: "blockquote", label: "Quote" },
];

export default function Toolbar({ editorState, onChange }) {
  const activeInline = editorState.getCurrentInlineStyle();
  const selection = editorState.getSelection();
  const block = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
  const activeBlock = block ? block.getType() : "";

  const toggleInline = (e, style) => {
    e.preventDefault();
    onChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlock = (e, type) => {
    e.preventDefault();
    onChange(RichUtils.toggleBlockType(editorState, type));
  };

  return (
    <div className="toolbar">
      {inlineStyles.map((item) => (
        <button
          key={item.style}
          className={(activeInline.has(item.style) ? "tool on " : "tool ") + item.className}
          onMouseDown={(e) => toggleInline(e, item.style)}
        >
          {item.label}
        </button>
      ))}
      <span className="divider" />
      {blockTypes.map((item) => (
        <button
          key={item.type}
          className={activeBlock === item.type ? "tool on" : "tool"}
          onMouseDown={(e) => toggleBlock(e, item.type)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
