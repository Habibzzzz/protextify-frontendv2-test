// src/components/dashboard/RecentClasses.jsx

import { Link } from "react-router-dom";
import { BookOpen, Plus, Users, FileText } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "../ui";

/**
 * Komponen RecentClasses
 * Menampilkan daftar kelas terbaru yang diikuti user pada dashboard.
 * Jika tidak ada kelas, menampilkan prompt untuk bergabung kelas.
 *
 * Props:
 * - classes: Array daftar kelas terbaru
 * - totalClasses: Total jumlah kelas yang diikuti user
 */
const RecentClasses = ({ classes, totalClasses }) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header Card: Judul dan tombol lihat semua kelas */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Indicator bulat hijau */}
            <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3"></div>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-[#23407a]" />
              Kelas Terbaru
            </CardTitle>
          </div>
          {/* Tombol menuju halaman semua kelas */}
          <Link to="/dashboard/classes">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#23407a] hover:bg-[#23407a]/10"
            >
              <span className="hidden sm:inline">Lihat Semua</span> (
              {totalClasses})
            </Button>
          </Link>
        </div>
      </CardHeader>

      {/* Konten Card: Daftar kelas atau prompt jika kosong */}
      <CardContent>
        <div className="space-y-3">
          {classes.length > 0 ? (
            // Render daftar kelas jika ada
            classes.map((cls) => {
              // Mapping data kelas sesuai struktur backend
              const assignmentsCount = Array.isArray(cls.assignments)
                ? cls.assignments.length
                : 0;
              const instructorName = cls.instructor?.fullName || "Instruktur";
              const joinedDate =
                cls.currentUserEnrollment?.joinedAt || cls.createdAt;

              return (
                // Link menuju detail kelas
                <Link
                  key={cls.id}
                  to={`/dashboard/classes/${cls.id}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-[#23407a]/30 hover:shadow-md transition-all duration-300">
                    {/* Efek gradient saat hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#23407a]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Nama kelas */}
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#23407a] transition-colors">
                          {cls.name}
                        </h3>
                        {/* Nama instruktur */}
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Users className="h-3 w-3 mr-1" />
                          <span className="truncate">{instructorName}</span>
                        </div>
                        {/* Tanggal bergabung */}
                        <div className="text-xs text-gray-500 mt-1">
                          Bergabung:{" "}
                          {new Date(joinedDate).toLocaleDateString("id-ID")}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 ml-4">
                        {/* Jumlah tugas/assignment */}
                        <div className="flex items-center text-sm text-gray-500">
                          <FileText className="h-3 w-3 mr-1" />
                          <span>{assignmentsCount}</span>
                        </div>
                        {/* Icon panah muncul saat hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[#23407a]">
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
                  </div>
                </Link>
              );
            })
          ) : (
            // Render prompt jika belum ada kelas
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#23407a]/10 to-[#3b5fa4]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-[#23407a]" />
              </div>
              <p className="text-gray-500 mb-4">Belum ada kelas</p>
              {/* Tombol untuk bergabung kelas */}
              <Link to="/dashboard/join-class">
                <Button size="sm" className="bg-[#23407a] hover:bg-[#1a2f5c]">
                  <Plus className="h-4 w-4 mr-2" />
                  Gabung Kelas
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentClasses;
