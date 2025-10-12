import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Save,
  FileText,
  User,
  Calendar,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  Download,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Textarea,
  Alert,
  Breadcrumb,
  Badge,
  LoadingSpinner,
} from "../../components";
import { submissionsService } from "../../services";
import { useAsyncData } from "../../hooks";
import { formatDateTime } from "../../utils/helpers";
import { gradeSubmissionSchema } from "../../utils/validation";

export default function GradeSubmission() {
  const { submissionId } = useParams();
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

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(gradeSubmissionSchema),
  });

  useEffect(() => {
    if (submission) {
      reset({
        grade: submission.grade || "",
        feedback: submission.feedback || "",
      });
    }
  }, [submission, reset]);

  const gradeValue = watch("grade");

  const onSubmit = async (data) => {
    const payload = {
      grade: Number(data.grade),
      feedback: data.feedback,
    };

    await toast.promise(
      submissionsService.gradeSubmission(submissionId, payload),
      {
        loading: "Menyimpan nilai...",
        success: () => {
          navigate(-1); // Kembali ke halaman sebelumnya
          return "Nilai berhasil disimpan!";
        },
        error: (err) => err.response?.data?.message || "Gagal menyimpan nilai.",
      }
    );
  };

  const handleDownload = async (format) => {
    toast.promise(submissionsService.downloadSubmission(submissionId, format), {
      loading: `Membuat file ${format.toUpperCase()}...`,
      success: (response) => {
        window.open(response.url, "_blank");
        return "File siap diunduh!";
      },
      error: (err) => err.response?.data?.message || "Gagal mengunduh file.",
    });
  };

  const getScoreColor = (score) => {
    if (score === null || score === undefined || score === "")
      return "text-gray-400";
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreGrade = (score) => {
    if (score === null || score === undefined || score === "") return "-";
    if (score >= 85) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "E";
  };

  const getPlagiarismLevel = (score) => {
    if (score === null || score === undefined)
      return { level: "Belum Dicek", color: "gray", variant: "outline" };
    if (score < 10)
      return { level: "Sangat Rendah", color: "green", variant: "success" };
    if (score < 20) return { level: "Rendah", color: "blue", variant: "info" };
    if (score < 40)
      return { level: "Sedang", color: "yellow", variant: "warning" };
    return { level: "Tinggi", color: "red", variant: "error" };
  };

  if (loading) {
    return (
      <Container className="py-6 flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </Container>
    );
  }

  if (error || !submission) {
    return (
      <Container className="py-6">
        <Alert variant="error" title="Gagal Memuat Data">
          <p>
            {error?.message ||
              "Submission tidak ditemukan atau Anda tidak memiliki akses."}
          </p>
          <Button onClick={refetch} size="sm" className="mt-4">
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  const plagiarismScore = submission.plagiarismChecks?.score;
  const plagiarismInfo = getPlagiarismLevel(plagiarismScore);

  return (
    <Container className="py-6 max-w-7xl">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/instructor/dashboard" },
          {
            label: "Kelas",
            href: `/instructor/classes/${submission.assignment?.class?.id}`,
          },
          {
            label: "Detail Tugas",
            href: `/instructor/assignments/${submission.assignmentId}`,
          },
          { label: "Beri Nilai" },
        ]}
      />

      <div className="flex items-center justify-between my-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Beri Nilai Tugas
            </h1>
            <p className="text-gray-600 mt-1">
              {submission.assignment?.class?.name} •{" "}
              {submission.assignment?.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload("pdf")}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-[#23407a]" />
                Informasi Mahasiswa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Nama Lengkap
                </label>
                <p className="text-gray-900 font-semibold mt-1">
                  {submission.student?.fullName}
                </p>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Waktu Submit
                </div>
                <p className="text-gray-900 font-medium">
                  {formatDateTime(submission.submittedAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`border-2 ${
              plagiarismScore < 10
                ? "border-green-200 bg-green-50"
                : plagiarismScore < 20
                ? "border-blue-200 bg-blue-50"
                : plagiarismScore < 40
                ? "border-yellow-200 bg-yellow-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle
                  className={`h-5 w-5 mr-2 ${
                    plagiarismScore < 10
                      ? "text-green-600"
                      : plagiarismScore < 20
                      ? "text-blue-600"
                      : plagiarismScore < 40
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                />
                Hasil Cek Plagiarisme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div
                  className={`text-5xl font-bold mb-2 ${
                    plagiarismScore < 10
                      ? "text-green-600"
                      : plagiarismScore < 20
                      ? "text-blue-600"
                      : plagiarismScore < 40
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {plagiarismScore !== null && plagiarismScore !== undefined
                    ? `${plagiarismScore}%`
                    : "-"}
                </div>
                <Badge variant={plagiarismInfo.variant} className="text-sm">
                  {plagiarismInfo.level}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Eye className="h-5 w-5 mr-2 text-[#23407a]" />
                Konten Tugas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose max-w-none bg-gray-50 rounded-lg p-6 border border-gray-200 h-96 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: submission.content || "Tidak ada konten." }}
              />
            </CardContent>
          </Card>

          <Card className="border-2 border-[#23407a]/20">
            <CardHeader className="bg-gradient-to-r from-[#23407a]/5 to-[#3b5fa4]/5">
              <CardTitle className="text-lg flex items-center">
                <Star className="h-5 w-5 mr-2 text-[#23407a]" />
                Penilaian
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nilai <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        {...register("grade", { valueAsNumber: true })}
                        placeholder="0 - 100"
                        className="text-lg font-semibold"
                        error={errors.grade?.message}
                      />
                    </div>
                    <div className="text-center min-w-[120px] p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <div
                        className={`text-3xl font-bold ${getScoreColor(
                          gradeValue
                        )}`}
                      >
                        {gradeValue || "-"}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">/ 100</div>
                      <Badge variant="outline" className="mt-2">
                        Grade: {getScoreGrade(gradeValue)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback untuk Mahasiswa
                  </label>
                  <Textarea
                    {...register("feedback")}
                    rows={8}
                    placeholder="Berikan feedback yang konstruktif..."
                    className="resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#23407a] hover:bg-[#1a2f5c]"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Simpan Nilai
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
