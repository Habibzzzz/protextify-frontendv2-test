import { $isCodeHighlightNode } from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link,
} from "lucide-react";

const LowPriority = 1;

/**
 * Komponen toolbar mengambang untuk format teks.
 * Menampilkan tombol-tombol format (bold, italic, underline, dll) di atas teks yang terseleksi.
 * @param {Object} props - Properti komponen
 */
function TextFormatFloatingToolbar({
  editor,
  anchorElem,
  isLink,
  isBold,
  isItalic,
  isUnderline,
  isCode,
  isStrikethrough,
}) {
  const popupCharStylesEditorRef = useRef(null);

  /**
   * Fungsi untuk menyisipkan atau menghapus link pada teks yang terseleksi.
   */
  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  /**
   * Fungsi untuk memperbarui posisi toolbar mengambang sesuai seleksi teks.
   */
  const updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();
    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = window.getSelection();

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);
      setFloatingElemPosition(rangeRect, popupCharStylesEditorElem, anchorElem);
    }
  }, [editor, anchorElem]);

  /**
   * Efek untuk memperbarui posisi toolbar saat window di-resize atau anchorElem di-scroll.
   */
  useEffect(() => {
    const scrollerElem = anchorElem;

    const update = () => {
      editor.getEditorState().read(() => {
        updateTextFormatFloatingToolbar();
      });
    };

    window.addEventListener("resize", update);
    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update);
    }

    return () => {
      window.removeEventListener("resize", update);
      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update);
      }
    };
  }, [editor, updateTextFormatFloatingToolbar, anchorElem]);

  /**
   * Efek untuk memperbarui posisi toolbar saat terjadi perubahan pada editor state atau seleksi.
   */
  useEffect(() => {
    editor.getEditorState().read(() => {
      updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateTextFormatFloatingToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateTextFormatFloatingToolbar();
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateTextFormatFloatingToolbar]);

  return (
    <div ref={popupCharStylesEditorRef} className="floating-text-format-popup">
      {editor.isEditable() && (
        <>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            className={`popup-item spaced${isBold ? " active" : ""}`}
            aria-label="Format text as bold"
          >
            <Bold className="format" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            className={`popup-item spaced${isItalic ? " active" : ""}`}
            aria-label="Format text as italics"
          >
            <Italic className="format" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            className={`popup-item spaced${isUnderline ? " active" : ""}`}
            aria-label="Format text to underlined"
          >
            <Underline className="format" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
            }}
            className={`popup-item spaced${isStrikethrough ? " active" : ""}`}
            aria-label="Format text with a strikethrough"
          >
            <Strikethrough className="format" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
            }}
            className={`popup-item spaced${isCode ? " active" : ""}`}
            aria-label="Insert code block"
          >
            <Code className="format" />
          </button>
          <button
            onClick={insertLink}
            className={`popup-item spaced${isLink ? " active" : ""}`}
            aria-label="Insert link"
          >
            <Link className="format" />
          </button>
        </>
      )}
    </div>
  );
}

/**
 * Hook untuk mengatur dan menampilkan toolbar format teks mengambang.
 * Mengelola state format teks dan menampilkan toolbar jika seleksi valid.
 * @param {Object} editor - Editor Lexical
 * @param {HTMLElement} anchorElem - Elemen anchor untuk portal
 * @returns {ReactPortal|null}
 */
