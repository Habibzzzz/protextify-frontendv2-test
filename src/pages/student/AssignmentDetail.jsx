import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { assignmentsService, submissionsService } from "../../services";
import { formatDate } from "../../utils/helpers";
import {
  FileText,
  CheckCircle,
  Clock,
  Edit,
  AlertCircle,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Star,
  BookOpen,
} from "lucide-react";

export default function AssignmentDetail() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assignment & submission
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const assignmentData = await assignmentsService.getAssignmentById(
          assignmentId
        );
        setAssignment(assignmentData);

        if (assignmentData?.id) {
          const submissionData =
            await submissionsService.getSubmissionByAssignmentId(
              assignmentData.id
            );
          setSubmission(submissionData);
        }
      } catch (err) {
        setError({
          statusCode: err?.response?.data?.statusCode || err?.statusCode || 400,
          message:
            err?.response?.data?.message ||
            err?.message ||
            "Gagal memuat detail assignment",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [assignmentId]);

  // Loading/Error states
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
          <p>Gagal memuat detail assignment: {error.message}</p>
          <Button
            onClick={() => window.location.reload()}
            size="sm"
            className="mt-3"
          >
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!assignment) {
    return (
      <Container className="py-8">
        <Card>
          <CardContent className="text-center py-16">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Assignment Tidak Ditemukan
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Data assignment tidak tersedia atau Anda tidak memiliki akses.
            </p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Mapped data
  const className =
    submission?.assignment?.class?.name || assignment.class?.name || "-";
  const classId = assignment.classId;

  return (
    <Container className="py-8">
      <Breadcrumb />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
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
              {assignment.title}
            </h1>
            <Link
              to={`/dashboard/classes/${classId}`}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {className}
            </Link>
          </div>
        </div>
        <div className="flex-shrink-0">
          <StatusBadge submission={submission} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <AssignmentInfoCard assignment={assignment} />
          {submission?.status === "GRADED" && (
            <FeedbackCard submission={submission} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <SubmissionStatusCard
            assignment={assignment}
            submission={submission}
          />
          <ClassInfoCard classId={classId} className={className} />
        </div>
      </div>
    </Container>
  );
}

// --- Sub-components for better structure ---

function StatusBadge({ submission }) {
  if (!submission || submission.status === "DRAFT") {
    return (
      <Badge color="yellow" className="flex items-center gap-1.5 py-1.5 px-3">
        <Clock className="h-4 w-4" />
        Belum Dikumpulkan
      </Badge>
    );
  }
  if (submission.status === "SUBMITTED") {
    return (
      <Badge color="blue" className="flex items-center gap-1.5 py-1.5 px-3">
        <CheckCircle className="h-4 w-4" />
        Sudah Dikumpulkan
      </Badge>
    );
  }
  if (submission.status === "GRADED") {
    return (
      <Badge color="green" className="flex items-center gap-1.5 py-1.5 px-3">
        <Star className="h-4 w-4" />
        Sudah Dinilai
      </Badge>
    );
  }
  return (
    <Badge color="gray" className="flex items-center gap-1.5 py-1.5 px-3">
      <AlertCircle className="h-4 w-4" />
      Tidak Diketahui
    </Badge>
  );
}

function AssignmentInfoCard({ assignment }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50/50">
        <CardTitle className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-[#23407a]" />
          <span>Detail Tugas</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="prose max-w-none text-gray-800 mb-6">
          <div
            dangerouslySetInnerHTML={{
              __html: assignment.instructions || "Tidak ada instruksi.",
            }}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 border-t pt-4">
          <Calendar className="h-4 w-4 text-red-500" />
          <span className="font-medium">Deadline:</span>
          <span className="font-semibold text-red-600">
            {formatDate(assignment.deadline, "dd MMMM yyyy, HH:mm")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function SubmissionStatusCard({ assignment, submission }) {
  const navigate = useNavigate();
  const canSubmit = !submission || submission.status === "DRAFT";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Pengumpulan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow
          label="Status"
          value={<StatusBadge submission={submission} />}
        />
        <InfoRow
          label="Nilai"
          value={
            typeof submission?.grade === "number" ? (
              <span className="font-bold text-2xl text-green-600">
                {submission.grade}
              </span>
            ) : (
              <span className="text-gray-500">-</span>
            )
          }
        />
        <InfoRow
          label="Skor Plagiarisme"
          value={
            typeof (
              submission?.plagiarismChecks?.score ?? submission?.plagiarismScore
            ) === "number" ? (
              <span className="font-bold text-yellow-600 flex items-center">
                <ShieldCheck className="h-5 w-5 mr-1.5" />
                {(
                  submission.plagiarismChecks?.score ??
                  submission.plagiarismScore
                ).toFixed(2)}
                %
              </span>
            ) : (
              <span className="text-gray-500">-</span>
            )
          }
        />
        <InfoRow
          label="Waktu Kumpul"
          value={
            submission?.submittedAt
              ? formatDate(submission.submittedAt, "dd MMM yyyy, HH:mm")
              : "-"
          }
        />

        <div className="pt-4 border-t">
          {canSubmit ? (
            <Button
              size="lg"
              className="w-full bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg hover:shadow-xl transition-all"
              onClick={() =>
                navigate(`/dashboard/assignments/${assignment.id}/write`)
              }
            >
              <Edit className="h-5 w-5 mr-2" />
              {submission ? "Lanjutkan Mengerjakan" : "Mulai Mengerjakan"}
            </Button>
          ) : (
            <div className="text-center p-3 bg-gray-100 rounded-lg">
              <p className="text-sm font-medium text-gray-700">
                Tugas sudah dikumpulkan dan tidak dapat diubah.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function FeedbackCard({ submission }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nilai & Feedback Instruktur</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-gray-800">
            {submission.feedback || "Belum ada feedback dari instruktur."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ClassInfoCard({ classId, className }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Kelas</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-semibold text-gray-800 mb-3">{className}</p>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to={`/dashboard/classes/${classId}`}>
            <BookOpen className="h-4 w-4 mr-2" />
            Lihat Detail Kelas
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <div className="text-sm text-gray-900 text-right">{value}</div>
    </div>
  );
}
