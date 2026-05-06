/**
 * Mapping utama:
 * - submissionsService.getSubmissionById(submissionId) -> detail submission
 * - submissionsService.downloadSubmission(submissionId, format) -> { filename, url, size }
 * - plagiarismService.getPlagiarismReport(submissionId) -> report (jika tersedia)
 * - Tidak render data/fitur yang tidak dikirim BE.
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { submissionsService, plagiarismService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import {
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Eye,
  ArrowLeft,
  Calendar,
  Star,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/helpers";
import { motion } from "framer-motion";

export default function SubmissionDetail() {
  const { id: submissionId } = useParams();
  const navigate = useNavigate();

  const {
    data: submission,
    loading,
    error,
    refetch,
  } = useAsyncData(
    () => submissionsService.getSubmissionById(submissionId),
    [submissionId]
  );

  const [downloading, setDownloading] = useState(false);

  // Download file handler
  const handleDownload = async (format = "pdf") => {
    setDownloading(true);
    try {
      const result = await submissionsService.downloadSubmission(
        submissionId,
        format
      );
      if (result.url) {
        window.open(result.url, "_blank");
        toast.success(`File ${format.toUpperCase()} berhasil diunduh`);
      } else {
        toast.error("URL file tidak tersedia");
      }
    } catch (err) {
      toast.error("Gagal mengunduh file");
    } finally {
      setDownloading(false);
    }
  };

  // Navigate to plagiarism report page
  const handleViewPlagiarismReport = () => {
    navigate(`/dashboard/submissions/${submissionId}/plagiarism-report`);
  };

  // Loading state
  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <Alert variant="error">
          <p>Gagal memuat detail submission: {error.message}</p>
          <Button onClick={refetch} size="sm" className="mt-3">
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!submission) {
    return (
      <Container className="py-8">
        <Card>
          <CardContent className="text-center py-16">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Submission Tidak Ditemukan
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Data submission tidak tersedia atau Anda tidak memiliki akses.
            </p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Mapping field
  const assignmentTitle = submission.assignment?.title || "-";
  const className = submission.assignment?.class?.name || "-";
  const plagiarismScore =
    typeof submission.plagiarismScore === "number"
      ? submission.plagiarismScore
      : submission.plagiarismChecks?.score;

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
      {/* Header Section */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#162849] rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"></div>
        <div className="relative px-8 py-10">
          <div className="flex flex-col">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard/submissions")}
              className="mr-auto mb-4 text-white/80 hover:text-white hover:bg-white/10 w-fit"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Riwayat
            </Button>
            <div>
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-white/70 text-sm font-medium">
                  Detail Submission
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                {assignmentTitle}
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Kelas: {className}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb />

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <ContentPreviewCard content={submission.content} />
          <EditorAttachmentCard onDownload={handleDownload} downloading={downloading} />
          <AssignmentInfoCard assignment={submission.assignment} />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <StatusCard submission={submission} />
          <ActionsCard
            onDownload={handleDownload}
            onViewPlagiarismReport={handleViewPlagiarismReport}
            downloading={downloading}
            plagiarismScore={plagiarismScore}
          />
        </div>
      </motion.div>
    </Container>
  );
}

// --- Sub-components for better structure ---

function StatusCard({ submission }) {
  const grade = typeof submission.grade === "number" ? submission.grade : null;
  const plagiarismScore =
    typeof submission.plagiarismScore === "number"
      ? submission.plagiarismScore
      : submission.plagiarismChecks?.score;

  const getStatusInfo = (status) => {
    switch (status) {
      case "DRAFT":
        return {
          label: "Draft",
          icon: FileText,
          color: "bg-yellow-100 text-yellow-800",
        };
      case "SUBMITTED":
        return {
          label: "Dikumpulkan",
          icon: CheckCircle,
          color: "bg-blue-100 text-blue-800",
        };
      case "GRADED":
        return {
          label: "Dinilai",
          icon: Star,
          color: "bg-green-100 text-green-800",
        };
      default:
        return {
          label: "Tidak Diketahui",
          icon: AlertCircle,
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  const statusInfo = getStatusInfo(submission.status);
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${statusInfo.color}`}>
            <StatusIcon className="h-5 w-5" />
          </div>
          <span>Status: {statusInfo.label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-700">Nilai</p>
            <p className="text-3xl font-bold text-green-800">
              {grade !== null ? grade : "-"}
            </p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm font-medium text-yellow-700">Plagiarisme</p>
            <p className="text-3xl font-bold text-yellow-800">
              {plagiarismScore !== undefined && plagiarismScore !== null
                ? `${plagiarismScore}%`
                : "-"}
            </p>
          </div>
        </div>
        <InfoRow
          label="Dikumpulkan Pada"
          value={
            submission.submittedAt
              ? formatDate(submission.submittedAt)
              : "Belum dikumpulkan"
          }
        />
        <InfoRow
          label="Terakhir Diperbarui"
          value={formatDate(submission.updatedAt)}
        />
      </CardContent>
    </Card>
  );
}

function ActionsCard({
  onDownload,
  onViewPlagiarismReport,
  downloading,
  plagiarismScore,
}) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Tindakan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          size="lg"
          className="w-full bg-[#23407a] hover:bg-[#1a2f5c]"
          onClick={() => onDownload("pdf")}
          loading={downloading}
          aria-label="Download PDF"
        >
          <Download className="h-5 w-5 mr-2" />
          Download PDF
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full"
          onClick={() => onDownload("docx")}
          loading={downloading}
          aria-label="Download DOCX"
        >
          <Download className="h-5 w-5 mr-2" />
          Download DOCX
        </Button>
        {plagiarismScore !== undefined && plagiarismScore !== null && (
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={onViewPlagiarismReport}
            aria-label="Lihat Laporan Plagiarisme"
          >
            <ShieldCheck className="h-5 w-5 mr-2" />
            Lihat Laporan Plagiarisme
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function AssignmentInfoCard({ assignment }) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Informasi Tugas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow label="Judul Tugas" value={assignment?.title} />
        <InfoRow
          label="Deadline"
          value={formatDate(assignment?.deadline)}
          valueColor="text-red-600"
        />
      </CardContent>
    </Card>
  );
}

function ContentPreviewCard({ content }) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Konten Submission</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none h-64 overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div dangerouslySetInnerHTML={{ __html: content || "Tidak ada konten." }} />
        </div>
      </CardContent>
    </Card>
  );
}

function EditorAttachmentCard({ onDownload, downloading }) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Lampiran (Dari Konten Editor)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Protextify tidak memakai upload file untuk tugas ini. Lampiran dibuat
          otomatis dari konten editor dan bisa diunduh sebagai PDF atau DOCX.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => onDownload("pdf")}
            loading={downloading}
            aria-label="Unduh attachment PDF"
          >
            <FileText className="h-4 w-4 mr-2" />
            Attachment PDF
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => onDownload("docx")}
            loading={downloading}
            aria-label="Unduh attachment DOCX"
          >
            <FileText className="h-4 w-4 mr-2" />
            Attachment DOCX
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value, valueColor = "text-gray-900" }) {
  return (
    <div>
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <p className={`font-semibold ${valueColor} mt-1`}>{value || "-"}</p>
    </div>
  );
}
