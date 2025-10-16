// ============================================================================
// Komponen Editor - Ekspor modul-modul utama untuk fitur editor
// ============================================================================

// Ekspor CitationManager
// Modul ini bertanggung jawab untuk mengelola sitasi dalam editor.
export { default as CitationManager } from "./CitationManager";

// Ekspor CopyPasteMonitor
// Modul ini digunakan untuk memantau aktivitas copy-paste di dalam editor.
export { default as CopyPasteMonitor } from "./CopyPasteMonitor";

// Ekspor DraftActions
// Modul ini menyediakan aksi-aksi yang dapat dilakukan pada draft dokumen.
export { default as DraftActions } from "./DraftActions";

// Ekspor TextStatistics
// Modul ini digunakan untuk menampilkan statistik teks pada editor.
export { default as TextStatistics } from "./TextStatistics";

// Tidak perlu ekspor editor.css karena hanya untuk styling
// ============================================================================
