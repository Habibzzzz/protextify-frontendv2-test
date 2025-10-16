import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

/**
 * LABEL_MAP digunakan untuk memetakan segment path URL ke label yang lebih ramah pengguna.
 */
const LABEL_MAP = {
  instructor: "Instructor",
  dashboard: "Dashboard",
  classes: "Kelas",
  "create-class": "Buat Kelas",
  settings: "Pengaturan",
  assignments: "Tugas",
  "create-assignment": "Buat Tugas",
  "write-assignment": "Tulis Tugas",
  submissions: "Submission",
  transactions: "Transaksi",
  profile: "Profil",
  help: "Bantuan",
  pricing: "Harga",
  about: "Tentang",
  docs: "Dokumentasi",
  privacy: "Kebijakan Privasi",
  terms: "Syarat & Ketentuan",
};

/**
 * Komponen Breadcrumb
 * Menampilkan navigasi breadcrumb berdasarkan path URL saat ini atau customItems yang diberikan.
 *
 * Props:
 * - customItems: Array custom breadcrumb, jika ingin menampilkan breadcrumb khusus.
 * - showHome: Boolean, jika true maka breadcrumb akan menampilkan ikon dan label Home di awal.
 */
export default function Breadcrumb({ customItems = null, showHome = true }) {
  const location = useLocation();

  /**
   * generateBreadcrumbs
   * Membuat array breadcrumb berdasarkan path URL saat ini atau customItems.
   *
   * @returns {Array} Array objek breadcrumb { label, path }
   */
  const generateBreadcrumbs = () => {
    // Jika customItems diberikan, gunakan customItems sebagai breadcrumb
    if (customItems) return customItems;

    // Pisahkan path menjadi segment dan filter yang kosong
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    // Tambahkan breadcrumb Home jika showHome true
    if (showHome) {
      breadcrumbs.push({ label: "Home", path: "/" });
    }

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Mapping label sesuai LABEL_MAP, jika tidak ada gunakan segment dengan format yang lebih baik
      let label = LABEL_MAP[segment] || segment.replace(/-/g, " ");
      label = label.charAt(0).toUpperCase() + label.slice(1);

      breadcrumbs.push({
        label,
        path: index === pathSegments.length - 1 ? null : currentPath,
      });
    });

    return breadcrumbs;
  };

  // Array breadcrumb yang akan ditampilkan
  const breadcrumbs = generateBreadcrumbs();

  // Tidak menampilkan breadcrumb jika berada di halaman home atau hanya ada satu breadcrumb
  if (location.pathname === "/" || breadcrumbs.length <= 1) {
    return null;
  }

  /**
   * Render navigasi breadcrumb
   */
  return (
    <nav className="flex items-center space-x-1 text-sm mb-6">
      <div className="flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {/* Tampilkan ikon ChevronRight di antara breadcrumb */}
            {index > 0 && (
              <ChevronRight className="h-3 w-3 text-gray-400 mx-2" />
            )}

            {/* Jika path ada, tampilkan sebagai Link, jika tidak tampilkan sebagai span aktif */}
            {crumb.path ? (
              <Link
                to={crumb.path}
                className="hover:text-[#23407a] transition-colors flex items-center text-gray-600 hover:bg-[#23407a]/10 px-2 py-1 rounded-md"
              >
                {/* Tampilkan ikon Home pada breadcrumb pertama jika showHome true */}
                {index === 0 && showHome && <Home className="h-3 w-3 mr-1" />}
                <span className="font-medium">{crumb.label}</span>
              </Link>
            ) : (
              <span className="text-[#23407a] font-semibold flex items-center px-2 py-1 bg-[#23407a]/10 rounded-md">
                {/* Tampilkan ikon Home pada breadcrumb pertama jika showHome true */}
                {index === 0 && showHome && <Home className="h-3 w-3 mr-1" />}
                {crumb.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
