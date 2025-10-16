import { $applyNodeReplacement, DecoratorNode } from "lexical";

/**
 * Kelas ImageNode digunakan untuk merepresentasikan node gambar dalam editor Lexical.
 * Menyimpan informasi terkait gambar seperti src, altText, width, dan height.
 */
export class ImageNode extends DecoratorNode {
  __src;
  __altText;
  __width;
  __height;

  /**
   * Mengembalikan tipe node ini.
   * @returns {string}
   */
  static getType() {
    return "image";
  }

  /**
   * Membuat salinan dari node gambar.
   * @param {ImageNode} node - Node gambar yang akan diklon.
   * @returns {ImageNode}
   */
  static clone(node) {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__key
    );
  }

  /**
   * Mengimpor node gambar dari data JSON yang telah diserialisasi.
   * @param {Object} serializedNode - Data node yang telah diserialisasi.
   * @returns {ImageNode}
   */
  static importJSON(serializedNode) {
    return new ImageNode(
      serializedNode.src,
      serializedNode.altText,
      serializedNode.width,
      serializedNode.height
    );
  }

  /**
   * Mengekspor node gambar ke format JSON.
   * @returns {Object}
   */
  exportJSON() {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
    };
  }

  /**
   * Konstruktor untuk membuat instance ImageNode.
   * @param {string} src - URL sumber gambar.
   * @param {string} altText - Teks alternatif gambar.
   * @param {string} width - Lebar gambar.
   * @param {string} height - Tinggi gambar.
   * @param {string} key - Kunci unik node.
   */
  constructor(
    src = "",
    altText = "",
    width = "inherit",
    height = "inherit",
    key
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
  }

  /**
   * Membuat elemen DOM untuk node gambar.
   * @param {Object} config - Konfigurasi tema Lexical.
   * @returns {HTMLElement}
   */
  createDOM(config) {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  /**
   * Menentukan apakah DOM perlu diperbarui.
   * @returns {boolean}
   */
  updateDOM() {
    return false;
  }

  /**
   * Mengambil URL sumber gambar.
   * @returns {string}
   */
  getSrc() {
    return this.__src;
  }

  /**
   * Mengambil teks alternatif gambar.
   * @returns {string}
   */
  getAltText() {
    return this.__altText;
  }

  /**
   * Mendekorasi node gambar dengan elemen React <img>.
   * @returns {JSX.Element}
   */
  decorate() {
    return (
      <img
        src={this.__src}
        alt={this.__altText}
        style={{
          width: this.__width,
          height: this.__height,
          maxWidth: "100%",
        }}
      />
    );
  }
}

/**
 * Membuat node gambar baru dengan data yang diberikan.
 * @param {Object} param0 - Objek berisi altText, height, src, dan width.
 * @returns {ImageNode}
 */
export function $createImageNode({ altText, height, src, width }) {
  return $applyNodeReplacement(new ImageNode(src, altText, width, height));
}

/**
 * Mengecek apakah node merupakan instance dari ImageNode.
 * @param {DecoratorNode} node - Node yang akan dicek.
 * @returns {boolean}
 */
export function $isImageNode(node) {
  return node instanceof ImageNode;
}
