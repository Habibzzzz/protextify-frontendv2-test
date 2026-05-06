/**
 * Mapping utama:
 * - submissionsService.getHistory() -> array submission
 * - Field submission: id, assignmentId, content, status, grade, createdAt, updatedAt, submittedAt, assignment (id, title, deadline, class { name }), plagiarismChecks
 * - Tidak render data/fitur yang tidak dikirim BE.
 */

import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge,
} from "../../components";
import { submissionsService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import {
  FileText,
  CheckCircle,
  Clock,
  Star,
  ShieldCheck,
  Eye,
  Inbox,
} from "lucide-react";
import { formatDate } from "../../utils/helpers";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentSubmissions() {
  const location = useLocation();
  const {
    data: submissions,
    loading,
    error,
    refetch,
  } = useAsyncData(() => submissionsService.getHistory(), [], {
    refetchOnWindowFocus: true,
    pollIntervalMs: 10000,
  });

  const [activeTab, setActiveTab] = useState("all");

  // Refetch when redirected after submit
  useEffect(() => {
    if (location.state?.refresh) {
      refetch();
    }
  }, [location.state?.refresh, refetch]);

  const filteredSubmissions = useMemo(() => {
    if (!submissions) return [];
    if (activeTab === "all") return submissions;
    return submissions.filter((s) => s.status.toLowerCase() === activeTab);
  }, [submissions, activeTab]);

  const tabCounts = useMemo(() => {
    if (!submissions) return { all: 0, graded: 0, submitted: 0, draft: 0 };
    return {
      all: submissions.length,
      graded: submissions.filter((s) => s.status === "GRADED").length,
      submitted: submissions.filter((s) => s.status === "SUBMITTED").length,
      draft: submissions.filter((s) => s.status === "DRAFT").length,
    };
  }, [submissions]);

  const tabs = [
    { value: "all", label: "Semua", count: tabCounts.all },
    { value: "graded", label: "Dinilai", count: tabCounts.graded },
    { value: "submitted", label: "Dikumpulkan", count: tabCounts.submitted },
    { value: "draft", label: "Draft", count: tabCounts.draft },
  ];

  return (
    <Container className="py-8">
      {/* Header Section */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#162849] rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"></div>
        <div className="relative px-8 py-10">
          <div className="flex flex-col">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-white/70 text-sm font-medium">
                  Riwayat
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Riwayat Pengumpulan Tugas
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Lacak semua tugas yang telah Anda kerjakan, lihat nilai, dan
                periksa skor plagiarisme di satu tempat.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb />

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Alert variant="error" className="mb-8">
          <p>Gagal memuat riwayat submission: {error.message}</p>
          <Button size="sm" onClick={refetch} className="mt-3">
            Coba Lagi
          </Button>
        </Alert>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 grid w-full grid-cols-2 sm:grid-cols-4 gap-2 rounded-xl bg-gray-100 p-2 shadow-inner">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
                <span className="ml-2 text-xs bg-gray-200 data-[state=active]:bg-white/30 rounded px-2 py-0.5">
                  {tab.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value={activeTab}>
                {filteredSubmissions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredSubmissions.map((submission, index) => (
                      <SubmissionCard
                        key={submission.id}
                        submission={submission}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState tab={activeTab} />
                )}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      )}
    </Container>
  );
}

// Modernized Submission Card Component
function SubmissionCard({ submission, index }) {
  const assignmentTitle = submission.assignment?.title || "-";
  const className = submission.assignment?.class?.name || "-";
  const grade = typeof submission.grade === "number" ? submission.grade : null;
  const plagiarismScore =
    typeof submission.plagiarismScore === "number"
      ? submission.plagiarismScore
      : submission.plagiarismChecks?.score;
  const date = submission.submittedAt || submission.updatedAt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-0 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-blue-50"></div>

        <CardHeader className="relative z-10 border-b border-gray-200/80 bg-white/50 backdrop-blur-sm">
          <h3 className="font-bold text-gray-900 truncate">
            {assignmentTitle}
          </h3>
          <p className="text-sm text-gray-600">{className}</p>
        </CardHeader>

        <CardContent className="relative z-10 flex flex-1 flex-col p-6">
          <div className="flex-1 space-y-4">
            <InfoBadge
              icon={getStatusIcon(submission.status)}
              label={getStatusLabel(submission.status)}
              color={getStatusColor(submission.status)}
            />
            {grade !== null && (
              <InfoBadge icon={Star} label={`Nilai: ${grade}`} color="green" />
            )}
            {plagiarismScore !== undefined && plagiarismScore !== null && (
              <InfoBadge
                icon={ShieldCheck}
                label={`Plagiarisme: ${plagiarismScore}%`}
                color={getPlagiarismColor(plagiarismScore)}
              />
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200/80">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {submission.submittedAt ? "Dikumpulkan" : "Diperbarui"}:{" "}
                {formatDate(date, "dd MMM yyyy")}
              </p>
              <Button asChild size="sm" variant="outline">
                <Link to={`/dashboard/submissions/${submission.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Lihat Detail
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Helper component for info badges
function InfoBadge({ icon: Icon, label, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    gray: "bg-gray-100 text-gray-800",
    red: "bg-red-100 text-red-800",
  };
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${colors[color]}`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}

// Empty State Component
function EmptyState({ tab }) {
  const messages = {
    all: "Anda belum pernah mengumpulkan tugas.",
    graded: "Belum ada tugas yang dinilai.",
    submitted: "Tidak ada tugas yang sedang menunggu penilaian.",
    draft: "Anda tidak memiliki draft tugas.",
  };
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-blue-50/30">
      <CardContent className="text-center py-20 px-6">
        <Inbox className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Tidak Ada Submission
        </h3>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
          {messages[tab]}
        </p>
      </CardContent>
    </Card>
  );
}

// --- Status Helpers ---
const getStatusIcon = (status) => {
  switch (status) {
    case "GRADED":
      return Star;
    case "SUBMITTED":
      return CheckCircle;
    case "DRAFT":
      return Clock;
    default:
      return FileText;
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "GRADED":
      return "Dinilai";
    case "SUBMITTED":
      return "Dikumpulkan";
    case "DRAFT":
      return "Draft";
    default:
      return "Tidak Diketahui";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "GRADED":
      return "green";
    case "SUBMITTED":
      return "blue";
    case "DRAFT":
      return "yellow";
    default:
      return "gray";
  }
};

const getPlagiarismColor = (score) => {
  if (score >= 30) return "red";
  if (score >= 10) return "yellow";
  return "green";
};
