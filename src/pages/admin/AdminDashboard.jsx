import { useEffect, useMemo, useState } from "react";
import { Users, GraduationCap, BookOpen, FileText, Wallet } from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { adminService } from "../../services";
import { Alert, Button, Card, CardContent, CardHeader, CardTitle, Grid, Container } from "../../components";

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

export default function AdminDashboard() {
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
