import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  Search,
  Download,
  Eye,
  Shield,
  TrendingUp,
  Edit,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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
  Badge,
} from "../../components";
import { useAsyncData } from "../../hooks";
import { assignmentsService, plagiarismService } from "../../services";
import { formatDate, formatDateTime } from "../../utils/helpers";

export default function AssignmentDetail() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const {
    data: overviewData,
    loading,
    error,
    refetch,
  } = useAsyncData(
    () => assignmentsService.getAssignmentSubmissionsOverview(assignmentId),
    [assignmentId],
    { refetchOnWindowFocus: true, pollIntervalMs: 10000 }
  );

  const { assignment, stats, submissions } = overviewData || {};

  const filteredSubmissions = useMemo(() => {
    if (!submissions) return [];
    return submissions.filter((submission) => {
      const studentName = submission.student?.fullName || "";
      const matchesSearch = studentName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const status = submission.status.toUpperCase();
      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "submitted" &&
          (status === "SUBMITTED" || status === "GRADED")) ||
        (filterStatus === "not-submitted" &&
          (status === "PENDING" || status === "DRAFT")) ||
        (filterStatus === "graded" && status === "GRADED");

      return matchesSearch && matchesFilter;
    });
  }, [submissions, searchQuery, filterStatus]);

  // Auto refresh after grading: refetch on window focus and short polling
  useEffect(() => {
    const onFocus = () => refetch();
    window.addEventListener("focus", onFocus);
    const interval = setInterval(() => refetch(), 10000);
    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, [refetch]);

  const handleCheckPlagiarism = async (submissionId) => {
    if (!submissionId) return;
    toast.promise(plagiarismService.checkPlagiarism(submissionId), {
      loading: "Memulai cek plagiarisme...",
      success: "Pengecekan plagiarisme berhasil dimulai!",
      error: "Gagal memulai cek plagiarisme.",
    });
  };

  const handleGrade = (submissionId) => {
    if (!submissionId) return;
    navigate(`/instructor/submissions/${submissionId}/grade`);
  };

  if (loading) {
    return (
      <Container className="py-6 flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-6">
        <Alert variant="error" title="Gagal Memuat Data">
          <p>{error.message || "Terjadi kesalahan saat mengambil data."}</p>
          <Button onClick={refetch} size="sm" className="mt-4">
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-6 space-y-8">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/instructor/dashboard" },
          { label: "Kelas", href: `/instructor/classes/${assignment.classId}` },
          { label: "Detail Tugas" },
        ]}
      />
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate(`/instructor/classes/${assignment.classId}`)}
          className="border-2 border-white/30 text-[#23407a] hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Kembali ke Kelas
        </Button>
      </div>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#23407a] to-[#1a2f5c] rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{assignment.title}</h1>
            <div
              className="text-white/80 text-lg mb-4 max-w-3xl"
              dangerouslySetInnerHTML={{
                __html: assignment.instructions || "Tidak ada instruksi.",
              }}
            />
            <div className="flex items-center gap-6 text-white/90">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Deadline: {formatDate(assignment.deadline)}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>
                  {stats.submittedCount}/{stats.totalStudents} siswa submit
                </span>
              </div>
            </div>
          </div>
          {assignment.active && (
            <Badge className="bg-green-500 text-white text-sm">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              Aktif
            </Badge>
          )}
        </div>
      </div>
      {/* --- Analytics & Monitoring Buttons --- */}
      <div className="mb-8 flex gap-4">
        <Button
          variant="outline"
          size="lg"
          className="rounded-xl text-[#23407a] border-[#23407a] hover:bg-[#23407a]/10 flex items-center gap-2"
          onClick={() =>
            navigate(`/instructor/assignments/${assignmentId}/analytics`)
          }
        >
          <TrendingUp className="h-5 w-5" />
          Analytics
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-xl text-[#23407a] border-[#23407a] hover:bg-[#23407a]/10 flex items-center gap-2"
          onClick={() =>
            navigate(`/instructor/assignments/${assignmentId}/monitor`)
          }
        >
          <Eye className="h-5 w-5" />
          Monitoring
        </Button>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Siswa"
          value={stats.totalStudents}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Sudah Submit"
          value={stats.submittedCount}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Belum Submit"
          value={stats.pendingCount}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Sudah Dinilai"
          value={stats.gradedCount}
          icon={TrendingUp}
          color="purple"
        />
      </div>
      {/* Filters & Search */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23407a] focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {[
                {
                  value: "all",
                  label: "Semua",
                },
                {
                  value: "submitted",
                  label: "Sudah Submit",
                },
                {
                  value: "not-submitted",
                  label: "Belum Submit",
                },
                {
                  value: "graded",
                  label: "Dinilai",
                },
              ].map((btn) => (
                <Button
                  key={btn.value}
                  size="sm"
                  variant={filterStatus === btn.value ? "default" : "outline"}
                  onClick={() => setFilterStatus(btn.value)}
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Submissions List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>
            Daftar Submission ({filteredSubmissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-600">
                    Siswa
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-600">
                    Waktu Submit
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-600">
                    Plagiarisme
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-600">
                    Nilai
                  </th>
                  <th className="p-4 text-right font-semibold text-gray-600">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub, i) => (
                  <SubmissionRow
                    key={sub.student.id}
                    submission={sub}
                    index={i}
                    onCheckPlagiarism={handleCheckPlagiarism}
                    onGrade={handleGrade}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}

// --- Sub-components ---

function StatCard({ title, value, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
  };
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SubmissionRow({ submission, index, onCheckPlagiarism, onGrade }) {
  const { student, status, submittedAt, grade, plagiarismScore, id } =
    submission;

  const getStatusBadge = () => {
    switch (status.toUpperCase()) {
      case "GRADED":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            <CheckCircle className="h-3 w-3 mr-1" /> Dinilai
          </Badge>
        );
      case "SUBMITTED":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" /> Submitted
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <Edit className="h-3 w-3 mr-1" /> Draft
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" /> Belum Submit
          </Badge>
        );
    }
  };

  return (
    <motion.tr
      className="border-t hover:bg-gray-50 transition-colors"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <td className="p-4">
        <div className="font-medium text-gray-900">{student.fullName}</div>
      </td>
      <td className="p-4">{getStatusBadge()}</td>
      <td className="p-4 text-gray-600 text-sm">
        {submittedAt ? formatDateTime(submittedAt) : "-"}
      </td>
      <td className="p-4">
        {plagiarismScore !== null ? (
          <div
            className={`font-semibold ${
              plagiarismScore > 30
                ? "text-red-600"
                : plagiarismScore > 15
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {plagiarismScore}%
          </div>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        )}
      </td>
      <td className="p-4 font-semibold text-gray-900">
        {grade !== null ? `${grade}/100` : "-"}
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-2">
          {status !== "PENDING" && (
            <>
              {plagiarismScore === null && status !== "DRAFT" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCheckPlagiarism(id)}
                >
                  <Shield className="h-4 w-4 mr-1" /> Cek
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => onGrade(id)}>
                <Eye className="h-4 w-4 mr-1" /> Detail
              </Button>
            </>
          )}
        </div>
      </td>
    </motion.tr>
  );
}
