// src/components/instructor/RecentActivity.jsx

import { Link } from "react-router-dom";
import { FileText, DollarSign, Clock, CheckCircle, Eye } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "../ui";

/**
 * Komponen RecentActivity
 * Menampilkan daftar aktivitas terbaru berupa submission dan transaksi.
 * Props:
 * - submissions: array data submission
 * - transactions: array data transaksi
 */
const RecentActivity = ({ submissions, transactions }) => {
  /**
   * Menggabungkan dan mengurutkan aktivitas terbaru dari submissions dan transactions.
   * Hanya mengambil 3 submission dan 2 transaksi terbaru.
   */
  const activities = [
    ...submissions.slice(0, 3).map((s) => ({
      type: "submission",
      id: s.id,
      title: s.assignment?.title || "Tugas",
      subtitle: `${s.student?.fullName || "-"} • ${
        s.assignment?.class?.name || "-"
      }`,
      time: s.submittedAt || s.updatedAt || s.createdAt,
      status: s.status,
      icon: FileText,
    })),
    ...transactions.slice(0, 2).map((t) => ({
      type: "transaction",
      id: t.id,
      title: t.assignment?.title
        ? `Pembayaran: ${t.assignment.title}`
        : "Pembayaran Assignment",
      subtitle: `${
        t.assignment?.class?.name || "-"
      } • Rp ${t.amount?.toLocaleString()}`,
      time: t.createdAt,
      status: t.status,
      icon: DollarSign,
    })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time));

  /**
   * Fungsi untuk mendapatkan ikon status berdasarkan tipe dan status aktivitas.
   * @param {string} type - Tipe aktivitas ("submission" atau "transaction")
   * @param {string} status - Status aktivitas
   * @returns {JSX.Element} Ikon status
   */
  const getStatusIcon = (type, status) => {
    if (type === "submission") {
      switch (status) {
        case "SUBMITTED":
          return <Clock className="h-4 w-4 text-yellow-600" />;
        case "GRADED":
          return <CheckCircle className="h-4 w-4 text-green-600" />;
        default:
          return <FileText className="h-4 w-4 text-gray-600" />;
      }
    } else {
      return status === "SUCCESS" ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <Clock className="h-4 w-4 text-yellow-600" />
      );
    }
  };

  /**
   * Fungsi untuk mendapatkan warna latar belakang status berdasarkan tipe dan status aktivitas.
   * @param {string} type - Tipe aktivitas
   * @param {string} status - Status aktivitas
   * @returns {string} Kelas warna background
   */
  const getStatusColor = (type, status) => {
    if (type === "submission") {
      switch (status) {
        case "SUBMITTED":
          return "bg-yellow-100";
        case "GRADED":
          return "bg-green-100";
        default:
          return "bg-gray-100";
      }
    } else {
      return status === "SUCCESS" ? "bg-green-100" : "bg-yellow-100";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Aktivitas Terbaru
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Menampilkan daftar aktivitas terbaru */}
          {activities.slice(0, 6).map((activity) => (
            <div
              key={`${activity.type}-${activity.id}`}
              className="flex items-start space-x-3"
            >
              <div
                className={`p-2 rounded-full ${getStatusColor(
                  activity.type,
                  activity.status
                )}`}
              >
                {getStatusIcon(activity.type, activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {activity.subtitle}
                </p>
                <div className="text-xs text-gray-500 mt-1">
                  {activity.time
                    ? new Date(activity.time).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </div>
              </div>
              {/* Tombol untuk melihat detail submission */}
              {activity.type === "submission" && (
                <Link to={`/instructor/submissions/${activity.id}/grade`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          ))}

          {/* Tampilkan pesan jika tidak ada aktivitas */}
          {activities.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Belum ada aktivitas terbaru</p>
              <p className="text-sm text-gray-400">
                Aktivitas akan muncul setelah ada interaksi dengan siswa
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
