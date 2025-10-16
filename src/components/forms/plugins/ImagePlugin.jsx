import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
} from "lexical";
import { $createImageNode, ImageNode } from "./ImageNode";
import { useEffect } from "react";
import { INSERT_IMAGE_COMMAND } from "./imageCommands";

/**
 * Komponen ImagePlugin
 *
 * Komponen ini bertugas untuk mendaftarkan command INSERT_IMAGE_COMMAND pada editor Lexical.
 * Command ini memungkinkan penambahan node gambar (ImageNode) ke dalam editor.
 * Jika node gambar ditambahkan langsung ke root, maka node tersebut akan dibungkus dengan paragraph node.
 *
 * Komponen ini tidak merender apapun ke UI (return null).
 */
export function ImagePlugin() {
  // Mendapatkan instance editor dari context LexicalComposer
  const [editor] = useLexicalComposerContext();

  /**
   * Efek samping untuk mendaftarkan command INSERT_IMAGE_COMMAND ke editor.
   *
   * - Mengecek apakah ImageNode sudah terdaftar pada editor.
   * - Mendaftarkan command untuk menangani penambahan node gambar.
   * - Jika node gambar berada di root, maka node tersebut dibungkus dengan paragraph node.
   */
  useEffect(() => {
    // Validasi: Pastikan ImageNode sudah terdaftar pada editor
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagePlugin: ImageNode not registered on editor");
    }

    // Registrasi command INSERT_IMAGE_COMMAND ke editor
    return mergeRegister(
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          // Membuat node gambar baru dari payload
          const imageNode = $createImageNode(payload);

          // Menambahkan node gambar ke editor
          $insertNodes([imageNode]);

          // Jika parent node adalah root, bungkus node gambar dengan paragraph node
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          // Mengembalikan true untuk menandakan command telah dijalankan
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  // Komponen ini tidak merender apapun ke UI
  return null;
}
