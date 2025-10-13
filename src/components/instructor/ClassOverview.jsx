// src/components/instructor/ClassOverview.jsx
import { Link } from "react-router-dom";
import { BookOpen, Users, FileText, Plus, Eye } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "../ui";

const ClassOverview = ({ classes, totalClasses, detailed = false }) => {
  return (
    <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500/10 rounded-2xl">
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                {detailed ? "Management Kelas" : "Kelas Terbaru"}
              </CardTitle>
              <p className="text-gray-600 text-sm mt-1">
                {detailed
                  ? "Kelola semua kelas Anda"
                  : "Aktivitas kelas terkini"}
              </p>
            </div>
          </div>
          <Link to="/instructor/classes">
            <Button
              variant="ghost"
              className="text-[#23407a] hover:bg-[#23407a]/10"
            >
              <span className="hidden sm:inline">Lihat Semua</span> (
              {totalClasses})
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {classes.length > 0 ? (
            classes.map((cls) => (
              <div
                key={cls.id}
                className="group relative overflow-hidden p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl border border-gray-200/50 hover:border-[#23407a]/30 hover:shadow-lg transition-all duration-300"
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#23407a]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate group-hover:text-[#23407a] transition-colors text-lg">
                      {cls.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center bg-white/70 px-2 py-1 rounded-lg">
                        <Users className="h-3 w-3 mr-1 text-blue-500" />
                        <span className="font-medium">
                          {/* {Array.isArray(cls.enrollments)
                            ? cls.enrollments.length
                            : 0}{" "} */}
                          siswa
                        </span>
                      </div>
                      <div className="flex items-center bg-white/70 px-2 py-1 rounded-lg">
                        <FileText className="h-3 w-3 mr-1 text-purple-500" />
                        <span className="font-medium">
                          {/* {Array.isArray(cls.assignments)
                            ? cls.assignments.length
                            : 0}{" "} */}
                          tugas
                        </span>
                      </div>
                    </div>
                    {detailed && (
                      <div className="mt-3 text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-lg inline-block">
                        Dibuat:{" "}
                        {cls.createdAt
                          ? new Date(cls.createdAt).toLocaleDateString("id-ID")
                          : "-"}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {detailed && (
                      <Link to={`/instructor/classes/${cls.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Link
                      to={`/instructor/classes/${cls.id}/create-assignment`}
                    >
                      <Button
                        size="sm"
                        className="bg-[#23407a] hover:bg-[#1a2f5c] transform group-hover:scale-105 transition-all duration-300"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Tugas
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-[#23407a]/10 to-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-[#23407a]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Belum ada kelas
              </h3>
              <p className="text-gray-600 mb-6">
                Mulai dengan membuat kelas pertama Anda
              </p>
              <Link to="/instructor/create-class">
                <Button className="bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Kelas Pertama
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassOverview;
