// src/components/layout/MobileBottomNav.jsx
// filepath: src/components/layout/MobileBottomNav.jsx
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  FileText,
  User,
  Plus,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../utils/helpers";

export default function MobileBottomNav() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const getNavItems = () => {
    if (user?.role === "INSTRUCTOR") {
      return [
        {
          icon: Home,
          label: "Dashboard",
          href: "/instructor/dashboard",
          active: location.pathname === "/instructor/dashboard",
        },
        {
          icon: BookOpen,
          label: "Kelas",
          href: "/instructor/classes",
          active: location.pathname.startsWith("/instructor/classes"),
        },
        {
          icon: Plus,
          label: "Buat Kelas",
          href: "/instructor/create-class",
          active: location.pathname === "/instructor/create-class",
          isPrimary: true,
        },
        {
          icon: BarChart3,
          label: "Analytics",
          href: "/instructor/analytics",
          active: location.pathname.startsWith("/instructor/analytics"),
        },
        {
          icon: User,
          label: "Profil",
          href: "/instructor/settings",
          active: location.pathname === "/instructor/settings",
        },
      ];
    } else {
      // Student
      return [
        {
          icon: Home,
          label: "Dashboard",
          href: "/dashboard/overview",
          active: location.pathname === "/dashboard/overview",
        },
        {
          icon: BookOpen,
          label: "Kelas",
          href: "/dashboard/classes",
          active: location.pathname.startsWith("/dashboard/classes"),
        },
        {
          icon: Plus,
          label: "Gabung",
          href: "/dashboard/join-class",
          active: location.pathname === "/dashboard/join-class",
          isPrimary: true,
        },
        {
          icon: FileText,
          label: "Tugas",
          href: "/dashboard/assignments",
          active: location.pathname.startsWith("/dashboard/assignments"),
        },
        {
          icon: User,
          label: "Profil",
          href: "/profile",
          active: location.pathname === "/profile",
        },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      {/* Enhanced Backdrop with Glass Effect */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50"></div>

      {/* Safe area padding */}
      <div className="relative safe-area-bottom px-4 py-3">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.isPrimary) {
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex flex-col items-center justify-center p-2 group"
                >
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#23407a] to-[#3b5fa4] rounded-2xl flex items-center justify-center mb-1 shadow-xl shadow-[#23407a]/25 transition-all duration-300 group-active:scale-95">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    {item.active && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-[#23407a] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-[#23407a] rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#23407a]">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 group min-w-0 flex-1",
                  item.active
                    ? "bg-[#23407a]/10 text-[#23407a]"
                    : "text-gray-500 hover:text-[#23407a] hover:bg-[#23407a]/5"
                )}
              >
                <div className="relative mb-1">
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      item.active
                        ? "text-[#23407a] scale-110"
                        : "text-gray-500 group-hover:text-[#23407a] group-hover:scale-110"
                    )}
                  />
                  {item.active && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#23407a] rounded-full animate-pulse"></div>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium transition-colors truncate",
                    item.active
                      ? "text-[#23407a] font-bold"
                      : "text-gray-500 group-hover:text-[#23407a]"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
