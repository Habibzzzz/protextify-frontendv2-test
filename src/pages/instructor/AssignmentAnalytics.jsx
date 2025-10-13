import { useParams, Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  FileText,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowLeft,
  RefreshCw,
  Eye,
  Users,
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
  Grid,
} from "../../components";
import { assignmentsService } from "../../services";
import { useAsyncData } from "../../hooks";
import { formatDate } from "../../utils/helpers";

export default function AssignmentAnalytics() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  // Single, efficient data fetching hook for the new endpoint
  const {
    data: analyticsData,
    loading,
    error,
    refetch,
  } = useAsyncData(
    () => assignmentsService.getAssignmentAnalytics(assignmentId),
    [assignmentId]
  );

  const handleRefresh = () => {
    toast.promise(refetch(), {
      loading: "Memuat ulang data...",
      success: "Data berhasil diperbarui!",
      error: "Gagal memperbarui data.",
    });
  };

  if (loading) {
    return (
      <Container className="py-6">
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" />
          <p className="ml-4 text-gray-600">Memuat data analytics...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-6">
        <Alert variant="error" title="Terjadi Kesalahan">
          <p>
            {error.response?.data?.message ||
              "Gagal memuat data analytics untuk tugas ini."}
          </p>
          <Button onClick={handleRefresh} size="sm" className="mt-4">
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!analyticsData) {
    return (
      <Container className="py-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Data analytics tidak tersedia.</p>
        </div>
      </Container>
    );
  }

  const { assignment, stats, submissions } = analyticsData;

  return (
    <Container className="py-6 space-y-8">
      {/* Header */}
      <div>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/instructor/dashboard" },
            {
              label: "Kelas",
              href: `/instructor/classes/${assignment.classId}`,
            },
            { label: "Analytics Tugas" },
          ]}
        />
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                navigate(`/instructor/classes/${assignment.classId}`)
              }
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {assignment.title}
              </h1>
              <p className="text-gray-600">Ringkasan performa submission.</p>
            </div>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <Grid cols={1} mdCols={2} lgCols={5} gap={6}>
        <StatCard
          title="Total Submission"
          value={stats.totalSubmissions}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Terkumpul"
          value={stats.submittedCount}
          icon={FileText}
          color="green"
        />
        <StatCard
          title="Sudah Dinilai"
          value={stats.gradedCount}
          icon={CheckCircle}
          color="purple"
        />
        <StatCard
          title="Rata-rata Nilai"
          value={stats.avgGrade.toFixed(1)}
          icon={Star}
          color="yellow"
        />
        <StatCard
          title="Rata-rata Plagiarisme"
          value={`${stats.avgPlagiarism.toFixed(1)}%`}
          icon={AlertCircle}
          color="red"
        />
      </Grid>

      {/* Submissions Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Submission ({submissions.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Siswa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nilai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plagiarisme
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Update Terakhir
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((s, index) => (
                  <SubmissionRow key={s.id} submission={s} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}

// --- Sub-components for better structure ---

function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "from-blue-100 to-blue-50 border-blue-200 text-blue-600",
    green: "from-green-100 to-green-50 border-green-200 text-green-600",
    purple: "from-purple-100 to-purple-50 border-purple-200 text-purple-600",
    red: "from-red-100 to-red-50 border-red-200 text-red-600",
    yellow: "from-yellow-100 to-yellow-50 border-yellow-200 text-yellow-600",
  };
  return (
    <Card
      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${colorClasses[color]}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-inner">
            <Icon className={`h-6 w-6 ${colorClasses[color]}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SubmissionRow({ submission, index }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "GRADED":
        return (
          <Badge variant="success">
            <CheckCircle className="h-3 w-3 mr-1" /> Dinilai
          </Badge>
        );
      case "SUBMITTED":
        return (
          <Badge variant="warning">
            <FileText className="h-3 w-3 mr-1" /> Terkumpul
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge variant="secondary">
            <FileText className="h-3 w-3 mr-1" /> Draft
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <motion.tr
      className="hover:bg-gray-50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
        {submission.student?.fullName || "-"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(submission.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
        {typeof submission.grade === "number" ? `${submission.grade}/100` : "-"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {typeof submission.plagiarismChecks?.score === "number" ? (
          <span
            className={`font-semibold ${
              submission.plagiarismChecks.score > 30
                ? "text-red-600"
                : submission.plagiarismChecks.score > 15
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {submission.plagiarismChecks.score.toFixed(1)}%
          </span>
        ) : (
          "-"
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(submission.updatedAt, "dd MMM yyyy, HH:mm")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <Link to={`/instructor/submissions/${submission.id}/grade`}>
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Detail
          </Button>
        </Link>
      </td>
    </motion.tr>
  );
}
