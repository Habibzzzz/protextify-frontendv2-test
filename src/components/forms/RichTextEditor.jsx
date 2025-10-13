import {
  useRef, // Pastikan useRef diimpor
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  $getSelection,
  $isRangeSelection,
  $getRoot,
  $insertNodes,
  PASTE_COMMAND, // 1. Tambahkan PASTE_COMMAND
} from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"; // 2. Tambahkan hook ini
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";

// Nodes
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { ImageNode } from "./plugins/ImageNode";

// Custom Plugins
import { AdvancedToolbarPlugin } from "./plugins/AdvancedToolbarPlugin";
import { FloatingTextFormatToolbarPlugin } from "./plugins/FloatingTextFormatToolbarPlugin";
import { ImagePlugin } from "./plugins/ImagePlugin";
import { DragDropPlugin } from "./plugins/DragDropPlugin";
import { WordCountPlugin } from "./plugins/WordCountPlugin";

import { Badge } from "../ui";
import { Save, AlertCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import "../../styles/lexical-editor.css";

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
  },
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    overflowed: "editor-text-overflowed",
    hashtag: "editor-text-hashtag",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
    code: "editor-text-code",
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable",
  },
  table: "editor-table",
  tableCell: "editor-tableCell",
  tableCellHeader: "editor-tableCellHeader",
  hr: "editor-hr",
};

// URL matcher for AutoLink
const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const EMAIL_MATCHER =
  /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

function validateUrl(url) {
  return (
    url === "https://" ||
    url === "mailto:" ||
    URL_MATCHER.test(url) ||
    EMAIL_MATCHER.test(url)
  );
}

// Helper function baru untuk mengatur ulang konten editor secara paksa
const setEditorContent = (editor, html) => {
  if (!editor) return;
  editor.update(() => {
    const root = $getRoot();
    root.clear();
    if (html && html.trim()) {
      try {
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        root.append(...nodes);
      } catch (error) {
        console.error("Gagal mem-parsing HTML untuk di-reset:", error);
        // Fallback jika HTML tidak valid
        const paragraph = root.createParagraph();
        paragraph.createText(html);
        root.append(paragraph);
      }
    }
  });
};

// 3. Buat plugin baru untuk mengontrol paste
function PasteControlPlugin({ disablePaste }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Menggunakan prioritas tinggi (1) untuk memastikan listener ini berjalan pertama
    return editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        if (disablePaste) {
          event.preventDefault();
          toast.error("Menyalin dan menempelkan konten tidak diizinkan.", {
            icon: "🚫",
          });
          return true; // Mengindikasikan event telah ditangani dan menghentikan propagasi
        }
        return false; // Membiarkan event paste berjalan jika tidak dinonaktifkan
      },
      1
    );
  }, [editor, disablePaste]);

  return null; // Plugin ini tidak me-render apapun
}

