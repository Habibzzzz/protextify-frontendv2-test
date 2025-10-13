// src/components/plagiarism/PlagiarismReport.jsx
import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Eye,
  Copy,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { plagiarismService } from "../../services";
import toast from "react-hot-toast";

export default function PlagiarismReport({
  submissionId,
  score,
  onViewDetails,
}) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);

  useEffect(() => {
    if (score !== null && score > 0) {
      fetchReport();
    }
  }, [submissionId, score]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const reportData = await plagiarismService.getPlagiarismReport(
        submissionId
      );
      setReport(reportData);
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Gagal memuat laporan plagiarisme");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      if (report?.pdfReportUrl) {
        window.open(report.pdfReportUrl, "_blank");
      } else {
        toast.error("Laporan PDF tidak tersedia");
      }
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Gagal mengunduh laporan");
    }
  };

  const getScoreColor = (score) => {
    if (score > 30) return "text-red-600 bg-red-100";
    if (score > 15) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getScoreIcon = (score) => {
    if (score > 30) return <AlertTriangle className="h-5 w-5" />;
    if (score > 15) return <AlertTriangle className="h-5 w-5" />;
    return <CheckCircle className="h-5 w-5" />;
  };

  const formatPercentage = (value) => {
    return `${Math.round(value * 100) / 100}%`;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum Ada Laporan
          </h3>
          <p className="text-gray-600">
            Lakukan pengecekan plagiarisme terlebih dahulu untuk melihat
            laporan.
          </p>
        </div>
      </Card>
    );
  }

  // Mapping field sesuai BE (dengan fallback agar aman)
  const { detailedResults } = report;
  const { result = {}, sources = [] } = detailedResults || {};
  const totalSources = Array.isArray(sources) ? sources.length : 0;
  const totalWords =
    typeof result.textWordCounts === "number"
      ? result.textWordCounts
      : typeof report.wordCount === "number"
      ? report.wordCount
      : 0;
  const totalPlagiarism =
    typeof result.totalPlagiarismWords === "number"
      ? result.totalPlagiarismWords
      : 0;
  const credits =
    typeof report.creditsUsed === "number"
      ? report.creditsUsed
      : typeof report.credits_used === "number"
      ? report.credits_used
      : 0;

  return (
    <>
      <Card className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getScoreIcon(score)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Laporan Plagiarisme
                </h3>
                <p className="text-sm text-gray-600">
                  Dicek pada{" "}
                  {new Date(report.checkedAt).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModal(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Detail
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReport}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${getScoreColor(score)}`}>
              <div className="text-2xl font-bold">
                {formatPercentage(score)}
              </div>
              <div className="text-sm font-medium">Skor Plagiarisme</div>
            </div>

            <div className="p-4 bg-blue-100 text-blue-800 rounded-lg">
              <div className="text-2xl font-bold">{totalSources}</div>
              <div className="text-sm font-medium">Sumber Ditemukan</div>
            </div>

            <div className="p-4 bg-purple-100 text-purple-800 rounded-lg">
              <div className="text-2xl font-bold">{totalPlagiarism}</div>
              <div className="text-sm font-medium">Kata Terdeteksi</div>
            </div>
          </div>

          {/* Top Sources */}
          {sources.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Sumber Utama Plagiarisme
              </h4>
              <div className="space-y-2">
                {sources.slice(0, 3).map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedSource(source)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {source.title || source.url}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {source.url}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge
                        variant={
                          source.score > 80
                            ? "danger"
                            : source.score > 50
                            ? "warning"
                            : "info"
                        }
                      >
                        {formatPercentage(source.score)}
                      </Badge>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>

              {sources.length > 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(true)}
                  className="mt-2"
                >
                  Lihat {sources.length - 3} sumber lainnya
                </Button>
              )}
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900">{totalWords}</div>
              <div className="text-sm text-gray-600">Total Kata</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-red-600">
                {result?.identicalWordCounts ?? 0}
              </div>
              <div className="text-sm text-gray-600">Kata Identik</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-yellow-600">
                {result?.similarWordCounts ?? 0}
              </div>
              <div className="text-sm text-gray-600">Kata Mirip</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-blue-600">
                {credits}
              </div>
              <div className="text-sm text-gray-600">Kredit Digunakan</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Detail Laporan Plagiarisme"
        size="xl"
      >
        <div className="space-y-6">
          {/* All Sources */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Semua Sumber ({sources.length})
            </h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sources.map((source, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 mb-1">
                        {source.title || "Untitled"}
                      </div>
                      <div className="text-sm text-blue-600 hover:text-blue-800 mb-2">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate block"
                        >
                          {source.url}
                        </a>
                      </div>
                      {source.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {source.description}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <Badge
                        variant={
                          source.score > 80
                            ? "danger"
                            : source.score > 50
                            ? "warning"
                            : "info"
                        }
                        className="mb-2"
                      >
                        {formatPercentage(source.score)}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        {source.plagiarismWords} kata
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-2">
                    <div>
                      <span className="text-gray-500">Identik:</span>
                      <span className="ml-1 font-medium">
                        {source.identicalWordCounts}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Mirip:</span>
                      <span className="ml-1 font-medium">
                        {source.similarWordCounts}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <span className="ml-1 font-medium">
                        {source.totalNumberOfWords}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Dapat diakses:</span>
                      <span
                        className={`ml-1 font-medium ${
                          source.canAccess ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {source.canAccess ? "Ya" : "Tidak"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
