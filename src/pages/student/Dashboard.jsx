/**
 * Mapping utama:
 * - useStudentDashboard() -> { stats, recentClasses, recentAssignments, activityTimeline }
 * - stats: totalClasses, activeAssignments, completedAssignments, pendingSubmissions, overdueAssignments (opsional)
 * - recentClasses: array kelas (id, name, instructor, assignments, enrollments, currentUserEnrollment)
 * - recentAssignments: array assignment (id, title, deadline, class, active)
 * - activityTimeline: array aktivitas (type, title, time, status, grade, plagiarismScore)
 * - Tidak render data/fitur yang tidak dikirim BE.
 */

import {
  BookOpen,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import { useStudentDashboard } from "../../hooks/useStudentDashboard";
import { Container, LoadingSpinner, Alert, Button } from "../../components";
import {
  QuickActions,
  RecentClasses,
  ActivityTimeline,
} from "../../components/dashboard";
import { Grid } from "../../components/ui";

export default function StudentDashboard() {
  const { user } = useAuth();
  const {
    loading,
    error,
    stats,
    recentClasses,
    recentAssignments,
    activityTimeline,
    refetch,
  } = useStudentDashboard();

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
          <p>Gagal memuat data dashboard: {error.message}</p>
          <Button onClick={refetch} size="sm" className="mt-3">
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  // Safe fallback untuk stats, assignments, dan field baru
  const safeStats = {
    totalClasses:
      typeof stats?.totalClasses === "number" ? stats.totalClasses : 0,
    activeAssignments:
      typeof stats?.activeAssignments === "number"
        ? stats.activeAssignments
        : 0,
    completedAssignments:
      typeof stats?.completedAssignments === "number"
        ? stats.completedAssignments
        : 0,
    pendingSubmissions:
      typeof stats?.pendingSubmissions === "number"
        ? stats.pendingSubmissions
        : 0,
    overdueAssignments:
      typeof stats?.overdueAssignments === "number"
        ? stats.overdueAssignments
        : 0,
  };

  // Safe fallback untuk arrays
  const safeRecentClasses = Array.isArray(recentClasses) ? recentClasses : [];
  const safeActivityTimeline = Array.isArray(activityTimeline)
    ? activityTimeline
    : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <Container className="py-8">
      {/* Enhanced Welcome Section with Gradient & Glass Effect */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#162849] rounded-2xl"></div>
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-white/70 text-sm font-medium">
                  Dashboard Student
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Selamat datang, {user?.fullName || "Student"}!
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Kelola tugas dan kelas Anda dengan mudah. Tetap produktif dan
                jaga konsistensi belajar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <motion.div
        className="mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-[#23407a] to-[#3b5fa4] rounded-full mr-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">
            Ringkasan Aktivitas
          </h2>
        </div>
        <Grid cols={1} mdCols={2} lgCols={4} gap={6}>
          <StatCard
            title="Total Kelas"
            value={safeStats.totalClasses}
            icon={BookOpen}
            color="blue"
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Tugas Aktif"
            value={safeStats.activeAssignments}
            icon={Clock}
            color="yellow"
            gradient="from-yellow-500 to-orange-500"
          />
          <StatCard
            title="Tugas Selesai"
            value={safeStats.completedAssignments}
            icon={CheckCircle}
            color="green"
            gradient="from-green-500 to-emerald-600"
          />
          <StatCard
            title="Draft"
            value={safeStats.pendingSubmissions}
            icon={FileText}
            color="purple"
            gradient="from-purple-500 to-indigo-600"
          />
          {safeStats.overdueAssignments > 0 && (
            <StatCard
              title="Tugas Terlambat"
              value={safeStats.overdueAssignments}
              icon={AlertCircle}
              color="red"
              gradient="from-red-500 to-orange-500"
            />
          )}
        </Grid>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        className="grid grid-cols-1 xl:grid-cols-12 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="xl:col-span-4">
          <QuickActions stats={safeStats} />
        </div>
        <div className="xl:col-span-4">
          <RecentClasses
            classes={safeRecentClasses}
            totalClasses={safeStats.totalClasses}
          />
        </div>
        <div className="xl:col-span-4">
          <ActivityTimeline submissions={safeActivityTimeline} />
        </div>
      </motion.div>
    </Container>
  );
}

// Modernized Stat Card Component
function StatCard({ title, value, icon: Icon, gradient }) {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={itemVariants}
      className="transition-all duration-300 hover:scale-105"
    >
      <div className="p-6 rounded-2xl shadow-lg flex items-center bg-white border border-gray-100 hover:shadow-2xl">
        <div
          className={`p-3 rounded-xl bg-gradient-to-r ${gradient} mr-5 shadow-md`}
        >
          <Icon className="h-7 w-7 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
