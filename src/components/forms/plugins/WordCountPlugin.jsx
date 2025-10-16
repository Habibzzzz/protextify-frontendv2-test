import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import { $getRoot } from "lexical";
import { useEffect } from "react";

/**
 * Plugin WordCountPlugin
 *
 * Plugin ini digunakan untuk mendaftarkan listener pada editor Lexical
 * yang akan dipanggil setiap kali terjadi update pada editorState.
 *
 * Catatan:
 * - Logika penghitungan jumlah kata sebenarnya ditangani di komponen utama.
 * - Plugin ini dapat diperluas untuk analisis teks yang lebih lanjut.
 */
export function WordCountPlugin() {
  // Mengambil instance editor dari context Lexical
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Mendaftarkan listener untuk update pada editorState
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        // const root = $getRoot();
        // const textContent = root.getTextContent();
        // Logika penghitungan jumlah kata ditangani di komponen utama
        // Plugin ini dapat diperluas untuk analitik teks yang lebih kompleks
      });
    });
  }, [editor]);

  // Plugin ini tidak merender apapun ke UI
  return null;
}
