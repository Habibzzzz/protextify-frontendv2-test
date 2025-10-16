import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  HelpCircle,
  CreditCard,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { getDefaultRoute, USER_ROLES } from "../../utils/constants";

/**
 * Komponen UserMenu untuk menampilkan menu pengguna berdasarkan varian tampilan.
 *
 * @param {Object} props - Properti yang diterima komponen.
 * @param {"header"|"sidebar"|"mobile"} [props.variant="header"] - Varian tampilan menu (header, sidebar, atau mobile).
 * @param {boolean} [props.showFullName=true] - Menentukan apakah nama lengkap pengguna ditampilkan.
 * @param {boolean} [props.showRole=true] - Menentukan apakah peran pengguna ditampilkan.
 * @param {string} [props.className=""] - Kelas CSS tambahan untuk komponen.
 *
 * @returns {JSX.Element|null} Komponen menu pengguna sesuai varian, atau null jika tidak terautentikasi.
 *
 * Fitur:
 * - Menampilkan avatar, nama, dan peran pengguna.
 * - Menampilkan daftar menu sesuai peran pengguna.
 * - Mendukung varian tampilan: header, sidebar, dan mobile.
 * - Menutup menu saat klik di luar area menu atau saat perubahan rute.
 * - Logout pengguna dan navigasi ke halaman utama.
 */
export default function UserMenu({
  variant = "header", // "header" | "sidebar" | "mobile"
  showFullName = true,
  showRole = true,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Menu items sesuai BE
  const menuItems = [
    {
      label: "Dashboard",
      icon: User,
      path: getDefaultRoute(user.role),
      show: true,
    },
    {
      label: "Profil Saya",
      icon: Settings,
      path: "/profile",
      show: true,
    },
    {
      label: "Transaksi",
      icon: CreditCard,
      path: "/instructor/transactions",
      show: user.role === USER_ROLES.INSTRUCTOR,
    },
    {
      label: "Bantuan",
      icon: HelpCircle,
      path: "/help",
      show: true,
    },
  ];

  const visibleMenuItems = menuItems.filter((item) => item.show);

  const renderUserAvatar = () => (
    <div className="w-8 h-8 bg-[#23407a] rounded-full flex items-center justify-center text-white font-medium text-sm">
      {user.fullName?.charAt(0)?.toUpperCase() || "U"}
    </div>
  );

  const renderUserInfo = () => (
    <div className="flex-1 min-w-0">
      {showFullName && (
        <p className="text-sm font-medium text-gray-900 truncate">
          {user.fullName}
        </p>
      )}
      {showRole && (
        <p className="text-xs text-gray-500 capitalize">
          {user.role?.toLowerCase()}
        </p>
      )}
    </div>
  );

  // Mobile variant (full width button)
  if (variant === "mobile") {
    return (
      <div className="space-y-1">
        <div className="flex items-center px-3 py-2 text-base font-medium text-gray-700">
          {renderUserAvatar()}
          <div className="ml-3">{renderUserInfo()}</div>
        </div>

        {visibleMenuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-[#23407a] hover:bg-gray-50 rounded-md transition-colors"
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    );
  }

  // Sidebar variant (collapsed sidebar support)
  if (variant === "sidebar") {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#23407a]"
        >
          {renderUserAvatar()}
          <div className="ml-3 flex-1">{renderUserInfo()}</div>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            {visibleMenuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  // Header variant (default)
  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#23407a]"
      >
        {renderUserAvatar()}
        <div className="hidden md:block text-left">{renderUserInfo()}</div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1 capitalize">
              {user.role?.toLowerCase()} • {user.institution}
            </p>
          </div>
          <div className="py-1">
            {visibleMenuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
