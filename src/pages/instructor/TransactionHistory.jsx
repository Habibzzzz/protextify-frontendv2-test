import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CreditCard,
  Filter,
  Download,
  Eye,
  Calendar,
  Search,
  RefreshCw,
  Plus,
} from "lucide-react";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Select,
  DataTable,
  Pagination,
  LoadingSpinner,
  Alert,
  Badge,
  Breadcrumb,
} from "../../components";

import { paymentsService } from "../../services";
import { PAYMENT_STATUS } from "../../utils/constants";
import { formatCurrency, formatDate } from "../../utils/helpers";

const statusOptions = [
  { value: "ALL", label: "🔄 Semua Status" },
  { value: PAYMENT_STATUS.PENDING, label: "⏳ Pending" },
  { value: PAYMENT_STATUS.SUCCESS, label: "✅ Success" },
  { value: PAYMENT_STATUS.FAILED, label: "❌ Failed" },
];

export default function TransactionHistory() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "ALL",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    search: searchParams.get("search") || "",
  });

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: pagination.limit,
        ...filters,
      };

      if (params.status === "ALL") {
        delete params.status;
      }

      const response = await paymentsService.getTransactionHistory(params);

      setTransactions(response.data || []);
      setPagination({
        page: response.page || 1,
        limit: response.limit || 10,
        total: response.total || 0,
        totalPages: response.totalPages || 1,
      });

      const newParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) newParams.set(key, value);
      });
      setSearchParams(newParams);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Gagal memuat data transaksi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(parseInt(searchParams.get("page")) || 1);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchTransactions(1);
  };

  const resetFilters = () => {
    setFilters({
      status: "ALL",
      startDate: "",
      endDate: "",
      search: "",
    });
    setSearchParams({});
    fetchTransactions(1);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case PAYMENT_STATUS.SUCCESS:
        return "success";
      case PAYMENT_STATUS.PENDING:
        return "warning";
      case PAYMENT_STATUS.FAILED:
        return "error";
      default:
        return "secondary";
    }
  };

  const handleExport = async () => {
    const exportFilters = { ...filters };
    if (exportFilters.status === "ALL") {
      delete exportFilters.status;
    }

    await toast.promise(paymentsService.exportTransactions(exportFilters), {
      loading: "Mengekspor data transaksi...",
      success: (response) => {
        window.open(response.downloadUrl, "_blank");
        return "File ekspor berhasil dibuat dan siap diunduh!";
      },
      error: (err) => {
        if (err.response?.status === 404) {
          return "Tidak ada data untuk diekspor sesuai filter yang dipilih.";
        }
        return (
          err.response?.data?.message || "Gagal mengekspor data transaksi."
        );
      },
    });
  };

  const enhancedColumns = [
    {
      key: "orderId",
      label: "Order ID",
      render: (transaction) => (
        <div className="space-y-1">
          <div className="font-mono text-sm font-medium text-gray-900">
            {transaction.orderId}
          </div>
          <div className="text-xs text-gray-500">
            {formatDate(transaction.createdAt, "dd/MM/yyyy")}
          </div>
        </div>
      ),
    },
    {
      key: "assignment",
      label: "Assignment",
      render: (transaction) => (
        <div className="space-y-1 max-w-xs">
          <div className="font-medium text-gray-900 truncate">
            {transaction.assignment?.title}
          </div>
          <div className="text-sm text-gray-600 truncate">
            {transaction.assignment?.class?.name}
          </div>
          <div className="text-xs text-gray-500">
            {transaction.expectedStudentCount} siswa terdaftar
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Total Pembayaran",
      render: (transaction) => (
        <div className="text-right space-y-1">
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(transaction.amount)}
          </div>
          <div className="text-xs text-gray-500">
            @ {formatCurrency(2500)} × {transaction.expectedStudentCount}
          </div>
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            {transaction.expectedStudentCount} siswa
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (transaction) => (
        <div className="space-y-2">
          <Badge
            variant={getStatusVariant(transaction.status)}
            className="text-xs font-medium"
          >
            {getStatusLabel(transaction.status)}
          </Badge>
          {transaction.status === PAYMENT_STATUS.SUCCESS &&
            transaction.paidAt && (
              <div className="text-xs text-gray-500">
                Dibayar: {formatDate(transaction.paidAt, "dd/MM/yyyy HH:mm")}
              </div>
            )}
          {transaction.status === PAYMENT_STATUS.PENDING && (
            <div className="text-xs text-orange-600 font-medium">
              Menunggu pembayaran
            </div>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      render: (transaction) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate(`/instructor/transactions/${transaction.id}`)
            }
            className="border-[#23407a]/30 text-[#23407a] hover:bg-[#23407a] hover:text-white transition-all duration-300"
          >
            <Eye className="h-4 w-4 mr-1" />
            Detail
          </Button>
        </div>
      ),
    },
  ];

  const getStatusLabel = (status) => {
    switch (status) {
      case PAYMENT_STATUS.SUCCESS:
        return "✅ Berhasil";
      case PAYMENT_STATUS.PENDING:
        return "⏳ Pending";
      case PAYMENT_STATUS.FAILED:
        return "❌ Gagal";
      default:
        return status;
    }
  };

  return (
    <Container className="py-8">
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#162849] rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"></div>
        <div className="relative px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-white/70 text-sm font-medium">
                  Manajemen Keuangan
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Riwayat Transaksi 💳
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Kelola dan monitor riwayat pembayaran assignment Anda.
                {pagination.total > 0
                  ? ` Total ${pagination.total} transaksi ditemukan.`
                  : " Belum ada transaksi pembayaran."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleExport}
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                <Download className="h-5 w-5 mr-2" />
                Export Data
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => fetchTransactions(pagination.page)}
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Breadcrumb />

      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-[#23407a] to-[#3b5fa4] rounded-full mr-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">
            Filter & Pencarian
          </h2>
        </div>
        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#23407a]/10 to-blue-500/10 rounded-full transform translate-x-16 -translate-y-16"></div>
          <CardHeader className="relative z-10 pb-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#23407a]/10 rounded-2xl">
                <Filter className="h-6 w-6 text-[#23407a]" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Filter Transaksi
                </CardTitle>
                <p className="text-gray-600 text-sm mt-1">
                  Cari dan filter transaksi berdasarkan kriteria
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
                  <Search className="h-4 w-4 mr-2 text-[#23407a]" />
                  Pencarian
                </label>
                <Input
                  placeholder="Order ID atau Assignment..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="h-12 border-2 border-gray-300 focus:border-[#23407a] rounded-xl"
                  leftElement={<Search className="h-5 w-5 text-gray-400" />}
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
                  <CreditCard className="h-4 w-4 mr-2 text-[#23407a]" />
                  Status
                </label>
                <Select
                  value={filters.status}
                  onChange={(value) => handleFilterChange("status", value)}
                  options={statusOptions}
                  className="h-12 border-2 border-gray-300 focus:border-[#23407a] rounded-xl"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
                  <Calendar className="h-4 w-4 mr-2 text-[#23407a]" />
                  Dari Tanggal
                </label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="h-12 border-2 border-gray-300 focus:border-[#23407a] rounded-xl"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
                  <Calendar className="h-4 w-4 mr-2 text-[#23407a]" />
                  Sampai Tanggal
                </label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="h-12 border-2 border-gray-300 focus:border-[#23407a] rounded-xl"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                size="lg"
                onClick={resetFilters}
                className="order-2 sm:order-1"
              >
                Reset Filter
              </Button>
              <Button
                size="lg"
                onClick={applyFilters}
                className="order-1 sm:order-2 bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Search className="h-5 w-5 mr-2" />
                Terapkan Filter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full transform -translate-x-20 -translate-y-20"></div>
        <CardHeader className="relative z-10 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/10 rounded-2xl">
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Daftar Transaksi
                </CardTitle>
                <p className="text-gray-600 text-sm mt-1">
                  {loading
                    ? "Memuat transaksi..."
                    : pagination.total > 0
                    ? `Menampilkan ${transactions.length} dari ${pagination.total} transaksi`
                    : "Tidak ada transaksi yang ditemukan"}
                </p>
              </div>
            </div>
            {!loading && pagination.total > 0 && (
              <div className="hidden lg:flex space-x-4">
                <div className="text-center p-3 bg-white/70 rounded-xl border border-gray-200/50">
                  <div className="text-lg font-bold text-gray-900">
                    {
                      transactions.filter(
                        (t) => t.status === PAYMENT_STATUS.SUCCESS
                      ).length
                    }
                  </div>
                  <div className="text-xs text-gray-600">Berhasil</div>
                </div>
                <div className="text-center p-3 bg-white/70 rounded-xl border border-gray-200/50">
                  <div className="text-lg font-bold text-gray-900">
                    {
                      transactions.filter(
                        (t) => t.status === PAYMENT_STATUS.PENDING
                      ).length
                    }
                  </div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-600">Memuat riwayat transaksi...</p>
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200/50 overflow-hidden">
                <DataTable
                  columns={enhancedColumns}
                  data={transactions}
                  className="w-full"
                />
              </div>
              <div className="flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => fetchTransactions(page)}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-12 w-12 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {Object.values(filters).some((f) => f && f !== "ALL")
                  ? "Tidak ada transaksi yang sesuai"
                  : "Belum ada transaksi"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                {Object.values(filters).some((f) => f && f !== "ALL")
                  ? "Coba ubah filter atau kata kunci pencarian untuk menemukan transaksi yang Anda cari."
                  : "Transaksi akan muncul di sini setelah Anda membuat assignment berbayar."}
              </p>
              {!Object.values(filters).some((f) => f && f !== "ALL") && (
                <Button
                  onClick={() => navigate("/instructor/create-class")}
                  className="bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Buat Kelas Pertama
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
