// src/components/instructor/InstructorQuickActions.jsx
import { Link } from "react-router-dom";
import { Plus, BookOpen, FileText, BarChart3, DollarSign } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "../ui";

const InstructorQuickActions = ({ stats }) => {
  const actions = [
    {
      label: "Buat Kelas Baru",
      icon: Plus,
      href: "/instructor/create-class",
      variant: "default",
      description: "Mulai kelas baru untuk siswa",
    },
    {
      label: "Kelola Kelas",
      icon: BookOpen,
      href: "/instructor/classes",
      variant: "outline",
      description: `${stats.totalClasses} kelas aktif`,
    },
    {
      label: "Review Tugas",
      icon: FileText,
      href: "/instructor/classes", // Diarahkan ke halaman kelas
      variant: "outline",
      description: `${stats.pendingGrading} menunggu penilaian`,
      urgent: stats.pendingGrading > 0,
    },
    {
      label: "Lihat Analytics",
      icon: BarChart3,
      href: "/instructor/analytics",
      variant: "outline",
      description: `${stats.completionRate}% completion rate`,
      disabled: true, // Analytics belum didukung BE
    },
  ];

  return (
    <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#23407a]/10 to-blue-500/10 rounded-full transform translate-x-16 -translate-y-16"></div>

      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-[#23407a]/10 rounded-2xl">
            <DollarSign className="h-8 w-8 text-[#23407a]" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Aksi Cepat
            </CardTitle>
            <p className="text-gray-600 text-sm mt-1">
              Akses fitur utama dengan cepat
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 space-y-3">
        {actions.map((action, index) => (
          <Link
            key={action.href}
            to={action.href}
            className={`group block ${
              action.disabled ? "pointer-events-none opacity-60" : ""
            }`}
            tabIndex={action.disabled ? -1 : 0}
            aria-disabled={action.disabled ? "true" : "false"}
          >
            <div
              className={`relative overflow-hidden p-4 rounded-xl border-2 transition-all duration-300 
              hover:shadow-lg hover:scale-[1.02] group ${
                action.urgent
                  ? "border-red-200 bg-gradient-to-r from-red-50 to-orange-50 hover:border-red-300"
                  : action.variant === "default"
                  ? "border-[#23407a]/30 bg-gradient-to-r from-[#23407a]/5 to-blue-500/5 hover:border-[#23407a]"
                  : "border-gray-200 bg-gradient-to-r from-gray-50 to-white hover:border-[#23407a]/30"
              }`}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#23407a]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10 flex items-center w-full">
                <div
                  className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                    action.urgent
                      ? "bg-red-500 text-white"
                      : action.variant === "default"
                      ? "bg-[#23407a] text-white"
                      : "bg-gray-100 text-[#23407a] group-hover:bg-[#23407a] group-hover:text-white"
                  }`}
                >
                  <action.icon className="h-5 w-5" />
                </div>

                <div className="ml-4 flex-1">
                  <div
                    className={`font-semibold transition-colors ${
                      action.urgent
                        ? "text-red-700"
                        : "text-gray-900 group-hover:text-[#23407a]"
                    }`}
                  >
                    {action.label}
                    {action.urgent && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Urgent
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-sm mt-1 ${
                      action.urgent ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {action.description}
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[#23407a]">
                  <svg
                    className="w-5 h-5"
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
      </CardContent>
    </Card>
  );
};

export default InstructorQuickActions;
