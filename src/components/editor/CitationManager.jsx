import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Book,
  FileText,
  Link as LinkIcon,
  Search,
  Loader2,
} from "lucide-react";
import { Button, Modal, Input, Select, Card, CardContent } from "../ui";
import toast from "react-hot-toast";

/**
 * Helper untuk memformat nama penulis dari Crossref API.
 * Format: NamaBelakang, InisialDepan. Tambahkan "et al." jika lebih dari satu penulis.
 * @param {Array} authors - Array objek penulis dari Crossref API.
 * @returns {string} Nama penulis yang sudah diformat.
 */
const formatAuthors = (authors) => {
  if (!authors || authors.length === 0) return "";
  const firstAuthor = authors[0];
  let formattedName = `${firstAuthor.family}, ${
    firstAuthor.given ? `${firstAuthor.given.charAt(0)}.` : ""
  }`;
  if (authors.length > 1) {
    formattedName += " et al.";
  }
  return formattedName;
};

/**
 * Komponen utama untuk mengelola daftar sitasi (Daftar Pustaka).
 * Mendukung penambahan, pengeditan, penghapusan, dan penyisipan sitasi.
 * Terdapat fitur fetch otomatis dari Crossref API menggunakan DOI.
 */
const CitationManager = ({
  citations = [],
  onAdd,
  onEdit,
  onRemove,
  onInsert,
  disabled = false,
}) => {
  // State untuk modal tambah/edit sitasi
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State untuk index sitasi yang sedang diedit
  const [editingIndex, setEditingIndex] = useState(null);

  // State untuk data form sitasi
  const [formData, setFormData] = useState({
    type: "book",
    title: "",
    author: "",
    year: "",
    url: "",
    publisher: "",
    pages: "",
    doi: "",
    journalName: "",
    volume: "",
    issue: "",
    siteName: "",
  });

  // State untuk DOI dan status fetching dari Crossref API
  const [doi, setDoi] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  // Konfigurasi jenis sitasi beserta ikon dan label
  const citationTypes = [
    { value: "book", label: "Buku", icon: Book },
    { value: "journal", label: "Artikel Jurnal", icon: FileText },
    { value: "website", label: "Halaman Website", icon: LinkIcon },
    { value: "article", label: "Artikel Umum", icon: FileText },
  ];

  /**
   * Reset form data dan index editing ke nilai awal.
   * Juga mereset DOI.
   */
  const resetForm = () => {
    setFormData({
      type: "book",
      title: "",
      author: "",
      year: "",
      url: "",
      publisher: "",
      pages: "",
      doi: "",
      journalName: "",
      volume: "",
      issue: "",
      siteName: "",
    });
    setEditingIndex(null);
    setDoi("");
  };

  /**
   * Handler untuk membuka modal tambah sitasi.
   */
  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  /**
   * Handler untuk membuka modal edit sitasi.
   * @param {number} index - Index sitasi yang akan diedit.
   */
  const handleEdit = (index) => {
    const currentData = citations[index];
    setFormData({
      ...{
        journalName: "",
        volume: "",
        issue: "",
        siteName: "",
      },
      ...currentData,
    });
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  /**
   * Handler untuk submit form sitasi (tambah atau edit).
   * Validasi field wajib sesuai jenis sitasi.
   */
  const handleSubmit = () => {
    if (!formData.title || !formData.author || !formData.year) return;
    if (formData.type === "website" && !formData.url) return;
    if (formData.type === "journal" && !formData.journalName) return;

    if (editingIndex !== null) {
      onEdit(editingIndex, formData);
    } else {
      onAdd(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  /**
   * Memformat sitasi lengkap sebagai teks biasa untuk disisipkan ke editor.
   * @param {Object} citation - Data sitasi.
   * @returns {string} Sitasi dalam format teks.
   */
  const formatFullCitationAsText = (citation) => {
    const {
      type,
      author,
      year,
      title,
      publisher,
      url,
      pages,
      doi,
      journalName,
      volume,
      issue,
      siteName,
    } = citation;

    switch (type) {
      case "book":
        return `${author} (${year}). ${title}. ${publisher}.`;
      case "journal": {
        let journalString = `${author} (${year}). ${title}. ${journalName}, ${volume}`;
        if (issue) journalString += `(${issue})`;
        if (pages) journalString += `, ${pages}`;
        journalString += ".";
        if (doi) journalString += ` https://doi.org/${doi}`;
        return journalString;
      }
      case "website":
        return `${author} (${year}). ${title}. ${siteName}. ${url}`;
      case "article":
      default:
        return `${author} (${year}). ${title}.`;
    }
  };

  /**
   * Handler untuk mengambil data sitasi dari Crossref API berdasarkan DOI.
   * Data hasil fetch akan langsung diisi ke form.
   */
  const handleFetchCitation = async () => {
    if (!doi.trim()) {
      toast.error("Silakan masukkan DOI yang valid.");
      return;
    }
    setIsFetching(true);
    try {
      const response = await fetch(
        `https://api.crossref.org/works/${doi.trim()}`
      );
      if (!response.ok) {
        throw new Error("Sitasi tidak ditemukan atau DOI tidak valid.");
      }
      const data = await response.json();
      const item = data.message;

      // Mapping data dari Crossref ke formData
      const mappedData = {
        type: "journal",
        title: item.title?.[0] || "",
        author: formatAuthors(item.author),
        year: item.created?.["date-parts"]?.[0]?.[0]?.toString() || "",
        journalName: item["container-title"]?.[0] || "",
        volume: item.volume || "",
        issue: item.issue || "",
        pages: item.page || "",
        publisher: item.publisher || "",
        doi: item.DOI || doi.trim(),
        url: item.URL || `https://doi.org/${item.DOI}`,
      };

      setFormData((prev) => ({ ...prev, ...mappedData }));
      toast.success("Data sitasi berhasil diambil!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  /**
   * Memformat sitasi untuk ditampilkan di daftar pustaka.
   * @param {Object} citation - Data sitasi.
   * @returns {JSX.Element} Format sitasi sesuai jenis.
   */
  const formatCitation = (citation) => {
    const {
      type,
      author,
      year,
      title,
      publisher,
      url,
      pages,
      doi,
      journalName,
      volume,
      issue,
      siteName,
    } = citation;

    switch (type) {
      case "book":
        return (
          <>
            {author} ({year}). <em>{title}</em>. {publisher}.
          </>
        );
      case "journal":
        return (
          <>
            {author} ({year}). {title}.{" "}
            <em>
              {journalName}, {volume}
            </em>
            {issue && `(${issue})`}
            {pages && `, ${pages}`}.
            {doi && (
              <>
                {" "}
                <a
                  href={`https://doi.org/${doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://doi.org/{doi}
                </a>
              </>
            )}
          </>
        );
      case "website":
        return (
          <>
            {author} ({year}). <em>{title}</em>. {siteName}. {url}
          </>
        );
      case "article":
      default:
        return (
          <>
            {author} ({year}). {title}.
          </>
        );
    }
  };

  /**
   * Mendapatkan ikon sesuai jenis sitasi.
   * @param {string} type - Jenis sitasi.
   * @returns {JSX.Element} Ikon.
   */
  const getTypeIcon = (type) => {
    const typeConfig = citationTypes.find((t) => t.value === type);
    const Icon = typeConfig?.icon || Book;
    return <Icon className="h-4 w-4" />;
  };

  // ==========================
  // Render UI utama komponen
  // ==========================
  return (
    <div className="space-y-4">
      {/* Header dan tombol tambah sitasi */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Daftar Pustaka</h3>
        <Button onClick={handleAdd} size="sm" disabled={disabled}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Sitasi
        </Button>
      </div>

      {/* Daftar sitasi yang sudah ditambahkan */}
      {citations.length > 0 ? (
        <div className="space-y-3">
          {citations.map((citation, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getTypeIcon(citation.type)}
                      <span className="text-sm font-medium text-gray-600">
                        {
                          citationTypes.find((t) => t.value === citation.type)
                            ?.label
                        }
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 pl-6 -indent-6">
                      {formatCitation(citation)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        onInsert(formatFullCitationAsText(citation))
                      }
                      disabled={disabled}
                    >
                      Insert
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(index)}
                      disabled={disabled}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(index)}
                      disabled={disabled}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Belum ada sitasi yang ditambahkan</p>
          </CardContent>
        </Card>
      )}

      {/* Modal tambah/edit sitasi */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIndex !== null ? "Edit Sitasi" : "Tambah Sitasi"}
      >
        <div className="space-y-4">
          {/* Fitur fetch otomatis dari Crossref API menggunakan DOI */}
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="citation-doi-search-input"
            >
              Cari Otomatis dengan DOI
            </label>
            <div className="flex gap-2">
              <Input
                id="citation-doi-search-input"
                placeholder="10.1000/xyz123"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                disabled={disabled || isFetching}
              />
              <Button
                onClick={handleFetchCitation}
                disabled={disabled || isFetching}
              >
                {isFetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Separator antara fetch otomatis dan input manual */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Atau isi manual
              </span>
            </div>
          </div>

          {/* Form input manual sitasi */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="citation-type-select"
            >
              Jenis Sitasi
            </label>
            <Select
              id="citation-type-select"
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value })}
              options={citationTypes}
              disabled={disabled}
            />
          </div>

          <div>
            <Input
              label="Judul *"
              id="citation-title-input"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Masukkan judul..."
              disabled={disabled}
            />
          </div>

          <div>
            <Input
              label="Penulis *"
              id="citation-author-input"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              placeholder="Contoh: Rowling, J. K."
              disabled={disabled}
            />
          </div>

          <div>
            <Input
              label="Tahun *"
              id="citation-year-input"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              placeholder="2024"
              disabled={disabled}
            />
          </div>

          {/* Input khusus untuk jenis website */}
          {formData.type === "website" && (
            <>
              <div>
                <Input
                  label="Nama Situs *"
                  id="citation-sitename-input"
                  value={formData.siteName}
                  onChange={(e) =>
                    setFormData({ ...formData, siteName: e.target.value })
                  }
                  placeholder="Contoh: BBC News, Wikipedia"
                  disabled={disabled}
                />
              </div>
              <div>
                <Input
                  label="URL *"
                  id="citation-url-input"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://..."
                  disabled={disabled}
                />
              </div>
            </>
          )}

          {/* Input khusus untuk jenis buku */}
          {formData.type === "book" && (
            <div>
              <Input
                label="Penerbit"
                id="citation-publisher-input"
                value={formData.publisher}
                onChange={(e) =>
                  setFormData({ ...formData, publisher: e.target.value })
                }
                placeholder="Nama penerbit..."
                disabled={disabled}
              />
            </div>
          )}

          {/* Input khusus untuk jenis jurnal */}
          {formData.type === "journal" && (
            <>
              <div>
                <Input
                  label="Nama Jurnal *"
                  id="citation-journalname-input"
                  value={formData.journalName}
                  onChange={(e) =>
                    setFormData({ ...formData, journalName: e.target.value })
                  }
                  placeholder="Contoh: Nature, Science"
                  disabled={disabled}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Volume"
                  id="citation-volume-input"
                  value={formData.volume}
                  onChange={(e) =>
                    setFormData({ ...formData, volume: e.target.value })
                  }
                  placeholder="42"
                  disabled={disabled}
                />
                <Input
                  label="Issue"
                  id="citation-issue-input"
                  value={formData.issue}
                  onChange={(e) =>
                    setFormData({ ...formData, issue: e.target.value })
                  }
                  placeholder="3"
                  disabled={disabled}
                />
              </div>
              <div>
                <Input
                  label="Halaman"
                  id="citation-pages-input"
                  value={formData.pages}
                  onChange={(e) =>
                    setFormData({ ...formData, pages: e.target.value })
                  }
                  placeholder="1-10"
                  disabled={disabled}
                />
              </div>
              <div>
                <Input
                  label="DOI"
                  id="citation-doi-input"
                  value={formData.doi}
                  onChange={(e) =>
                    setFormData({ ...formData, doi: e.target.value })
                  }
                  placeholder="10.1000/xyz123"
                  disabled={disabled}
                />
              </div>
            </>
          )}

          {/* Tombol aksi modal */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={disabled}>
              {editingIndex !== null ? "Update" : "Tambah"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CitationManager;
