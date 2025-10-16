// src/components/dashboard/QuickActions.jsx

import { Link } from "react-router-dom";
import { Plus, FileText, TrendingUp, BookOpen } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "../ui";

/**
 * Komponen QuickActions
 * Menampilkan daftar aksi cepat yang didukung backend untuk user bertipe student.
 * Setiap aksi memiliki label, ikon, link tujuan, style, dan deskripsi.
 * Props:
 *   - stats: Object berisi statistik user (totalClasses, activeAssignments, completedAssignments)
 */
const QuickActions = ({ stats }) => {
  // Daftar aksi yang ditampilkan pada dashboard
  const actions = [
    {
      label: "Gabung Kelas Baru",
      icon: Plus,
      href: "/dashboard/join-class",
      variant: "default",
      description: "Bergabung dengan kelas menggunakan token",
      className: "bg-[#23407a] hover:bg-[#1a2f5c] text-white",
    },
    {
      label: "Lihat Kelas Saya",
      icon: BookOpen,
      href: "/dashboard/classes",
      variant: "outline",
      description: `${stats.totalClasses} kelas diikuti`,
    },
    {
      label: "Tugas Aktif",
      icon: FileText,
      href: stats.activeAssignments > 0 ? "/dashboard/assignments" : "#",
      variant: "outline",
      description: `${stats.activeAssignments} tugas aktif`,
      disabled: stats.activeAssignments === 0,
    },
    {
      label: "Riwayat Pengumpulan",
      icon: TrendingUp,
      href: "/dashboard/submissions",
      variant: "outline",
      description: `${stats.completedAssignments} tugas selesai`,
    },
  ];

  return (
    // Card utama untuk membungkus seluruh quick actions
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header Card */}
      <CardHeader className="pb-4">
        <div className="flex items-center">
          {/* Indicator bulat di kiri judul */}
          <div className="w-2 h-2 bg-gradient-to-r from-[#23407a] to-[#3b5fa4] rounded-full mr-3"></div>
          <CardTitle className="text-lg font-bold text-gray-900">
            Quick Actions
          </CardTitle>
        </div>
      </CardHeader>

      {/* Konten Card: Daftar aksi */}
      <CardContent>
        <div className="space-y-3">
          {/* Iterasi setiap aksi untuk ditampilkan */}
          {actions.map((action, index) => (
            <Link
              key={index}
              to={action.disabled ? "#" : action.href}
              className={`group block ${
                action.disabled ? "pointer-events-none opacity-50" : ""
              }`}
              tabIndex={action.disabled ? -1 : 0}
              aria-disabled={action.disabled}
            >
              <div
                className={`
                  relative overflow-hidden p-4 rounded-xl border transition-all duration-300 
                  hover:shadow-lg hover:scale-[1.02] hover:border-[#23407a]/30
                  ${
                    action.className ||
                    "border-gray-200 bg-gradient-to-r from-gray-50 to-white"
                  }
                `}
              >
                {/* Overlay gradient saat hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#23407a]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Icon aksi */}
                    <div
                      className={`p-2.5 rounded-lg transition-colors ${
                        action.className
                          ? "bg-white/20"
                          : "bg-[#23407a]/10 group-hover:bg-[#23407a]/20"
                      }`}
                    >
                      <action.icon
                        className={`h-5 w-5 ${
                          action.className ? "text-white" : "text-[#23407a]"
                        }`}
                      />
                    </div>
                    {/* Label dan deskripsi aksi */}
                    <div>
                      <span
                        className={`font-semibold text-sm ${
                          action.className ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {action.label}
                      </span>
                      <p
                        className={`text-xs mt-0.5 ${
                          action.className ? "text-white/80" : "text-gray-600"
                        }`}
                      >
                        {action.description}
                      </p>
                    </div>
                  </div>
                  {/* Icon panah muncul saat hover */}
                  <div
                    className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                      action.className ? "text-white" : "text-[#23407a]"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