const RichTextEditor = forwardRef(
  (
    {
      value = "",
      onChange,
      onAutoSave,
      onEditorReady,
      placeholder = "Klik untuk memuat draft yang tersedia, atau mulai tulis jawaban Anda di sini...",
      maxWords = 1000,
      maxCharacters = 7000,
      disabled = false,
      autoSaveInterval = 3000,
      error,
      showToolbar = true,
      showFloatingToolbar = true,
      enableAutoLink = true,
      enableTables = false,
      enableImages = true,
      enableDragDrop = true,
      enableMarkdownShortcuts = true,
      disablePaste = false,
    },
    ref
  ) => {
    const [editor, setEditor] = useState(null);
    const [wordCount, setWordCount] = useState(0);
    const [characterCount, setCharacterCount] = useState(0);
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [initialContentProcessed, setInitialContentProcessed] =
      useState(false); // NEW: Track if initial content is processed

    const lastValidHtmlRef = useRef(value || ""); // 1. Tambahkan ref untuk state valid terakhir
    const autoSaveTimeoutRef = useRef(null);
    const initialContentRef = useRef(value);
    const preventOnChangeRef = useRef(false); // NEW: Prevent onChange during initialization

    // Update initial content ref when value changes
    useEffect(() => {
      initialContentRef.current = value;
      // Reset flags when new value comes in
      if (value !== initialContentRef.current) {
        setIsInitialized(false);
        setInitialContentProcessed(false);
      }
    }, [value]);

    // Initial config with all nodes
    const initialConfig = {
      namespace: "ProtextifyEditor",
      theme,
      onError(error) {
        console.error("Lexical Error:", error);
        toast.error("Editor error: " + error.message);
      },
      nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        CodeNode,
        CodeHighlightNode,
        AutoLinkNode,
        LinkNode,
        ...(enableTables ? [TableNode, TableCellNode, TableRowNode] : []),
        HorizontalRuleNode,
        ...(enableImages ? [ImageNode] : []),
      ],
      editorState: null,
    };

    // Expose editor methods to parent via ref
    useImperativeHandle(ref, () => ({
      getEditor: () => editor,
      insertText: (text) => {
        if (editor) {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertText(text);
            }
          });
        }
      },
      focus: () => {
        if (editor) {
          editor.focus();
        }
      },
      getContent: () => {
        if (!editor) return "";
        return editor
          .getEditorState()
          .read(() => $generateHtmlFromNodes(editor, null));
      },
      getWordCount: () => wordCount,
      getCharacterCount: () => characterCount,
      clear: () => {
        if (editor) {
          editor.update(() => {
            const root = $getRoot();
            root.clear();
          });
        }
      },
      insertHtml: (html) => {
        if (editor) {
          editor.update(() => {
            const parser = new DOMParser();
            const dom = parser.parseFromString(html, "text/html");
            const nodes = $generateNodesFromDOM(editor, dom);
            $insertNodes(nodes);
          });
        }
      },
    }));

    // Handle content change
    const handleEditorChange = (editorState, editorInstance) => {
      if (!editorInstance) return;

      setEditor(editorInstance);

      const html = editorState.read(() =>
        $generateHtmlFromNodes(editorInstance, null)
      );
      const plainText = editorState.read(
        () => editorInstance.getRootElement()?.textContent || ""
      );

      // Calculate word and character counts
      const words =
        plainText.trim() === ""
          ? 0
          : plainText
              .trim()
              .split(/\s+/)
              .filter((word) => word.length > 0).length;
      const characters = plainText.length;

      // 2. Ganti logika validasi untuk menggunakan ref
      if (words > maxWords || characters > maxCharacters) {
        toast.error(
          `Batas maksimal ${maxWords} kata atau ${maxCharacters} karakter telah tercapai.`
        );
        // Reset ke konten valid terakhir yang disimpan di ref
        setEditorContent(editorInstance, lastValidHtmlRef.current);
        return; // Hentikan eksekusi lebih lanjut
      }

      // 3. Jika valid, perbarui ref dengan konten saat ini
      lastValidHtmlRef.current = html;

      setWordCount(words);
      setCharacterCount(characters);

      // CRITICAL: Only call onChange if we're not preventing it during initialization
      if (!preventOnChangeRef.current && initialContentProcessed) {
        if (onChange) {
          onChange(html);
        }

        // Mark as unsaved for auto-save
        setHasUnsavedChanges(true);

        // Auto-save logic
        if (onAutoSave && !disabled) {
          if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
          }
          autoSaveTimeoutRef.current = setTimeout(() => {
            setIsAutoSaving(true);
            Promise.resolve(onAutoSave(html))
              .then(() => {
                setLastSaved(new Date());
                setHasUnsavedChanges(false);
              })
              .catch(() => {
                toast.error(
                  "Auto-save gagal. Pastikan koneksi internet stabil."
                );
              })
              .finally(() => {
                setIsAutoSaving(false);
              });
          }, autoSaveInterval);
        }
      }

      // Limit checks (always run)
      if (words > maxWords) {
        toast.error(`Melebihi batas maksimal ${maxWords} kata`);
      }
      if (characters > maxCharacters) {
        toast.error(`Melebihi batas maksimal ${maxCharacters} karakter`);
      }
    };

    // Set initial content when editor is ready
    useEffect(() => {
      // PERBAIKAN: Ubah kondisi `value` menjadi `value !== undefined`
      // Ini memastikan inisialisasi berjalan bahkan jika konten awal adalah string kosong.
      if (editor && value !== undefined && !isInitialized) {
        // Prevent onChange during initialization
        preventOnChangeRef.current = true;

        // Gunakan helper function untuk mengatur konten
        setEditorContent(editor, value);
        lastValidHtmlRef.current = value; // 4. Inisialisasi ref dengan konten awal

        setIsInitialized(true);

        // Allow onChange after a delay to ensure content is fully set
        setTimeout(() => {
          preventOnChangeRef.current = false;
          setInitialContentProcessed(true);

          // Call onEditorReady callback
          if (onEditorReady) {
            onEditorReady();
          }
        }, 200); // Increased delay to ensure stability
      }
    }, [editor, value, isInitialized, onEditorReady]);

    // Cleanup
    useEffect(() => {
      return () => {
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }
      };
    }, []);

    // Helper functions untuk warna
    const getWordCountColor = () => {
      const percentage = (wordCount / maxWords) * 100;
      if (percentage >= 100) return "text-red-600";
      if (percentage >= 90) return "text-orange-600";
      if (percentage >= 75) return "text-yellow-600";
      return "text-gray-600";
    };

    const getCharacterCountColor = () => {
      const percentage = (characterCount / maxCharacters) * 100;
      if (percentage >= 100) return "text-red-600";
      if (percentage >= 90) return "text-orange-600";
      if (percentage >= 75) return "text-yellow-600";
      return "text-gray-600";
    };

    return (
      <div className="w-full">
        {/* Editor Header */}
        <div className="flex items-center justify-between mb-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border border-gray-200">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${getWordCountColor()}`}>
                {wordCount.toLocaleString()} / {maxWords.toLocaleString()} kata
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${getCharacterCountColor()}`}>
                {characterCount.toLocaleString()} /{" "}
                {maxCharacters.toLocaleString()} karakter
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isAutoSaving && (
              <Badge variant="info" size="sm">
                <Save className="h-3 w-3 mr-1 animate-pulse" />
                Menyimpan...
              </Badge>
            )}
            {hasUnsavedChanges && !isAutoSaving && (
              <Badge variant="warning" size="sm">
                <AlertCircle className="h-3 w-3 mr-1" />
                Belum tersimpan
              </Badge>
            )}
            {lastSaved && !hasUnsavedChanges && !isAutoSaving && (
              <Badge variant="success" size="sm">
                <CheckCircle className="h-3 w-3 mr-1" />
                Tersimpan {lastSaved.toLocaleTimeString("id-ID")}
              </Badge>
            )}
          </div>
        </div>

        {/* Editor Container */}
        <div
          className={`border rounded-lg overflow-hidden ${
            error ? "border-red-300" : "border-gray-200"
          }`}
        >
          <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-container">
              {showToolbar && <AdvancedToolbarPlugin disabled={disabled} />}

              <div className="editor-inner">
                <RichTextPlugin
                  contentEditable={
                    <ContentEditable
                      className="editor-input"
                      aria-placeholder={placeholder}
                      placeholder={
                        <div className="editor-placeholder">{placeholder}</div>
                      }
                      // 5. Hapus prop onPaste dari sini
                    />
                  }
                  placeholder={null}
                  ErrorBoundary={LexicalErrorBoundary}
                />

                <OnChangePlugin onChange={handleEditorChange} />
                <HistoryPlugin />
                <ListPlugin />
                <TabIndentationPlugin />
                <AutoFocusPlugin />
                <ClearEditorPlugin />
                <WordCountPlugin />

                {enableAutoLink && (
                  <>
                    <AutoLinkPlugin
                      matchers={[
                        (text) => {
                          const match = URL_MATCHER.exec(text);
                          if (match === null) {
                            return null;
                          }
                          const fullMatch = match[0];
                          return {
                            index: match.index,
                            length: fullMatch.length,
                            text: fullMatch,
                            url: fullMatch.startsWith("http")
                              ? fullMatch
                              : `https://${fullMatch}`,
                          };
                        },
                        (text) => {
                          const match = EMAIL_MATCHER.exec(text);
                          if (match === null) {
                            return null;
                          }
                          const fullMatch = match[0];
                          return {
                            index: match.index,
                            length: fullMatch.length,
                            text: fullMatch,
                            url: `mailto:${fullMatch}`,
                          };
                        },
                      ]}
                    />
                    <LinkPlugin validateUrl={validateUrl} />
                  </>
                )}

                {enableTables && <TablePlugin />}
                {enableImages && <ImagePlugin />}
                {enableDragDrop && <DragDropPlugin />}

                {enableMarkdownShortcuts && (
                  <MarkdownShortcutPlugin transformers={[]} />
                )}

                {/* 6. Tambahkan plugin baru di sini */}
                <PasteControlPlugin disablePaste={disablePaste} />

                {showFloatingToolbar && <FloatingTextFormatToolbarPlugin />}
              </div>
            </div>
          </LexicalComposer>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Limit Warning */}
        {(wordCount >= maxWords * 0.9 ||
          characterCount >= maxCharacters * 0.9) && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-700">
                {wordCount >= maxWords
                  ? "Batas maksimal kata telah tercapai"
                  : characterCount >= maxCharacters
                  ? "Batas maksimal karakter telah tercapai"
                  : "Mendekati batas maksimal"}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
