// src/components/dashboard/index.js

/**
 * Dashboard Components Export
 *
 * File ini berfungsi sebagai entry point untuk meng-export seluruh komponen utama
 * yang digunakan pada dashboard aplikasi. Setiap komponen di-export secara named export
 * agar mudah di-import pada file lain.
 */

/**
 * StatCard
 * Komponen untuk menampilkan statistik dalam bentuk kartu.
 */
export { default as StatCard } from "./StatCard";

/**
 * QuickActions
 * Komponen untuk menampilkan aksi cepat yang dapat dilakukan pengguna.
 */
export { default as QuickActions } from "./QuickActions";

/**
 * RecentClasses
 * Komponen untuk menampilkan daftar kelas terbaru.
 */
export { default as RecentClasses } from "./RecentClasses";

/**
 * ActivityTimeline
 * Komponen untuk menampilkan urutan aktivitas terbaru pengguna.
 */
export { default as ActivityTimeline } from "./ActivityTimeline";
