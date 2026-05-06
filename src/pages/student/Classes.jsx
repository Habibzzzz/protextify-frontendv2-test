/**
 * Mapping utama:
 * - classesService.getClasses() -> array kelas
 * - Field kelas: id, name, description, classToken, instructor (fullName), enrollments[], assignments[], currentUserEnrollment (joinedAt), createdAt
 * - assignments: id, title, instructions, deadline, active, createdAt
 * - Tidak render fitur/field yang tidak ada di response BE.
 */

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Users, FileText, Plus, Calendar, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Alert,
  LoadingSpinner,
  Breadcrumb,
} from "../../components";
import { classesService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import { formatDate } from "../../utils/helpers";

export default function StudentClasses() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: classes,
    loading,
    error,
    refetch,
  } = useAsyncData(() => classesService.getClasses(), [], {
    refetchOnWindowFocus: true,
    pollIntervalMs: 10000,
  });

  // Handle success message from join class
  useEffect(() => {
    if (location.state?.justJoined) {
      toast.success("Selamat! Anda berhasil bergabung ke kelas baru.");
      // Clear the state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  if (loading) {
    return (
      <Container className="py-6">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-6">
        <Alert variant="error">
          <p>Gagal memuat daftar kelas: {error.message}</p>
          <Button onClick={refetch} size="sm" className="mt-3">
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Container className="py-8">
      {/* Enhanced Header Section with Gradient Background */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#162849] rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"></div>

        <div className="relative px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-white/70 text-sm font-medium">
                  Kelas Saya
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Kelola Kelas Anda
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Daftar kelas yang Anda ikuti ({classes?.length || 0} kelas
                aktif). Akses tugas, materi, dan pantau progres belajar Anda.
              </p>
            </div>

            {/* Enhanced Action Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate("/dashboard/join-class")}
                size="lg"
                className="bg-white text-[#23407a] hover:bg-gray-50 shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Gabung Kelas Baru
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb - moved after header */}
      <Breadcrumb />

      {/* Classes Grid */}
      <AnimatePresence>
        {classes && classes.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {classes.map((classData) => (
              <ClassCard
                key={classData.id}
                classData={classData}
                isNew={location.state?.newClass?.id === classData.id}
              />
            ))}
          </motion.div>
        ) : (
          // Enhanced Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-100/30 rounded-2xl shadow-lg border border-gray-200/50"
          >
            <div className="w-24 h-24 bg-white/70 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-md">
              <BookOpen className="h-12 w-12 text-[#23407a]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Anda Belum Bergabung di Kelas Manapun
            </h3>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
              Mulai perjalanan belajar Anda dengan bergabung ke kelas pertama.
              Dapatkan akses ke materi pembelajaran dan tugas-tugas menarik dari
              instruktur Anda.
            </p>
            <Button
              onClick={() => navigate("/dashboard/join-class")}
              size="lg"
              className="bg-[#23407a] hover:bg-[#1a2f5c] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Gabung Kelas Pertama
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}

// Modern Class Card Component
function ClassCard({ classData, isNew = false }) {
  const navigate = useNavigate();

  const studentsCount = Array.isArray(classData.enrollments)
    ? classData.enrollments.length
    : 0;
  const assignmentsCount = Array.isArray(classData.assignments)
    ? classData.assignments.length
    : 0;
  const activeAssignments = Array.isArray(classData.assignments)
    ? classData.assignments.filter((a) => a?.active).length
    : 0;
  const instructorName = classData.instructor?.fullName || "Instruktur";

  // Find the next upcoming assignment
  // const nextAssignment = Array.isArray(classData.assignments)
  //   ? classData.assignments
  //       .filter((a) => a.active && new Date(a.deadline) > new Date())
  //       .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0]
  //   : null;

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div variants={cardVariants}>
      <Card
        className={`group relative flex flex-col h-full overflow-hidden rounded-2xl border-0 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
          isNew ? "ring-2 ring-offset-2 ring-green-500" : ""
        }`}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-blue-50"></div>

        {/* Header with class name and description */}
        <CardHeader className="relative z-10 border-b border-gray-200/80 bg-white/50 backdrop-blur-sm">
          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-[#23407a] transition-colors truncate">
            {classData.name}
          </CardTitle>
          <p className="text-sm text-gray-600 line-clamp-2 h-[40px]">
            {classData.description || "Tidak ada deskripsi."}
          </p>
        </CardHeader>

        <CardContent className="relative z-10 flex flex-1 flex-col p-6">
          {/* Main content area */}
          <div className="flex-1">
            {/* Instructor and Stats */}
            <div className="mb-5 flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#23407a] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                  {instructorName.charAt(0)}
                </div>
                <span className="font-medium text-gray-700">
                  {instructorName}
                </span>
              </div>
              <div className="flex space-x-4 text-right">
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-1.5 text-blue-500" />
                  <span className="font-semibold">{studentsCount}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FileText className="h-4 w-4 mr-1.5 text-purple-500" />
                  <span className="font-semibold">{assignmentsCount}</span>
                </div>
              </div>
            </div>

            {/* Next Assignment Section */}
            {/* {nextAssignment ? (
              <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-600 mb-1">
                  Tugas Berikutnya
                </p>
                <h4 className="font-semibold text-gray-800 truncate">
                  {nextAssignment.title}
                </h4>
                <div className="mt-2 flex items-center text-sm text-yellow-800">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Deadline: {formatDate(nextAssignment.deadline)}</span>
                </div>
              </div>
            ) : (
              <div className="mb-6 rounded-xl border border-gray-200 bg-gray-100 p-4 text-center">
                <p className="text-sm font-medium text-gray-600">
                  {activeAssignments > 0
                    ? "Semua tugas aktif telah lewat deadline."
                    : "Tidak ada tugas aktif saat ini."}
                </p>
              </div>
            )} */}
          </div>

          {/* Footer with action buttons */}
          <div className="mt-auto pt-5 border-t border-gray-200/80">
            {classData.currentUserEnrollment?.joinedAt && (
              <div className="text-xs text-gray-500 mb-4 text-center">
                Bergabung pada{" "}
                {formatDate(classData.currentUserEnrollment.joinedAt)}
              </div>
            )}
            <div className="flex space-x-3">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-gray-300 text-gray-800 hover:bg-gray-100 hover:border-gray-400"
                onClick={() => navigate(`/dashboard/classes/${classData.id}`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Detail Kelas
              </Button>
              <Button
                size="sm"
                className={`flex-1 transition-all duration-300 ${
                  activeAssignments > 0
                    ? "bg-[#23407a] hover:bg-[#1a2f5c] text-white shadow-md hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={() =>
                  activeAssignments > 0 &&
                  navigate(`/dashboard/classes/${classData.id}/assignments`)
                }
                disabled={activeAssignments === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                {activeAssignments > 0
                  ? `Tugas Aktif (${activeAssignments})`
                  : "Tidak Ada Tugas"}
              </Button>
            </div>
          </div>
        </CardContent>

        {/* New Class Badge */}
        {isNew && (
          <div className="absolute top-3 -right-11 z-20">
            <div className="w-32 h-8 bg-green-500 flex items-center justify-center transform rotate-45">
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                Baru
              </span>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
