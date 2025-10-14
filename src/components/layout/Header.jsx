import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Bell, ChevronDown } from "lucide-react";
import { cn } from "../../utils/helpers";
import useAuth from "../../hooks/useAuth";
import { getDefaultRoute } from "../../utils/constants";
import { Button } from "../ui";
import logo from "@/assets/logo-protextify-warna.png";
import logoPutih from "@/assets/logo-protextify-putih.png";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserMenuOpen(false);
  };

  const isHomePage = location.pathname === "/";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-sm"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <img
                    src={
                      scrolled
                        ? logo
                        : logoPutih
                    }
                    alt="Protextify"
                    className="h-8 lg:h-10 w-auto transition-transform group-hover:scale-105"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <nav className="flex items-center space-x-6">
                <Link
                  to="/"
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105",
                    scrolled
                      ? "text-gray-700 hover:text-[#23407a]"
                      : "text-white/90 hover:text-white"
                  )}
                >
                  Beranda
                </Link>
                <Link
                  to="/about"
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105",
                    scrolled
                      ? "text-gray-700 hover:text-[#23407a]"
                      : "text-white/90 hover:text-white"
                  )}
                >
                  Tentang
                </Link>
                <Link
                  to="/pricing"
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105",
                    scrolled
                      ? "text-gray-700 hover:text-[#23407a]"
                      : "text-white/90 hover:text-white"
                  )}
                >
                  Harga
                </Link>
                <Link
                  to="/help"
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105",
                    scrolled
                      ? "text-gray-700 hover:text-[#23407a]"
                      : "text-white/90 hover:text-white"
                  )}
                >
                  Bantuan
                </Link>
                <Link
                  to="/docs"
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105",
                    scrolled
                      ? "text-gray-700 hover:text-[#23407a]"
                      : "text-white/90 hover:text-white"
                  )}
                >
                  Dokumentasi
                </Link>
              </nav>

              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {/* Notifications */}
                  <button className="relative p-2 rounded-full hover:bg-gray-100/80 transition-colors group">
                    <Bell
                      className={cn(
                        "h-5 w-5 transition-colors",
                        scrolled
                          ? "text-gray-600 group-hover:text-[#23407a]"
                          : "text-white/80 group-hover:text-white"
                      )}
                    />
                    {/* Badge notifikasi hanya jika ada data dari BE */}
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105",
                        "focus:outline-none focus:ring-2 focus:ring-[#23407a]/20",
                        scrolled
                          ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                      )}
                    >
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#23407a] to-[#3b5fa4] text-white flex items-center justify-center font-semibold text-sm">
                        {user?.fullName?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium leading-tight">
                          {user?.fullName}
                        </p>
                        <p className="text-xs opacity-75 capitalize">
                          {user?.role?.toLowerCase()}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-60" />
                    </button>

                    {isUserMenuOpen && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsUserMenuOpen(false)}
                        />

                        {/* Dropdown */}
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-slide-up">
                          {/* User Info Header */}
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#23407a] to-[#3b5fa4] text-white flex items-center justify-center font-semibold">
                                {user?.fullName?.charAt(0)?.toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {user?.fullName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {user?.email}
                                </p>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#23407a]/10 text-[#23407a] mt-1">
                                  {user?.role?.toLowerCase()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <Link
                              to={getDefaultRoute(user?.role)}
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <User className="h-4 w-4 mr-3 text-gray-400 group-hover:text-[#23407a]" />
                              Dashboard
                            </Link>
                            <Link
                              to="/profile"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <User className="h-4 w-4 mr-3 text-gray-400 group-hover:text-[#23407a]" />
                              Profil Saya
                            </Link>
                          </div>

                          {/* Logout */}
                          <div className="border-t border-gray-100 py-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              Logout
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/auth/login">
                    <Button
                      variant={scrolled ? "ghost" : "outline"}
                      size="sm"
                      className={cn(
                        "font-medium",
                        scrolled
                          ? "text-gray-700 hover:text-[#23407a]"
                          : "border-white/30 text-white hover:bg-white/10"
                      )}
                    >
                      Masuk
                    </Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button
                      size="sm"
                      className="bg-[#23407a] hover:bg-[#1a2f5c]"
                    >
                      Daftar Gratis
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  scrolled
                    ? "text-gray-700 hover:text-[#23407a] hover:bg-gray-100"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                )}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="fixed inset-y-0 right-0 w-80 max-w-sm bg-white shadow-2xl transform transition-transform">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-[#23407a] to-[#3b5fa4]">
                <div className="flex items-center">
                  <img
                    src={
                      scrolled
                        ? logo
                        : logoPutih
                    }
                    alt="Protextify"
                    className="h-8 w-auto"
                  />
                  <span className="ml-2 text-lg font-bold text-white">
                    Protextify
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 py-6 overflow-y-auto">
                <nav className="space-y-2 px-6">
                  <Link
                    to="/"
                    className="mobile-nav-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="font-medium text-gray-900">Beranda</span>
                  </Link>
                  <Link
                    to="/about"
                    className="mobile-nav-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="font-medium text-gray-900">Tentang</span>
                  </Link>
                  <Link
                    to="/pricing"
                    className="mobile-nav-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="font-medium text-gray-900">Harga</span>
                  </Link>
                  <Link
                    to="/help"
                    className="mobile-nav-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="font-medium text-gray-900">Bantuan</span>
                  </Link>
                  <Link
                    to="/docs"
                    className="mobile-nav-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="font-medium text-gray-900">
                      Dokumentasi
                    </span>
                  </Link>

                  {isAuthenticated && (
                    <>
                      <div className="border-t border-gray-200 my-4"></div>
                      <Link
                        to={getDefaultRoute(user?.role)}
                        className="mobile-nav-item"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="font-medium text-gray-900">
                          Dashboard
                        </span>
                      </Link>
                      <Link
                        to="/profile"
                        className="mobile-nav-item"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="font-medium text-gray-900">
                          Profil Saya
                        </span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mt-4"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </>
                  )}

                  {!isAuthenticated && (
                    <div className="space-y-3 mt-6">
                      <Link
                        to="/auth/login"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full">
                          Masuk
                        </Button>
                      </Link>
                      <Link
                        to="/auth/register"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button className="w-full bg-[#23407a] hover:bg-[#1a2f5c]">
                          Daftar Gratis
                        </Button>
                      </Link>
                    </div>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
