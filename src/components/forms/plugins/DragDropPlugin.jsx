import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { INSERT_IMAGE_COMMAND } from "./imageCommands";

// Daftar tipe file gambar yang dapat diterima untuk drag & drop
const ACCEPTABLE_IMAGE_TYPES = [
  "image/",
  "image/heic",
  "image/heif",
  "image/gif",
  "image/webp",
];

/**
 * Komponen DragDropPlugin
 *
 * Plugin ini memungkinkan pengguna untuk melakukan drag & drop file gambar ke dalam editor.
 * File gambar yang didukung akan dibaca dan dimasukkan ke editor menggunakan perintah INSERT_IMAGE_COMMAND.
 */
export function DragDropPlugin() {
  // Mendapatkan instance editor dari konteks Lexical
  const [editor] = useLexicalComposerContext();

  /**
   * Efek samping untuk menambahkan event listener drag & drop pada root element editor.
   * Event listener akan dihapus saat komponen unmount.
   */
  useEffect(() => {
    /**
     * Handler untuk event dragstart.
     * Mencegah perilaku default agar file tidak bisa di-drag keluar dari editor.
     * @param {DragEvent} event
     */
    const handleDragStart = (event) => {
      event.preventDefault();
    };

    /**
     * Handler untuk event dragover.
     * Mencegah perilaku default agar file bisa di-drop ke editor.
     * @param {DragEvent} event
     */
    const handleDragOver = (event) => {
      event.preventDefault();
    };

    /**
     * Handler untuk event drop.
     * Memproses file yang di-drop, memeriksa tipe file, dan memasukkan gambar ke editor.
     * @param {DragEvent} event
     */
    const handleDrop = (event) => {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files);

      files.forEach((file) => {
        // Memeriksa apakah tipe file sesuai dengan daftar yang diterima
        if (ACCEPTABLE_IMAGE_TYPES.some((type) => file.type.startsWith(type))) {
          const reader = new FileReader();
          reader.onload = () => {
            // Memasukkan gambar ke editor dengan src hasil pembacaan file dan altText nama file
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
              src: reader.result,
              altText: file.name,
            });
          };
          reader.readAsDataURL(file);
        }
      });
    };

    // Mendapatkan root element dari editor untuk menambahkan event listener
    const rootElement = editor.getRootElement();
    if (rootElement) {
      rootElement.addEventListener("dragstart", handleDragStart);
      rootElement.addEventListener("dragover", handleDragOver);
      rootElement.addEventListener("drop", handleDrop);

      // Membersihkan event listener saat komponen di-unmount
      return () => {
        rootElement.removeEventListener("dragstart", handleDragStart);
        rootElement.removeEventListener("dragover", handleDragOver);
        rootElement.removeEventListener("drop", handleDrop);
      };
    }
  }, [editor]);

  // Komponen ini tidak merender apapun
  return null;
}
