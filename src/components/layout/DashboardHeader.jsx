import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { cn } from "../../utils/helpers";
import useAuth from "../../hooks/useAuth";
import { getDefaultRoute } from "../../utils/constants";

/**
 * Komponen DashboardHeader
 *
 * Menampilkan header dashboard dengan latar belakang efek visual,
 * area pencarian (nonaktif), notifikasi (nonaktif), dan dropdown profil pengguna.
 *
 * Fitur utama:
 * - Menampilkan nama, email, role, dan institusi pengguna.
 * - Dropdown profil dengan menu navigasi ke dashboard, pengaturan, dan logout.
 * - Efek visual modern menggunakan Tailwind CSS.
 *
 * State:
 * - isProfileDropdownOpen: Status terbuka/tutup dropdown profil.
 *
 * Context:
 * - Menggunakan useAuth untuk mendapatkan data pengguna dan fungsi logout.
 *
 * Navigasi:
 * - Menggunakan useNavigate untuk mengarahkan pengguna setelah logout.
 *
 * @component
 */
export default function DashboardHeader() {
  // State untuk status dropdown profil
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Mendapatkan data user dan fungsi logout dari context
  const { user, logout } = useAuth();

  // Hook navigasi dari react-router-dom
  const navigate = useNavigate();

  /**
   * Fungsi handleLogout
   * Melakukan logout dan mengarahkan ke halaman utama.
   * Menutup dropdown profil setelah logout.
   */
  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileDropdownOpen(false);
  };

  return (
    <>
      {/* Header utama dashboard */}
      <header className="sticky top-0 z-40 overflow-hidden bg-gradient-to-r from-[#23407a] via-[#1a2f5c] to-[#162849] border-b border-white/10 shadow-lg">
        {/* Efek latar belakang visual */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]"></div>
        </div>

        {/* Konten utama header */}
        <div className="relative z-10 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Bagian kiri - Area pencarian (nonaktif) */}
            <div className="flex items-center flex-1 max-w-md">
              {/* 
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60 group-focus-within:text-white transition-colors" />
                    <input
                      type="text"
                      placeholder="Cari kelas, tugas, atau siswa..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={cn(
                        "w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300",
                        "bg-white/10 backdrop-blur-sm border border-white/20",
                        "text-white placeholder-white/60",
                        "focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40",
                        "hover:bg-white/15 focus:bg-white/15"
                      )}
                    />
                  </div>
                </form> 
              */}
            </div>

            {/* Bagian kanan - Notifikasi & Dropdown Profil */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Tombol notifikasi (nonaktif) */}
              {/* 
                <button className="relative p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group border border-white/20 hover:border-white/30 hover:scale-105">
                  <Bell className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse shadow-lg"></span>
                </button> 
              */}

              {/* Dropdown profil pengguna */}
              <div className="relative">
                {/* Tombol avatar dan info user */}
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    "bg-white/10 backdrop-blur-sm border border-white/20",
                    "hover:bg-white/15 hover:border-white/30 hover:scale-105",
                    "focus:outline-none focus:ring-2 focus:ring-white/30"
                  )}
                >
                  {/* Avatar pengguna */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center shadow-lg border border-white/20">
                      <span className="text-white font-bold text-sm">
                        {user?.fullName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Info pengguna (nama & role) */}
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-white leading-tight">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-white/70 capitalize leading-tight">
                      {user?.role?.toLowerCase()}
                    </p>
                  </div>

                  {/* Icon dropdown */}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-white/60 transition-transform duration-200",
                      isProfileDropdownOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Dropdown menu profil */}
                {isProfileDropdownOpen && (
                  <>
                    {/* Backdrop untuk menutup dropdown saat klik di luar */}
                    <div
                      className="fixed inset-0 z-[100] bg-black/10 backdrop-blur-sm"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Escape" ||
                          e.key === "Enter" ||
                          e.key === " "
                        ) {
                          setIsProfileDropdownOpen(false);
                        }
                      }}
                      aria-label="Tutup dropdown profil"
                      role="button"
                    />

                    {/* Menu dropdown profil */}
                    <div className="fixed top-20 right-4 lg:right-6 z-[101] w-80 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-2 animate-slide-up">
                      {/* Header info user di dropdown */}
                      <div className="px-6 py-4 border-b border-gray-100/80">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#23407a] to-[#3b5fa4] flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold">
                              {user?.fullName?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {user?.fullName}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {user?.email}
                            </p>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#23407a]/10 text-[#23407a] mt-1">
                              {user?.role?.toLowerCase()}
                            </span>
                            {user?.institution && (
                              <span className="block text-xs text-gray-400 mt-1">
                                {user.institution}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Menu navigasi di dropdown */}
                      <div className="py-2">
                        {/* Link ke dashboard */}
                        <Link
                          to={getDefaultRoute(user?.role)}
                          className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-[#23407a]/10 hover:text-[#23407a] transition-all duration-200 group"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <User className="h-5 w-5 mr-3 text-gray-400 group-hover:text-[#23407a] transition-colors" />
                          <span className="font-medium">Dashboard</span>
                        </Link>

                        {/* Link ke pengaturan profil */}
                        <Link
                          to="/profile"
                          className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-[#23407a]/10 hover:text-[#23407a] transition-all duration-200 group"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Settings className="h-5 w-5 mr-3 text-gray-400 group-hover:text-[#23407a] transition-colors" />
                          <span className="font-medium">Pengaturan</span>
                        </Link>
                      </div>

                      {/* Tombol logout */}
                      <div className="border-t border-gray-100/80 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group"
                        >
                          <LogOut className="h-5 w-5 mr-3 text-red-400 group-hover:text-red-600 transition-colors" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
