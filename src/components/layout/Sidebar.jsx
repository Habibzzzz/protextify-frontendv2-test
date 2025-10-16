import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  FileText,
  Users,
  Settings,
  PlusCircle,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { USER_ROLES } from "../../utils/constants";
import {
  generateWhatsAppUrl,
  isWithinOperatingHours,
  WHATSAPP_CONFIG,
} from "../../utils/whatsappConfig";
import logoPutih from "@/assets/logo-protextify-putih.png";

/**
 * Komponen Sidebar untuk navigasi utama aplikasi.
 * Menampilkan menu sesuai dengan peran user (Instructor/Student),
 * serta tombol WhatsApp untuk bantuan.
 */
export default function Sidebar() {
  // State untuk mengatur apakah sidebar dalam keadaan collapsed.
  // Saat ini sidebar selalu tidak collapsed.
  const [isCollapsed] = useState(false);

  // Mendapatkan data user dari hook autentikasi.
  const { user } = useAuth();

  // Mendapatkan lokasi route saat ini.
  const location = useLocation();

  /**
   * Fungsi untuk menangani klik tombol WhatsApp.
   * Membuka link WhatsApp dengan pesan yang sesuai jam operasional.
   */
  const handleWhatsAppClick = () => {
    const message = isWithinOperatingHours()
      ? WHATSAPP_CONFIG.defaultMessage
      : WHATSAPP_CONFIG.afterHoursMessage;
    const whatsappUrl = generateWhatsAppUrl(message);
    window.open(whatsappUrl, "_blank");
  };

  /**
   * Fungsi untuk mendapatkan daftar menu sesuai peran user.
   * @returns {Array} Daftar menu yang akan ditampilkan di sidebar.
   */
  const getMenuItems = () => {
    if (user?.role === USER_ROLES.INSTRUCTOR) {
      return [
        {
          label: "Dashboard",
          icon: Home,
          path: "/instructor/dashboard",
        },
        {
          label: "Kelola Kelas",
          icon: BookOpen,
          path: "/instructor/classes",
        },
        {
          label: "Buat Kelas",
          icon: PlusCircle,
          path: "/instructor/create-class",
        },
        {
          label: "Transaksi",
          icon: CreditCard,
          path: "/instructor/transactions",
        },
        {
          label: "Analytics",
          icon: TrendingUp,
          path: "/instructor/analytics",
          disabled: false,
        },
      ];
    } else {
      // Jika user adalah Student
      return [
        {
          label: "Dashboard",
          icon: Home,
          path: "/dashboard/overview",
        },
        {
          label: "Kelas Saya",
          icon: BookOpen,
          path: "/dashboard/classes",
        },
        {
          label: "Gabung Kelas",
          icon: PlusCircle,
          path: "/dashboard/join-class",
        },
        {
          label: "Tugas Saya",
          icon: FileText,
          path: "/dashboard/assignments",
        },
        {
          label: "Riwayat",
          icon: Clock,
          path: "/dashboard/submissions",
        },
        // {
        //   label: "Pengaturan",
        //   icon: Settings,
        //   path: "/dashboard/settings",
        //   disabled: true, // Tidak ada endpoint di BE
        // },
      ];
    }
  };

  // Mendapatkan daftar menu berdasarkan peran user.
  const menuItems = getMenuItems();

  /**
   * Fungsi untuk menentukan apakah route saat ini aktif.
   * @param {string} path - Path menu yang dicek.
   * @returns {boolean} True jika route aktif.
   */
  const isActiveRoute = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Bagian Header Sidebar */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#162849] border-b border-[#23407a]/20">
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full transform translate-x-8 -translate-y-8"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full transform -translate-x-6 translate-y-6"></div>
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center group">
                <div className="relative">
                  <img
                    src={logoPutih}
                    alt="Protextify"
                    className="h-12 w-auto transition-transform group-hover:scale-105"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bagian Informasi User */}
      {!isCollapsed && (
        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50/50 border-b border-gray-200/50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#23407a] to-[#3b5fa4] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {user?.fullName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user?.fullName}
              </p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-[#23407a] rounded-full mr-2"></div>
                <p className="text-xs text-gray-600 capitalize font-medium">
                  {user?.role?.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {user?.role === USER_ROLES.INSTRUCTOR
                ? "Dashboard Instructor"
                : "Dashboard Student"}
            </div>
          </div>
        </div>
      )}

      {/* Bagian Navigasi Menu */}
      <nav className="flex-1 p-4 bg-white">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);
            const isDisabled = item.disabled;

            return (
              <li key={index}>
                {isDisabled ? (
                  // Menu yang dinonaktifkan (disabled)
                  <div
                    className={`relative group flex items-center px-4 py-3.5 text-sm font-medium rounded-2xl cursor-not-allowed transition-all duration-300 ${
                      isCollapsed ? "justify-center" : ""
                    } bg-gray-50 border border-gray-200/50`}
                    title={
                      isCollapsed ? `${item.label} (Coming Soon)` : undefined
                    }
                  >
                    <div className="relative">
                      <Icon className="h-5 w-5 text-gray-400" />
                      {!isCollapsed && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
                      )}
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between ml-4">
                        <span className="text-gray-400">{item.label}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  // Menu yang aktif dan dapat diklik
                  <Link
                    to={item.path}
                    className={`relative group flex items-center px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 ${
                      isCollapsed ? "justify-center" : ""
                    } ${
                      isActive
                        ? "bg-gradient-to-r from-[#23407a]/10 to-blue-500/10 text-[#23407a] font-bold border border-[#23407a]/30 shadow-lg"
                        : "text-gray-700 hover:text-[#23407a] hover:bg-[#23407a]/5 border border-gray-200/50"
                    }`}
                  >
                    <div className="relative">
                      <Icon
                        className={`h-5 w-5 ${
                          isActive
                            ? "text-[#23407a]"
                            : "text-gray-400 group-hover:text-[#23407a]"
                        }`}
                      />
                      {isActive && !isCollapsed && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg"></div>
                      )}
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between ml-4">
                        <span>{item.label}</span>
                      </div>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Tombol WhatsApp untuk bantuan */}
        <div className="mt-8 pt-6 border-t border-gray-200/50">
          {!isCollapsed && (
            <button
              onClick={handleWhatsAppClick}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 hover:bg-green-600 text-white px-4 py-3 font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle className="h-5 w-5" />
              <span>
                {`Chat WhatsApp${
                  isWithinOperatingHours() ? " (Online)" : " (Offline)"
                }`}
              </span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