function useFloatingTextFormatToolbar(editor, anchorElem) {
  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  /**
   * Fungsi untuk memperbarui state format teks berdasarkan seleksi saat ini.
   */
  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      const nativeSelection = window.getSelection();
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false);
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }

      const node = getSelectedNode(selection);

      if ($isCodeHighlightNode(node)) {
        setIsText(false);
        return;
      }

      if ($isTextNode(node)) {
        setIsBold(selection.hasFormat("bold"));
        setIsItalic(selection.hasFormat("italic"));
        setIsUnderline(selection.hasFormat("underline"));
        setIsStrikethrough(selection.hasFormat("strikethrough"));
        setIsCode(selection.hasFormat("code"));
        setIsText(true);
      } else {
        setIsText(false);
      }

      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    });
  }, [editor]);

  /**
   * Efek untuk memperbarui popup saat terjadi perubahan seleksi pada dokumen.
   */
  useEffect(() => {
    document.addEventListener("selectionchange", updatePopup);
    return () => {
      document.removeEventListener("selectionchange", updatePopup);
    };
  }, [updatePopup]);

  /**
   * Efek untuk memperbarui popup saat terjadi perubahan pada editor atau root element.
   */
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false);
        }
      })
    );
  }, [editor, updatePopup]);

  if (!isText || !anchorElem) {
    return null;
  }

  return createPortal(
    <TextFormatFloatingToolbar
      editor={editor}
      anchorElem={anchorElem}
      isLink={isLink}
      isBold={isBold}
      isItalic={isItalic}
      isUnderline={isUnderline}
      isCode={isCode}
      isStrikethrough={isStrikethrough}
    />,
    anchorElem
  );
}

/**
 * Plugin utama untuk menampilkan toolbar format teks mengambang.
 * @param {Object} props - Properti plugin
 */
export function FloatingTextFormatToolbarPlugin({
  anchorElem = document.body,
}) {
  const [editor] = useLexicalComposerContext();
  return useFloatingTextFormatToolbar(editor, anchorElem);
}

/**
 * Fungsi untuk mendapatkan node yang terseleksi pada editor.
 * @param {RangeSelection} selection - Seleksi saat ini
 * @returns {LexicalNode}
 */
function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

/**
 * Fungsi untuk mengecek apakah titik seleksi berada di akhir node.
 * @param {PointType} point - Titik seleksi
 * @returns {boolean}
 */
function $isAtNodeEnd(point) {
  if (point.type === "text") {
    return point.offset === point.getNode().getTextContentSize();
  }
  return point.offset === point.getNode().getChildrenSize();
}

/**
 * Fungsi untuk mendapatkan posisi (rect) dari range seleksi pada DOM.
 * @param {Selection} nativeSelection - Seleksi native browser
 * @param {HTMLElement} rootElement - Elemen root editor
 * @returns {DOMRect}
 */
function getDOMRangeRect(nativeSelection, rootElement) {
  const domRange = nativeSelection.getRangeAt(0);
  let rect;

  if (nativeSelection.anchorNode === rootElement) {
    let inner = rootElement;
    while (inner.firstElementChild !== null) {
      inner = inner.firstElementChild;
    }
    rect = inner.getBoundingClientRect();
  } else {
    rect = domRange.getBoundingClientRect();
  }

  return rect;
}

/**
 * Fungsi untuk mengatur posisi toolbar mengambang di atas seleksi teks.
 * @param {DOMRect} targetRect - Rect seleksi
 * @param {HTMLElement} floatingElem - Elemen toolbar mengambang
 * @param {HTMLElement} anchorElem - Elemen anchor
 */
function setFloatingElemPosition(targetRect, floatingElem, anchorElem) {
  // Hapus scrollerRect yang tidak digunakan
  // const scrollerRect = anchorElem.getBoundingClientRect();

  if (targetRect === null) {
    floatingElem.style.opacity = "0";
    floatingElem.style.transform = "translate(-10000px, -10000px)";
    return;
  }

  const floatingElemRect = floatingElem.getBoundingClientRect();
  const anchorElementRect = anchorElem.getBoundingClientRect();

  const top = targetRect.top - floatingElemRect.height - 10;
  const left =
    targetRect.left - floatingElemRect.width / 2 + targetRect.width / 2;

  floatingElem.style.opacity = "1";
  floatingElem.style.transform = `translate(${
    left - anchorElementRect.left
  }px, ${top - anchorElementRect.top}px)`;
}
