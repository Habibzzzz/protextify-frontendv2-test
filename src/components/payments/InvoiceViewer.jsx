import { useState } from "react";
import {
  Download,
  Printer,
  Mail,
  FileText,
  Calendar,
  User,
  CreditCard,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "../ui";
import { formatCurrency, formatDate } from "../../utils/helpers";
import { PAYMENT_STATUS } from "../../utils/constants";

export default function InvoiceViewer({
  transaction,
  onDownload,
  onPrint,
  onEmail,
}) {
  const [loading, setLoading] = useState({
    download: false,
    print: false,
    email: false,
  });

  const handleAction = async (action, handler) => {
    if (!handler) return;
    try {
      setLoading((prev) => ({ ...prev, [action]: true }));
      await handler(transaction);
    } catch (error) {
      // Error handling sudah sesuai standar BE
      // toast error jika diperlukan
    } finally {
      setLoading((prev) => ({ ...prev, [action]: false }));
    }
  };

  // Status badge mapping sesuai BE
  const getStatusVariant = (status) => {
    switch (status) {
      case PAYMENT_STATUS.SUCCESS:
        return "success";
      case PAYMENT_STATUS.PENDING:
        return "warning";
      case PAYMENT_STATUS.FAILED:
        return "error";
      case PAYMENT_STATUS.CANCELLED:
        return "secondary";
      case PAYMENT_STATUS.EXPIRED:
        return "warning";
      default:
        return "secondary";
    }
  };

  // Harga per siswa dan admin fee dari config/hardcode sesuai BE
  const PRICE_PER_STUDENT = 2700;
  const ADMIN_FEE = 5000;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FileText className="h-6 w-6 mr-2" />
            Invoice #{transaction.orderId}
          </CardTitle>
          <div className="flex space-x-2">
            {onDownload && (
              <Button
                size="sm"
                variant="outline"
                loading={loading.download}
                onClick={() => handleAction("download", onDownload)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
            {onPrint && (
              <Button
                size="sm"
                variant="outline"
                loading={loading.print}
                onClick={() => handleAction("print", onPrint)}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            )}
            {onEmail && (
              <Button
                size="sm"
                variant="outline"
                loading={loading.email}
                onClick={() => handleAction("email", onEmail)}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Invoice Header */}
        <div className="border-b pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informasi Kami
              </h3>
              <div className="space-y-1 text-sm">
                <div className="font-medium">Protextify Indonesia</div>
                <div>Jl. Prof. Dr. Sumantri Brojonegoro No. 1</div>
                <div>Bandar Lampung, 35141</div>
                <div>Indonesia</div>
                <div>Email: billing@protextify.com</div>
                <div>Phone: +62 21 1234 5678</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detail Invoice
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Invoice #:</span>
                  <span className="font-mono">{transaction.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal:</span>
                  <span>
                    {formatDate(transaction.createdAt, "dd MMMM yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={getStatusVariant(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>
                {transaction.paidAt && (
                  <div className="flex justify-between">
                    <span>Tanggal Bayar:</span>
                    <span>
                      {formatDate(transaction.paidAt, "dd MMMM yyyy HH:mm")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Informasi Customer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 text-sm">
              <div className="font-medium">{transaction.user?.fullName}</div>
              <div>{transaction.user?.email}</div>
              <div>{transaction.user?.institution}</div>
            </div>
          </div>
        </div>

        {/* Assignment Information */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detail Assignment
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium mb-2">Assignment Information</div>
                <div>
                  <strong>Judul:</strong> {transaction.assignment?.title}
                </div>
                <div>
                  <strong>Kelas:</strong> {transaction.assignment?.class?.name}
                </div>
                <div>
                  <strong>Deadline:</strong>{" "}
                  {formatDate(transaction.assignment?.deadline, "dd MMMM yyyy")}
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">Payment Details</div>
                <div>
                  <strong>Jumlah Siswa:</strong>{" "}
                  {transaction.expectedStudentCount}
                </div>
                <div>
                  <strong>Harga per Siswa:</strong>{" "}
                  {formatCurrency(PRICE_PER_STUDENT)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Rincian Pembayaran
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>
                Subtotal ({transaction.expectedStudentCount} siswa ×{" "}
                {formatCurrency(PRICE_PER_STUDENT)}):
              </span>
              <span>
                {formatCurrency(
                  transaction.expectedStudentCount * PRICE_PER_STUDENT
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Biaya Admin:</span>
              <span>{formatCurrency(ADMIN_FEE)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-semibold">
              <span>Total Pembayaran:</span>
              <span>{formatCurrency(transaction.amount)}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        {transaction.paymentMethod && (
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Metode Pembayaran
            </h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm">
                <div>
                  <strong>Metode:</strong> {transaction.paymentMethod}
                </div>
                {transaction.vaNumber && (
                  <div>
                    <strong>Virtual Account:</strong> {transaction.vaNumber}
                  </div>
                )}
                {transaction.bankName && (
                  <div>
                    <strong>Bank:</strong> {transaction.bankName}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-6 border-t">
          <p>Terima kasih telah menggunakan layanan Protextify!</p>
          <p className="mt-2">
            Untuk pertanyaan mengenai invoice ini, silakan hubungi customer
            service kami di
            <a
              href="mailto:support@protextify.com"
              className="text-blue-600 hover:underline ml-1"
            >
              support@protextify.com
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
