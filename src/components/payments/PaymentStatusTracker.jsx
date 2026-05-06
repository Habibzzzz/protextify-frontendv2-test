import { useState } from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  CreditCard,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Alert,
} from "../ui";

import { usePaymentTracker } from "../../hooks/usePaymentTracker";
import { PAYMENT_STATUS } from "../../utils/constants";
import { formatCurrency, formatDate } from "../../utils/helpers";

/**
 * Komponen PaymentStatusTracker
 * Menampilkan status pembayaran dan detail transaksi.
 *
 * Props:
 * - transaction: Data transaksi pembayaran
 * - onPaymentSuccess: Callback jika pembayaran sukses
 * - onPaymentFailure: Callback jika pembayaran gagal
 * - showActions: Menampilkan tombol aksi (default: true)
 * - isActive: Status aktif tracker
 */
export default function PaymentStatusTracker({
  transaction,
  onPaymentSuccess,
  onPaymentFailure,
  showActions = true,
  isActive,
}) {
  // State untuk toggle detail transaksi
  const [showDetails, setShowDetails] = useState(false);

  /**
   * Hook custom untuk tracking status pembayaran.
   * Mengambil status, loading, error, jumlah percobaan, fungsi refresh, dan status polling.
   */
  const { status, loading, error, attempts, refreshStatus, isPolling } =
    usePaymentTracker(
      transaction.orderId,
      transaction.status, // Status awal transaksi
      {
        onStatusChange: (_newStatus) => {
          // Logging status perubahan (opsional)
        },
        onSuccess: (response) => {
          if (onPaymentSuccess) onPaymentSuccess(response);
        },
        onFailure: (response) => {
          if (onPaymentFailure) onPaymentFailure(response);
        },
      },
      isActive
    );

  /**
   * Fungsi konfigurasi status pembayaran sesuai backend.
   * Mengembalikan objek konfigurasi berdasarkan status.
   * @param {string} status - Status pembayaran
   * @returns {object} Konfigurasi status
   */
  const getStatusConfig = (status) => {
    switch (status) {
      case PAYMENT_STATUS.SUCCESS:
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          badge: "success",
          title: "Pembayaran Berhasil",
          description: "Assignment telah aktif dan siap digunakan",
        };
      case PAYMENT_STATUS.PENDING:
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          badge: "warning",
          title: "Menunggu Pembayaran",
          description:
            "Silakan selesaikan pembayaran untuk mengaktifkan assignment",
        };
      case PAYMENT_STATUS.FAILED:
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          badge: "error",
          title: "Pembayaran Gagal",
          description: "Pembayaran tidak dapat diproses. Silakan coba lagi",
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          badge: "secondary",
          title: "Status Tidak Diketahui",
          description: "Mohon periksa kembali status pembayaran",
        };
    }
  };

  // Konfigurasi status berdasarkan status pembayaran saat ini
  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card
      className={`border-2 ${statusConfig.borderColor} ${statusConfig.bgColor}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <StatusIcon className={`h-6 w-6 mr-3 ${statusConfig.color}`} />
            <div>
              <div className="flex items-center space-x-2">
                <span>{statusConfig.title}</span>
                <Badge variant={statusConfig.badge}>{status}</Badge>
              </div>
              <p className="text-sm font-normal text-gray-600 mt-1">
                {statusConfig.description}
              </p>
            </div>
          </div>

          {showActions && (
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={refreshStatus}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informasi Transaksi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Order ID:</span>
            <div className="font-mono text-gray-600">{transaction.orderId}</div>
          </div>
          <div>
            <span className="font-medium">Jumlah:</span>
            <div className="text-lg font-semibold">
              {formatCurrency(transaction.amount)}
            </div>
          </div>
          <div>
            <span className="font-medium">Tanggal:</span>
            <div className="text-gray-600">
              {formatDate(transaction.createdAt, "dd/MM/yyyy HH:mm")}
            </div>
          </div>
          <div>
            <span className="font-medium">Assignment:</span>
            <div className="text-gray-600">{transaction.assignment?.title}</div>
          </div>
        </div>

        {/* Status Polling */}
        {isPolling && status === PAYMENT_STATUS.PENDING && (
          <Alert variant="info">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <div className="text-sm">
              <strong>Memantau status pembayaran...</strong>
              <br />
              Sistem akan otomatis memperbarui status (attempt: {attempts})
            </div>
          </Alert>
        )}

        {/* Tampilkan Error jika ada */}
        {error && (
          <Alert variant="error">
            <AlertTriangle className="h-4 w-4" />
            <div className="text-sm">
              <strong>Error:</strong> {error.message || error}
            </div>
          </Alert>
        )}

        {/* Tombol Aksi Pembayaran Midtrans */}
        {status === PAYMENT_STATUS.PENDING && transaction.paymentUrl && (
          <div className="border-t pt-4">
            <Button
              className="w-full bg-[#23407a] hover:bg-[#1a2f5c]"
              onClick={() => {
                window.open(transaction.paymentUrl, "_blank");
              }}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Lanjutkan Pembayaran
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Toggle Detail Transaksi */}
        <div className="border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full"
          >
            {showDetails ? "Sembunyikan" : "Tampilkan"} Detail Transaksi
          </Button>
        </div>

        {/* Detail Transaksi */}
        {showDetails && (
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Transaction ID:</span>
              <span className="font-mono">{transaction.id}</span>
            </div>

            {transaction.midtransTransactionId && (
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Midtrans ID:</span>
                <span className="font-mono">
                  {transaction.midtransTransactionId}
                </span>
              </div>
            )}

            {transaction.paymentMethod && (
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Payment Method:</span>
                <span>{transaction.paymentMethod}</span>
              </div>
            )}

            {transaction.paidAt && (
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Paid At:</span>
                <span>
                  {formatDate(transaction.paidAt, "dd/MM/yyyy HH:mm:ss")}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
