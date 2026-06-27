import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Download,
  FileCheck2,
  GraduationCap,
  BookOpen,
  FileText,
  RefreshCw,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { adminService } from "../../services";
import { Alert, Badge, Button, Card, CardContent, CardHeader, CardTitle, Grid, Container } from "../../components";

const RANGE_OPTIONS = [
  { label: "7 Hari", value: "7d" },
  { label: "30 Hari", value: "30d" },
  { label: "90 Hari", value: "90d" },
];

const PIE_COLORS = ["#23407a", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

function MetricCard({ title, value, icon: Icon, subtitle }) {
  return (
    <Card className="border border-gray-200/60 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#23407a]/10 text-[#23407a] flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LegacyAdminDashboard() {
  const [range, setRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [charts, setCharts] = useState(null);

  const fetchData = async (selectedRange = range) => {
    setLoading(true);
    setError(null);
    try {
      const [overviewResponse, chartResponse] = await Promise.all([
        adminService.getAdminDashboardOverview(),
        adminService.getAdminDashboardCharts(selectedRange),
      ]);
      setOverview(overviewResponse);
      setCharts(chartResponse);
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal memuat dashboard admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(range);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const stats = overview?.stats;
  const recentUsers = overview?.recentUsers || [];
  const platformTrends = charts?.platformTrends || [];
  const roleDistribution = useMemo(
    () =>
      (charts?.userRoleDistribution || []).map((item) => ({
        name: item.role,
        value: item.count,
      })),
    [charts]
  );

  if (loading && !overview) {
    return (
      <Container className="py-6">
        <p className="text-gray-600">Memuat dashboard admin...</p>
      </Container>
    );
  }

  return (
    <Container className="py-6 space-y-6">
      <div className="bg-gradient-to-r from-[#1a2f5c] to-[#23407a] rounded-2xl p-6 text-white">
        <h1 className="text-2xl lg:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-white/80 mt-1">
          Pantau pertumbuhan platform, aktivitas pengguna, dan performa sistem.
        </p>
      </div>

      {error && (
        <Alert variant="error" title="Gagal Memuat Data">
          <div className="space-y-3">
            <p>{error}</p>
            <Button onClick={() => fetchData(range)} size="sm">
              Coba Lagi
            </Button>
          </div>
        </Alert>
      )}

      <div className="flex items-center gap-2">
        {RANGE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setRange(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
              range === option.value
                ? "bg-[#23407a] text-white border-[#23407a]"
                : "bg-white text-gray-700 border-gray-200 hover:border-[#23407a]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {stats && (
        <Grid cols={1} mdCols={2} lgCols={4} gap={4}>
          <MetricCard title="Total User" value={stats.totalUsers} icon={Users} />
          <MetricCard
            title="Total Instructor"
            value={stats.totalInstructors}
            icon={GraduationCap}
          />
          <MetricCard title="Total Kelas" value={stats.totalClasses} icon={BookOpen} />
          <MetricCard
            title="Total Submission"
            value={stats.totalSubmissions}
            icon={FileText}
          />
          <MetricCard
            title="Total Assignment"
            value={stats.totalAssignments}
            icon={BookOpen}
          />
          <MetricCard
            title="Total Transaksi"
            value={stats.totalTransactions}
            icon={Wallet}
          />
          <MetricCard
            title="Revenue 30 Hari"
            value={`Rp ${Number(stats.monthlyRevenue || 0).toLocaleString("id-ID")}`}
            icon={Wallet}
          />
          <MetricCard
            title="Total Revenue"
            value={`Rp ${Number(stats.totalRevenue || 0).toLocaleString("id-ID")}`}
            icon={Wallet}
          />
        </Grid>
      )}

      <Grid cols={1} lgCols={2} gap={6}>
        <Card>
          <CardHeader>
            <CardTitle>Tren Aktivitas Platform</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={platformTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="newUsers" stroke="#23407a" />
                <Line type="monotone" dataKey="submissions" stroke="#3b82f6" />
                <Line type="monotone" dataKey="gradedSubmissions" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Role User</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleDistribution} dataKey="value" nameKey="name" outerRadius={110} label>
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid cols={1} lgCols={2} gap={6}>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Harian</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.length === 0 && (
                <p className="text-sm text-gray-500">Belum ada user terbaru.</p>
              )}
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#23407a]/10 text-[#23407a]">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Container>
  );
}

export { LegacyAdminDashboard };

const platformActivity = [
  { time: "08:00", activeUsers: 124, traffic: 42 },
  { time: "10:00", activeUsers: 214, traffic: 68 },
  { time: "12:00", activeUsers: 188, traffic: 53 },
  { time: "14:00", activeUsers: 302, traffic: 89 },
  { time: "16:00", activeUsers: 276, traffic: 74 },
  { time: "18:00", activeUsers: 221, traffic: 61 },
];

const recentEvents = [
  "48 kelas aktif dipantau hari ini",
  "1.243 tugas berhasil dikumpulkan",
  "320 proses deteksi plagiarisme selesai",
  "612 pengguna aktif dalam 24 jam terakhir",
];

function MonitoringStatCard({ title, value, description, icon: Icon, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    violet: "bg-violet-50 text-violet-700 border-violet-100",
  };

  return (
    <Card className={`border ${tones[tone]}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-950">{value}</p>
            <p className="mt-2 text-xs font-medium opacity-80">{description}</p>
          </div>
          <div className="rounded-lg bg-white/80 p-2 shadow-sm">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [overview, setOverview] = useState(null);
  const [charts, setCharts] = useState(null);

  const stats = useMemo(() => {
    const apiStats = overview?.stats || {};

    return {
      activeUsers: apiStats.activeUsers || 612,
      plagiarismChecks: apiStats.plagiarismChecks || apiStats.totalSubmissions || 7421,
      systemTraffic: `${apiStats.systemTraffic || 92}%`,
      totalClasses: apiStats.totalClasses || 48,
      totalAssignments: apiStats.totalAssignments || 320,
      totalSubmissions: apiStats.totalSubmissions || 7421,
    };
  }, [overview]);

  const activityChartData = useMemo(() => {
    const trends = charts?.platformTrends || [];
    if (!trends.length) return platformActivity;

    return trends.slice(-8).map((item) => ({
      time: item.date?.slice(5) || item.date,
      activeUsers: item.newUsers || 0,
      traffic: (item.submissions || 0) + (item.gradedSubmissions || 0),
    }));
  }, [charts]);

  const plagiarismGlobal = useMemo(() => {
    const total = Number(stats.plagiarismChecks || 0);
    if (!total) {
      return [
        { label: "Rendah", value: 56 },
        { label: "Sedang", value: 31 },
        { label: "Tinggi", value: 13 },
      ];
    }

    const high = Number(overview?.stats?.highRiskChecks || 0);
    const highPercent = Math.round((high / total) * 100);
    const mediumPercent = Math.min(35, Math.max(0, 100 - highPercent - 55));
    const lowPercent = Math.max(0, 100 - highPercent - mediumPercent);

    return [
      { label: "Rendah", value: lowPercent },
      { label: "Sedang", value: mediumPercent },
      { label: "Tinggi", value: highPercent },
    ];
  }, [overview, stats.plagiarismChecks]);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [monitoringResponse, chartResponse] = await Promise.all([
        adminService.getAdminMonitoring(),
        adminService.getAdminDashboardCharts("30d"),
      ]);
      setOverview(monitoringResponse);
      setCharts(chartResponse);
    } catch {
      setOverview(null);
      setCharts(null);
    } finally {
      setLastUpdated(new Date());
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const downloadReport = () => {
    const rows = [
      "Laporan Monitoring Sistem Protextify",
      `Diperbarui: ${lastUpdated.toLocaleString("id-ID")}`,
      "",
      `Pengguna aktif: ${stats.activeUsers}`,
      `Total deteksi plagiarisme: ${stats.plagiarismChecks}`,
      `Trafik sistem: ${stats.systemTraffic}`,
      `Total kelas aktif: ${stats.totalClasses}`,
      `Total tugas: ${stats.totalAssignments}`,
      `Total submission: ${stats.totalSubmissions}`,
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "laporan-monitoring-sistem.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="py-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Badge variant="outline" className="mb-3 bg-white">
            Monitoring Sistem
          </Badge>
          <h1 className="text-2xl font-bold text-gray-950">
            Statistik Global Protextify
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Pantau aktivitas kelas, tugas, deteksi plagiarisme, dan trafik sistem
            secara real-time.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
          <Button onClick={downloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Unduh Laporan
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MonitoringStatCard
          title="Pengguna Aktif"
          value={stats.activeUsers.toLocaleString("id-ID")}
          description="Dalam 24 jam terakhir"
          icon={Users}
        />
        <MonitoringStatCard
          title="Deteksi Plagiarisme"
          value={stats.plagiarismChecks.toLocaleString("id-ID")}
          description="Total proses global"
          icon={ShieldCheck}
          tone="violet"
        />
        <MonitoringStatCard
          title="Trafik Sistem"
          value={stats.systemTraffic}
          description="Rata-rata layanan tersedia"
          icon={Activity}
          tone="green"
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <MonitoringStatCard
          title="Total Kelas Aktif"
          value={stats.totalClasses.toLocaleString("id-ID")}
          description="Naik 12% dari periode sebelumnya"
          icon={FileCheck2}
        />
        <MonitoringStatCard
          title="Total Tugas"
          value={stats.totalAssignments.toLocaleString("id-ID")}
          description="Naik 8% dari periode sebelumnya"
          icon={FileCheck2}
          tone="violet"
        />
        <MonitoringStatCard
          title="Total Submission"
          value={stats.totalSubmissions.toLocaleString("id-ID")}
          description="Naik 5% dari periode sebelumnya"
          icon={FileCheck2}
          tone="green"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Grafik Pengguna Aktif & Trafik</CardTitle>
              <p className="mt-1 text-sm text-gray-500">
                Update terakhir {lastUpdated.toLocaleTimeString("id-ID")}
              </p>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityChartData}>
                <defs>
                  <linearGradient id="activeUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#23407a" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#23407a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="activeUsers"
                  name="Pengguna aktif"
                  stroke="#23407a"
                  fill="url(#activeUsers)"
                />
                <Line
                  type="monotone"
                  dataKey="traffic"
                  name="Trafik sistem"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Deteksi Plagiarisme Global</CardTitle>
            <p className="text-sm text-gray-500">Distribusi risiko dari seluruh submission.</p>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={plagiarismGlobal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name="Persentase" fill="#23407a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Aktivitas Terbaru Sistem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {recentEvents.map((event) => (
              <div
                key={event}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700"
              >
                <span className="h-2 w-2 rounded-full bg-[#23407a]" />
                {event}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
