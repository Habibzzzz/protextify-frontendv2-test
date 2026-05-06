import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Grid,
  Button,
  Badge,
  LoadingSpinner,
  Alert,
} from "../../components";
import { Breadcrumb } from "../../components/layout";
import { StatCard } from "../../components/dashboard";
import { AnalyticsChart } from "../../components/instructor";
import { analyticsService } from "../../services";

export default function InstructorAnalytics() {
  const [range, setRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching analytics data for range:", range);
      console.log("Token:", localStorage.getItem("token"));
      const data = await analyticsService.getInstructorAnalytics(range);
      console.log("Analytics data received:", data);
      setAnalyticsData(data);
    } catch (err) {
      console.error("Analytics API Error:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
      });
      const errorMessage =
        err.response?.data?.message ||
        "Gagal memuat data analytics. Silakan coba lagi.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" />
          <p className="ml-4 text-gray-600">Memuat data analytics...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="error" title="Terjadi Kesalahan">
          <p>{error}</p>
          <Button onClick={fetchData} size="sm" className="mt-4">
            Coba Lagi
          </Button>
        </Alert>
      );
    }

    if (!analyticsData) {
      console.log("analyticsData is null/undefined:", analyticsData);
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Data tidak tersedia.</p>
        </div>
      );
    }

    const { stats, charts } = analyticsData;

    const completionRateTrend = stats?.trend?.completionRate;
    const trendObj = completionRateTrend
      ? {
          change: Math.abs(Number(completionRateTrend)),
          isPositive: String(completionRateTrend).startsWith("+"),
        }
      : null;

    return (
      <div className="space-y-12">
        {/* Top Stats */}
        <Grid cols={1} mdCols={3} lgCols={6} gap={6}>
          <StatCard
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            icon={TrendingUp}
            trend={trendObj}
            color="green"
          />
          <StatCard
            title="Rata-rata Plagiarisme"
            value={`${stats.avgPlagiarism}%`}
            icon={AlertCircle}
            color="red"
          />
          <StatCard
            title="Total Submission"
            value={stats.totalSubmissions}
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Sudah Dinilai"
            value={stats.gradedSubmissions}
            icon={CheckCircle}
            color="purple"
          />
          <StatCard
            title="Menunggu Nilai"
            value={stats.pendingGrading}
            icon={Clock}
            color="yellow"
          />
          <StatCard
            title="Kelas Aktif"
            value={stats.activeClasses}
            icon={Users}
            color="blue"
          />
        </Grid>

        {/* Charts */}
        <div className="space-y-8">
          <Grid cols={1} lgCols={2} gap={8}>
            <AnalyticsChart
              data={charts.submissionTrends}
              title="Tren Submission & Penilaian"
              type="line"
              xAxisKey="date"
              dataKeys={["submissions", "graded"]}
              colors={["#3b82f6", "#16a34a"]}
            />
            <AnalyticsChart
              data={charts.gradingSpeed}
              title="Kecepatan Penilaian (Rata-rata Jam)"
              type="area"
              xAxisKey="date"
              dataKey="avgHours"
              colors={["#8b5cf6"]}
            />
          </Grid>

          <Grid cols={1} lgCols={2} gap={8}>
            <AnalyticsChart
              data={charts.classActivity}
              title="Aktivitas per Kelas"
              type="bar"
              xAxisKey="name"
              dataKey="submissions"
            />
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Calendar className="w-5 h-5 mr-2 text-[#23407a]" />{" "}
                  Distribusi Plagiarisme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  data={charts.plagiarismDistribution}
                  title=""
                  type="bar"
                  xAxisKey="range"
                  dataKey="count"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {charts.plagiarismDistribution.map((item) => (
                    <Badge key={item.range} variant="outline">
                      {item.range}: {item.count}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </div>
      </div>
    );
  };

  return (
    <Container className="py-6">
      <Breadcrumb />
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#162849] rounded-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
        <Container className="relative py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-white/70 text-sm font-medium">
                  Instructor Dashboard
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Analytics Performa 
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Dapatkan wawasan mendalam tentang aktivitas kelas, submission
                siswa, dan efektivitas penilaian Anda.
              </p>
            </div>
            <div className="flex items-center gap-2 p-1 bg-black/20 rounded-lg mt-6 lg:mt-0 backdrop-blur-sm border border-white/10">
              {["7d", "30d", "90d"].map((r) => (
                <Button
                  key={r}
                  variant={range === r ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setRange(r)}
                  className={`transition-all duration-200 ${
                    range === r
                      ? "bg-white text-[#23407a] shadow-md"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {r.replace("d", " Hari")}
                </Button>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <Container className="pb-12">
        {renderContent()}
        <div className="mt-8 flex justify-end">
          <Button
            size="sm"
            className="bg-[#23407a] hover:bg-[#1a2f5c] text-white"
            onClick={() => navigate("/instructor/classes")}
          >
            <Users className="h-4 w-4 mr-2" />
            Lihat Kelas
          </Button>
        </div>
      </Container>
    </Container>
  );
}
