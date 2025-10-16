// Import fungsi createCommand dari library lexical
import { createCommand } from "lexical";

/**
 * Perintah untuk menyisipkan gambar ke dalam editor Lexical.
 * Digunakan untuk men-trigger aksi penambahan gambar pada editor.
 */
export const INSERT_IMAGE_COMMAND = createCommand("INSERT_IMAGE_COMMAND");
