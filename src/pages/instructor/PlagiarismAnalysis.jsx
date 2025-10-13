import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  BarChart3,
  Search,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Star,
  Users,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  LoadingSpinner,
  Breadcrumb,
  Alert,
} from "../../components";
import {
  PlagiarismReport,
  SourceHighlighter,
  PlagiarismTrigger,
} from "../../components/plagiarism";
import { submissionsService, plagiarismService } from "../../services";
import { useAsyncData } from "../../hooks";

export default function PlagiarismAnalysis() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const fetchAnalysisData = useCallback(async () => {
    const submissionData = await submissionsService.getSubmissionById(
      submissionId
    );
    let plagiarismReportData = null;
    if (submissionData.plagiarismChecks?.score !== null) {
      try {
        plagiarismReportData = await plagiarismService.getPlagiarismReport(
          submissionId
        );
      } catch (error) {
        // Report might not exist yet, this is not a fatal error
        console.warn("Plagiarism report not found, but check exists:", error);
      }
    }
    return { submission: submissionData, report: plagiarismReportData };
  }, [submissionId]);

  const {
    data,
    loading,
    error,
    refetch: refreshData,
  } = useAsyncData(fetchAnalysisData, [fetchAnalysisData]);

  const { submission, report } = data || {};

  const handleNewCheck = () => {
    setActiveTab("trigger");
  };

  const handleCheckStarted = () => {
    toast.success(
      "Pengecekan plagiarisme dimulai. Hasil akan diperbarui dalam beberapa saat."
    );
    setActiveTab("overview");
    setTimeout(refreshData, 5000); // Refresh data after 5s to get initial status
  };

  const handleDownloadPDF = () => {
    if (report?.pdfReportUrl) {
      window.open(report.pdfReportUrl, "_blank");
      toast.success("Laporan PDF sedang diunduh.");
    } else {
      toast.error("URL Laporan PDF tidak tersedia.");
    }
  };

  if (loading) {
    return (
      <Container className="py-8 flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </Container>
    );
  }

  if (error || !submission) {
    return (
      <Container className="py-8">
        <Alert variant="error" title="Gagal Memuat Data">
          <p>
            {error?.message ||
              "Submission tidak ditemukan atau Anda tidak memiliki akses."}
          </p>
          <Button onClick={refreshData} size="sm" className="mt-4">
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  const plagiarismScore = submission.plagiarismChecks?.score;
  const sources = report?.detailedResults?.sources || [];

  const tabs = [
    { id: "overview", label: "Ringkasan", icon: BarChart3 },
    { id: "content", label: "Analisis Konten", icon: FileText },
    { id: "sources", label: "Sumber", icon: Search },
    { id: "trigger", label: "Cek Ulang", icon: RefreshCw },
  ];

  return (
    <Container className="py-8 max-w-7xl">
      <Breadcrumb />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-8">
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
              Analisis Plagiarisme
            </h1>
            <p className="text-gray-600">
              {submission.student?.fullName} • {submission.assignment?.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={refreshData}
            loading={loading}
            aria-label="Refresh data"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {report?.pdfReportUrl && (
            <Button
              onClick={handleDownloadPDF}
              className="bg-[#23407a] hover:bg-[#1a2f5c]"
              aria-label="Download Laporan PDF"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <Card className="border-0 shadow-lg mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <StatItem
              icon={AlertTriangle}
              label="Skor Plagiarisme"
              value={
                plagiarismScore !== null && plagiarismScore !== undefined
                  ? `${plagiarismScore}%`
                  : "N/A"
              }
              color={
                plagiarismScore > 30
                  ? "red"
                  : plagiarismScore > 15
                  ? "yellow"
                  : "green"
              }
            />
            <StatItem
              icon={CheckCircle}
              label="Status"
              value={submission.status}
              color="blue"
            />
            <StatItem
              icon={FileText}
              label="Jumlah Kata"
              value={report?.wordCount || "-"}
              color="gray"
            />
            <StatItem
              icon={Star}
              label="Nilai"
              value={submission.grade ?? "Belum Dinilai"}
              color="purple"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <TabsContent value="overview">
            <PlagiarismReport
              submissionId={submissionId}
              score={plagiarismScore}
              onViewDetails={() => setActiveTab("content")}
            />
          </TabsContent>

          <TabsContent value="content">
            <SourceHighlighter
              content={submission.content}
              plagiarismIndexes={report?.detailedResults?.indexes || []}
              sources={sources}
            />
          </TabsContent>

          <TabsContent value="sources">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>
                  Sumber Plagiarisme Terdeteksi ({sources.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sources.length > 0 ? (
                  <div className="space-y-4">
                    {sources.map((source, index) => (
                      <SourceCard key={index} source={source} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p className="font-medium text-lg text-gray-800">
                      Tidak ada sumber plagiarisme yang terdeteksi.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trigger">
            <PlagiarismTrigger
              submissionId={submissionId}
              onCheckStarted={handleCheckStarted}
              disabled={submission.status === "DRAFT"}
              currentScore={plagiarismScore}
            />
          </TabsContent>
        </motion.div>
      </Tabs>
    </Container>
  );
}

function StatItem({ icon: Icon, label, value, color }) {
  const colors = {
    red: "text-red-600 bg-red-100",
    yellow: "text-yellow-600 bg-yellow-100",
    green: "text-green-600 bg-green-100",
    blue: "text-blue-600 bg-blue-100",
    purple: "text-purple-600 bg-purple-100",
    gray: "text-gray-600 bg-gray-100",
  };
  return (
    <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
      <div className={`p-3 rounded-full mb-3 ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function SourceCard({ source }) {
  const getScoreColor = (score) => {
    if (score > 80) return "text-red-600";
    if (score > 50) return "text-yellow-600";
    return "text-blue-600";
  };
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-1 truncate">
            {source.title || "Sumber Tidak Dikenal"}
          </h4>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm truncate flex items-center gap-1"
          >
            {source.url} <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="text-right ml-4">
          <div className={`text-xl font-bold ${getScoreColor(source.score)}`}>
            {Math.round(source.score)}%
          </div>
          <div className="text-sm text-gray-500">
            {source.plagiarismWords} kata
          </div>
        </div>
      </div>
      {source.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {source.description}
        </p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm pt-3 border-t">
        <SourceStat label="Identik" value={source.identicalWordCounts} />
        <SourceStat label="Mirip" value={source.similarWordCounts} />
        <SourceStat label="Total" value={source.totalNumberOfWords} />
        <SourceStat
          label="Akses"
          value={source.canAccess ? "Ya" : "Tidak"}
          valueColor={source.canAccess ? "text-green-600" : "text-red-600"}
        />
      </div>
    </div>
  );
}

function SourceStat({ label, value, valueColor = "text-gray-900" }) {
  return (
    <div>
      <span className="text-gray-500">{label}:</span>
      <span className={`ml-1.5 font-semibold ${valueColor}`}>{value}</span>
    </div>
  );
}
