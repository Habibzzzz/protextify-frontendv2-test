import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical";
import { useCallback } from "react";

/**
 * Komponen ToolbarPlugin
 * Komponen ini menampilkan toolbar editor dengan berbagai tombol format dan elemen.
 * Toolbar ini terintegrasi dengan Lexical Editor dan dapat dinonaktifkan melalui prop 'disabled'.
 *
 * @param {Object} props - Properti komponen.
 * @param {boolean} props.disabled - Jika true, semua tombol toolbar akan dinonaktifkan.
 */
export function ToolbarPlugin({ disabled }) {
  // Mengambil instance editor dari context Lexical
  const [editor] = useLexicalComposerContext();

  /**
   * Fungsi untuk menerapkan format teks (bold, italic, underline, dll)
   * @param {string} format - Jenis format yang akan diterapkan.
   */
  const applyFormat = useCallback(
    (format) => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    },
    [editor]
  );

  /**
   * Fungsi untuk menerapkan elemen (heading, list, alignment, dll)
   * @param {string} element - Jenis elemen yang akan diterapkan.
   */
  const applyElement = useCallback(
    (element) => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, element);
    },
    [editor]
  );

  // Render toolbar dengan berbagai tombol format dan elemen
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
      {/* Tombol Bold */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyFormat("bold")}
        disabled={disabled}
      >
        <b>B</b>
      </button>

      {/* Tombol Italic */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyFormat("italic")}
        disabled={disabled}
      >
        <i>I</i>
      </button>

      {/* Tombol Underline */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyFormat("underline")}
        disabled={disabled}
      >
        <u>U</u>
      </button>

      {/* Tombol Strikethrough */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyFormat("strikethrough")}
        disabled={disabled}
      >
        <s>S</s>
      </button>

      {/* Tombol Heading 1 */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("h1")}
        disabled={disabled}
      >
        H1
      </button>

      {/* Tombol Heading 2 */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("h2")}
        disabled={disabled}
      >
        H2
      </button>

      {/* Tombol Heading 3 */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("h3")}
        disabled={disabled}
      >
        H3
      </button>

      {/* Tombol Unordered List */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("ul")}
        disabled={disabled}
      >
        • List
      </button>

      {/* Tombol Ordered List */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("ol")}
        disabled={disabled}
      >
        1. List
      </button>

      {/* Tombol Align Left */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("left")}
        disabled={disabled}
      >
        Left
      </button>

      {/* Tombol Align Center */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("center")}
        disabled={disabled}
      >
        Center
      </button>

      {/* Tombol Align Right */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("right")}
        disabled={disabled}
      >
        Right
      </button>

      {/* Tombol Justify */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("justify")}
        disabled={disabled}
      >
        Justify
      </button>

      {/* Tombol Quote */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("quote")}
        disabled={disabled}
      >
        “ Quote
      </button>

      {/* Tombol Code Block */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("code")}
        disabled={disabled}
      >
        {"</>"} Code
      </button>

      {/* Tombol Undo */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND)}
        disabled={disabled}
      >
        ↺ Undo
      </button>

      {/* Tombol Redo */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => editor.dispatchCommand(REDO_COMMAND)}
        disabled={disabled}
      >
        ↻ Redo
      </button>

      {/* Tombol Insert Image */}
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("image")}
        disabled={disabled}
      >
        Image
      </button>
    </div>
  );
}
