import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Search,
  Eye,
  FileText,
  Inbox,
  RefreshCw,
  ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  Badge,
  Breadcrumb,
} from "../../components";
import { classesService } from "../../services";
import { formatDateTime } from "../../utils/helpers";
import { useDebounce } from "../../hooks";

const statusOptions = [
  { value: "ALL", label: "Semua Status" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "GRADED", label: "Graded" },
  { value: "DRAFT", label: "Draft" },
];

export default function ClassHistory() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    limit: "15",
    search: "",
    status: "ALL",
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const [historyData, setHistoryData] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams.entries());
      if (params.status === "ALL") delete params.status;

      const response = await classesService.getClassHistory(classId, params);
      setHistoryData(response || { data: [], total: 0 });
    } catch (error) {
      toast.error("Gagal memuat riwayat submission kelas.");
      setHistoryData({ data: [], total: 0 });
    } finally {
      setLoading(false);
    }
  }, [classId, searchParams]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        prev.set("search", debouncedSearch);
        prev.set("page", "1");
        return prev;
      },
      { replace: true }
    );
  }, [debouncedSearch, setSearchParams]);

  const handleParamChange = (key, value) => {
    setSearchParams(
      (prev) => {
        prev.set(key, value);
        if (key !== "page") prev.set("page", "1");
        return prev;
      },
      { replace: true }
    );
  };

  const handleSort = (column) => {
    const currentSortBy = searchParams.get("sortBy");
    const currentSortOrder = searchParams.get("sortOrder");
    const newSortOrder =
      currentSortBy === column && currentSortOrder === "desc" ? "asc" : "desc";
    handleParamChange("sortBy", column);
    handleParamChange("sortOrder", newSortOrder);
  };

  const SortableHeader = ({ label, column }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(column)}
      className="px-0 hover:bg-transparent"
    >
      {label}
      <ArrowUpDown className="h-4 w-4 ml-2" />
    </Button>
  );

  const columns = useMemo(
    () => [
      {
        key: "student",
        label: <SortableHeader label="Siswa" column="studentName" />,
        render: (s) => s.student.fullName,
      },
      {
        key: "assignment",
        label: <SortableHeader label="Tugas" column="assignmentTitle" />,
        render: (s) => s.assignment.title,
      },
      {
        key: "status",
        label: "Status",
        render: (s) => <Badge>{s.status}</Badge>,
      },
      { key: "grade", label: "Nilai", render: (s) => s.grade ?? "—" },
      {
        key: "plagiarism",
        label: "Plagiarisme",
        render: (s) => {
          // Akses score dengan aman menggunakan optional chaining
          const score = s.plagiarismChecks?.score;

          // Jika score bukan angka (misal: plagiarismChecks null), tampilkan "—"
          if (typeof score !== "number") {
            return "—";
          }

          // Terapkan warna kondisional berdasarkan nilai score
          const scoreColor =
            score > 30
              ? "text-red-600"
              : score > 15
              ? "text-yellow-600"
              : "text-green-600";

          return (
            <span className={`font-semibold ${scoreColor}`}>
              {score.toFixed(1)}%
            </span>
          );
        },
      },
      {
        key: "updatedAt",
        label: <SortableHeader label="Terakhir Update" column="updatedAt" />,
        render: (s) => formatDateTime(s.updatedAt),
      },
      {
        key: "actions",
        label: "Aksi",
        render: (s) => (
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/instructor/submissions/${s.id}/grade`)}
          >
            <Eye className="h-4 w-4 mr-1" /> Detail
          </Button>
        ),
      },
    ],
    [searchParams]
  );

  return (
    <Container className="py-8">
      <Breadcrumb />
      <div className="flex items-center my-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/instructor/classes/${classId}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Riwayat Submission Kelas
          </h1>
          <p className="text-gray-600">
            Melihat semua aktivitas submission dalam satu tempat.
          </p>
        </div>
      </div>

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle>Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Cari siswa atau tugas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftElement={<Search className="h-4 w-4" />}
            className="md:col-span-2"
          />
          <Select
            value={searchParams.get("status") || "ALL"}
            onChange={(value) => handleParamChange("status", value)}
            options={statusOptions}
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardContent className="p-0 pt-0">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Memuat data...</p>
              </motion.div>
            ) : historyData.data.length > 0 ? (
              <motion.div
                key="data"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <DataTable columns={columns} data={historyData.data} />
                <div className="flex justify-center mt-6">
                  <Pagination
                    currentPage={parseInt(searchParams.get("page"))}
                    totalPages={historyData.totalPages}
                    onPageChange={(page) => handleParamChange("page", page)}
                    totalItems={historyData.total}
                    itemsPerPage={parseInt(searchParams.get("limit"))}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <Inbox className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800">
                  Tidak Ada Submission Ditemukan
                </h3>
                <p className="text-gray-600 mt-2">
                  Coba ubah filter atau belum ada submission di kelas ini.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </Container>
  );
}
