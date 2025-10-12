import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Mail,
  RefreshCw,
  Eye,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  LoadingSpinner,
  Alert,
  Breadcrumb,
} from "../../components";
import { InvoiceViewer, PaymentStatusTracker } from "../../components/payments";
import { paymentsService } from "../../services";
import { useAsyncData } from "../../hooks";
import { PAYMENT_STATUS } from "../../utils/constants";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function TransactionDetail() {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    data: transaction,
    loading,
    error,
    refetch,
  } = useAsyncData(
    () => paymentsService.getTransactionById(transactionId),
    [transactionId]
  );

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

  const handleDownloadInvoice = async () => {
    await toast.promise(paymentsService.downloadInvoice(transactionId), {
      loading: "Membuat invoice...",
      success: (response) => {
        window.open(response.downloadUrl, "_blank");
        return "Invoice siap diunduh!";
      },
      error: (err) => err.response?.data?.message || "Gagal mengunduh invoice.",
    });
  };

  const handleEmailInvoice = async () => {
    await toast.promise(paymentsService.emailInvoice(transactionId), {
      loading: "Mengirim invoice...",
      success: (response) => response.message || "Invoice berhasil dikirim!",
      error: (err) => err.response?.data?.message || "Gagal mengirim invoice.",
    });
  };

  if (loading) {
    return (
      <Container className="py-6 flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </Container>
    );
  }

  if (error || !transaction) {
    return (
      <Container className="py-6">
        <Alert variant="error" title="Gagal Memuat Data">
          <p>
            {error?.message ||
              `Transaksi dengan ID "${transactionId}" tidak dapat ditemukan.`}
          </p>
          <Button
            onClick={() => navigate("/instructor/transactions")}
            size="sm"
            className="mt-4"
          >
            Kembali ke Riwayat Transaksi
          </Button>
        </Alert>
      </Container>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "invoice", label: "Invoice", icon: CreditCard },
    { id: "status", label: "Status Tracking", icon: RefreshCw },
  ];

  return (
    <Container className="py-8 max-w-5xl">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/instructor/dashboard" },
          { label: "Transaksi", href: "/instructor/transactions" },
          { label: `Detail Transaksi` },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between my-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/instructor/transactions")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detail Transaksi
            </h1>
            <p className="text-gray-600 font-mono text-sm">
              #{transaction.orderId}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleDownloadInvoice}
            aria-label="Download Invoice"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            onClick={refetch}
            loading={loading}
            aria-label="Refresh Data"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Transaction Summary */}
      <Card className="border-0 shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="h-6 w-6 mr-3 text-[#23407a]" />
              Ringkasan Transaksi
            </div>
            <Badge variant={getStatusVariant(transaction.status)}>
              {transaction.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">
                Jumlah Pembayaran
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(transaction.amount)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">
                Tanggal Transaksi
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formatDate(transaction.createdAt, "dd MMMM yyyy, HH:mm")}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">
                Assignment
              </div>
              <div className="text-lg font-semibold text-gray-900 truncate">
                {transaction.assignment?.title}
              </div>
              <div className="text-sm text-gray-600">
                {transaction.assignment?.class?.name}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? "border-[#23407a] text-[#23407a]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Informasi Assignment
                </h4>
                <div className="space-y-3 text-sm">
                  <InfoRow
                    label="Judul"
                    value={transaction.assignment?.title}
                  />
                  <InfoRow
                    label="Kelas"
                    value={transaction.assignment?.class?.name}
                  />
                  <InfoRow
                    label="Deadline"
                    value={formatDate(
                      transaction.assignment?.deadline,
                      "dd MMMM yyyy"
                    )}
                  />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Detail Pembayaran
                </h4>
                <div className="space-y-3 text-sm">
                  <InfoRow
                    label="Jumlah Siswa"
                    value={transaction.expectedStudentCount}
                  />
                  <InfoRow
                    label="Harga per Siswa"
                    value={formatCurrency(2500)}
                  />
                  <InfoRow
                    label="Total"
                    value={formatCurrency(transaction.amount)}
                    isBold
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "invoice" && (
          <InvoiceViewer
            transaction={transaction}
            onDownload={handleDownloadInvoice}
            onEmail={handleEmailInvoice}
          />
        )}

        {activeTab === "status" && (
          <PaymentStatusTracker
            transaction={transaction}
            paymentHistory={transaction.paymentHistory}
            onPaymentSuccess={refetch}
            onPaymentFailure={refetch}
            isActive={activeTab === "status"}
          />
        )}
      </div>
    </Container>
  );
}

function InfoRow({ label, value, isBold = false }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}:</span>
      <span
        className={`ml-2 text-gray-900 ${isBold ? "font-bold" : "font-medium"}`}
      >
        {value}
      </span>
    </div>
  );
}
