import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  BookOpen,
  Users,
  FileText,
  Eye,
  Settings,
  Filter,
  SortAsc,
  SortDesc,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Select,
  Alert,
  LoadingSpinner,
  Breadcrumb,
} from "../../components";
import { classesService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import { formatDate } from "../../utils/helpers";

const filterOptions = [
  { value: "all", label: "📚 Semua Status" },
  { value: "active", label: "✅ Ada Tugas Aktif" },
  { value: "inactive", label: "⏸️ Tidak Ada Tugas Aktif" },
  { value: "has-students", label: "👥 Ada Siswa" },
  { value: "no-students", label: "🆕 Belum Ada Siswa" },
];

const sortOptions = [
  { value: "name", label: "📝 Nama Kelas" },
  { value: "created", label: "📅 Tanggal Dibuat" },
  { value: "students", label: "👥 Jumlah Siswa" },
  { value: "assignments", label: "📋 Jumlah Tugas" },
];

export default function InstructorClasses() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("all");

  const {
    data: classes,
    loading,
    error,
    refetch,
  } = useAsyncData(classesService.getClasses, []);

  const filteredAndSortedClasses = useMemo(() => {
    if (!classes) return [];

    let filtered = classes.filter((cls) => {
      const matchesSearch =
        cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "active" && cls.assignments?.some((a) => a.active)) ||
        (filterStatus === "inactive" &&
          !cls.assignments?.some((a) => a.active)) ||
        (filterStatus === "no-students" &&
          (!cls.enrollments || cls.enrollments.length === 0)) ||
        (filterStatus === "has-students" &&
          cls.enrollments &&
          cls.enrollments.length > 0);

      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "created":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "students":
          aValue = a.enrollments?.length || 0;
          bValue = b.enrollments?.length || 0;
          break;
        case "assignments":
          aValue = a.assignments?.length || 0;
          bValue = b.assignments?.length || 0;
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [classes, searchTerm, sortBy, sortOrder, filterStatus]);

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

  return (
    <Container className="py-8">
      {/* Header Section */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#162849] rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"></div>
        <div className="relative px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-white/70 text-sm font-medium">
                  Kelola Kelas
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Manajemen Kelas 👨‍🏫
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Kelola semua kelas Anda dengan mudah.
                {filteredAndSortedClasses?.length > 0
                  ? ` Anda memiliki ${filteredAndSortedClasses.length} kelas.`
                  : " Mulai dengan membuat kelas pertama Anda."}
              </p>
            </div>
            <Link to="/instructor/create-class">
              <Button
                size="lg"
                className="bg-white text-[#23407a] hover:bg-gray-50 shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Buat Kelas Baru
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Breadcrumb />

      {/* Filters & Search */}
      <div className="mb-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Cari nama kelas, deskripsi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-2 border-gray-300 focus:border-[#23407a] rounded-xl"
                  />
                </div>
              </div>
              <div className="lg:col-span-3">
                <Select
                  value={filterStatus}
                  onChange={(value) => setFilterStatus(value)}
                  options={filterOptions}
                  className="h-12 border-2 border-gray-300 focus:border-[#23407a] rounded-xl"
                />
              </div>
              <div className="lg:col-span-3">
                <Select
                  value={sortBy}
                  onChange={(value) => setSortBy(value)}
                  options={sortOptions}
                  className="h-12 border-2 border-gray-300 focus:border-[#23407a] rounded-xl"
                />
              </div>
              <div className="lg:col-span-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="w-full h-12 border-2 border-gray-300 hover:border-[#23407a] hover:bg-[#23407a] hover:text-white rounded-xl transition-all duration-300"
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="h-5 w-5 mr-2" />
                  ) : (
                    <SortDesc className="h-5 w-5 mr-2" />
                  )}
                  <span>{sortOrder === "asc" ? "A-Z" : "Z-A"}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes List */}
      <AnimatePresence>
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-lg p-8">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded-lg mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-lg mb-6 w-full"></div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="bg-gray-100 rounded-xl p-4">
                        <div className="h-10 w-10 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                  <div className="h-16 bg-gray-100 rounded-xl mb-4"></div>
                  <div className="grid grid-cols-3 gap-3 h-10">
                    <div className="bg-gray-200 rounded-lg"></div>
                    <div className="bg-gray-200 rounded-lg"></div>
                    <div className="bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredAndSortedClasses.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {filteredAndSortedClasses.map((cls) => (
              <ClassCard key={cls.id} classData={cls} />
            ))}
          </motion.div>
        ) : (
          <Card className="relative overflow-hidden border-0 shadow-lg text-center py-16">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
            <CardContent className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-[#23407a]/20 to-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-12 w-12 text-[#23407a]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchTerm || filterStatus !== "all"
                  ? "Tidak Ada Kelas yang Ditemukan"
                  : "Belum Ada Kelas"}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm || filterStatus !== "all"
                  ? "Coba ubah filter atau kata kunci pencarian Anda."
                  : "Mulai perjalanan mengajar Anda dengan membuat kelas pertama."}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Link to="/instructor/create-class">
                  <Button
                    size="lg"
                    className="bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Buat Kelas Pertama
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </AnimatePresence>
    </Container>
  );
}

function ClassCard({ classData }) {
  const navigate = useNavigate();
  const studentsCount = classData.enrollments?.length || 0;
  const assignmentsCount = classData.assignments?.length || 0;
  const activeAssignments =
    classData.assignments?.filter((a) => a.active).length || 0;

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div variants={cardVariants}>
      <Card className="group relative flex flex-col h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-blue-50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a]/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <CardContent className="relative z-10 p-6 flex flex-col flex-1">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#23407a] transition-colors pr-4">
                {classData.name}
              </h3>
              <div className="flex flex-col space-y-2 flex-shrink-0">
                {activeAssignments > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Aktif
                  </span>
                )}
                {studentsCount === 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                    Baru
                  </span>
                )}
              </div>
            </div>
            {classData.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-6">
                {classData.description}
              </p>
            )}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <StatItem icon={Users} value={studentsCount} label="Siswa" />
              <StatItem
                icon={FileText}
                value={assignmentsCount}
                label="Tugas"
              />
              <StatItem
                icon={BookOpen}
                value={formatDate(classData.createdAt, "dd MMM")}
                label="Dibuat"
              />
            </div>
            <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-600 mb-1">
                Token Kelas
              </p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-gray-800 tracking-wider">
                  {classData.classToken}
                </span>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(classData.classToken);
                    toast.success("Token disalin!");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/instructor/classes/${classData.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Detail
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(`/instructor/classes/${classData.id}/settings`)
              }
            >
              <Settings className="h-4 w-4 mr-2" />
              Atur
            </Button>
            <Button
              size="sm"
              className="bg-[#23407a] hover:bg-[#1a2f5c]"
              onClick={() =>
                navigate(
                  `/instructor/classes/${classData.id}/create-assignment`
                )
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Tugas
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatItem({ icon: Icon, value, label }) {
  return (
    <div className="text-center p-2 bg-white/50 rounded-lg">
      <Icon className="h-5 w-5 text-[#23407a] mx-auto mb-1" />
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}
