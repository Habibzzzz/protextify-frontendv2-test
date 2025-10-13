import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, BookOpen, Save, DollarSign, Info, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Textarea,
  Alert,
  Breadcrumb,
  LoadingSpinner,
} from "../../components";
import {
  assignmentsService,
  classesService,
  paymentsService,
} from "../../services";
import { createAssignmentSchema } from "../../utils/validation";
import { useAsyncData } from "../../hooks/useAsyncData";
import DateTimePicker from "../../components/forms/DateTimePicker";
import RichTextEditor from "../../components/forms/RichTextEditor";
import PaymentStatusTracker from "../../components/payments/PaymentStatusTracker";
import { PAYMENT_CONFIG } from "../../utils/constants";
import { WHATSAPP_CONFIG, generateWhatsAppUrl } from "../../utils/whatsappConfig";

export default function CreateAssignment() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [assignmentData, setAssignmentData] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: {
      title: "",
      instructions: "",
      deadline: "",
      expectedStudentCount: 1,
    },
  });

  // Get class detail
  const { data: classDetail, loading: classLoading } = useAsyncData(
    () => classesService.getClassById(classId),
    [classId]
  );

  const watchedValues = watch();
  const totalPrice =
    watchedValues.expectedStudentCount *
    PAYMENT_CONFIG.ASSIGNMENT_PRICE_PER_STUDENT;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Format deadline to ISO string
      const formattedData = {
        ...data,
        deadline: new Date(data.deadline).toISOString(),
      };
      const response = await assignmentsService.createAssignment(
        classId,
        formattedData
      );

      if (response.paymentRequired) {
        setAssignmentData(response);
        setShowPayment(true);
        toast.success(
          "Assignment berhasil dibuat! Lanjutkan ke pembayaran untuk mengaktifkan."
        );
      } else {
        toast.success("Assignment berhasil dibuat dan aktif!");
        navigate(`/instructor/classes/${classId}`);
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
      // Error toast is handled by the API interceptor
    } finally {
      setLoading(false);
    }
  };

  if (classLoading) {
    return (
      <Container className="py-6 flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <Breadcrumb />

      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            showPayment
              ? setShowPayment(false)
              : navigate(`/instructor/classes/${classId}`)
          }
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {showPayment ? "Pembayaran Assignment" : "Buat Tugas Baru"}
          </h1>
          <p className="text-gray-600">Kelas: {classDetail?.name}</p>
        </div>
      </div>

      <motion.div
        key={showPayment ? "payment" : "form"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!showPayment ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-[#23407a]" />
                  Informasi Tugas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Input
                    label="Judul Tugas *"
                    placeholder="Contoh: Analisis Puisi Kontemporer"
                    {...register("title")}
                    error={errors.title?.message}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instruksi Tugas *
                  </label>
                  <RichTextEditor
                    value={watchedValues.instructions}
                    onChange={(value) => setValue("instructions", value)}
                    placeholder="Jelaskan instruksi detail untuk tugas ini..."
                    error={errors.instructions?.message}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <DateTimePicker
                      label="Deadline *"
                      value={watchedValues.deadline}
                      onChange={(value) => setValue("deadline", value)}
                      error={errors.deadline?.message}
                    />
                  </div>
                  <div>
                    <Input
                      label="Jumlah Siswa yang Diharapkan *"
                      type="number"
                      min="1"
                      max="100"
                      placeholder="Masukkan jumlah siswa..."
                      {...register("expectedStudentCount", {
                        valueAsNumber: true,
                      })}
                      error={errors.expectedStudentCount?.message}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-[#23407a]" />
                  Informasi Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert variant="info" className="mb-6">
                  <Info className="h-4 w-4" />
                  <div>
                    Setiap assignment memerlukan pembayaran berdasarkan jumlah
                    siswa. Assignment akan aktif setelah pembayaran berhasil.
                  </div>
                </Alert>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Harga per siswa:
                    </span>
                    <span className="font-semibold text-gray-900">
                      Rp{" "}
                      {PAYMENT_CONFIG.ASSIGNMENT_PRICE_PER_STUDENT.toLocaleString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Jumlah siswa:
                    </span>
                    <span className="font-semibold text-gray-900">
                      {watchedValues.expectedStudentCount || 0} siswa
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-sm font-medium text-blue-700">
                      Total pembayaran:
                    </span>
                    <span className="font-bold text-blue-900 text-lg">
                      Rp {totalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/instructor/classes/${classId}`)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="bg-[#23407a] hover:bg-[#1a2f5c]"
              >
                <Save className="h-4 w-4 mr-2" />
                Lanjutkan ke Pembayaran
              </Button>
            </div>
          </form>
        ) : (
          <PaymentSection
            assignmentData={assignmentData}
            transactionData={transactionData}
            setTransactionData={setTransactionData}
            classId={classId}
          />
        )}
      </motion.div>
    </Container>
  );
}

function PaymentSection({
  assignmentData,
  transactionData,
  setTransactionData,
  classId,
}) {
  const navigate = useNavigate();
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      // Simpan data transaksi ke database (tetap diperlukan untuk tracking)
      const paymentResponse = await paymentsService.createTransaction(
        assignmentData.paymentData
      );
      setTransactionData(paymentResponse);

      // Buat pesan WhatsApp dengan detail pembayaran
      const whatsappMessage = `Halo! Saya ingin melakukan pembayaran untuk assignment Protextify.

📋 *Detail Assignment:*
• Judul: ${assignmentData.assignment.title}
• Jumlah Siswa: ${assignmentData.assignment.expectedStudentCount}
• Total Pembayaran: Rp ${assignmentData.totalPrice.toLocaleString("id-ID")}
• ID Transaksi: ${paymentResponse.transactionId || 'N/A'}

Mohon bantuan untuk proses pembayaran. Terima kasih!`;

      // Buka WhatsApp dengan pesan yang sudah diformat
      const whatsappUrl = generateWhatsAppUrl(whatsappMessage);
      window.open(whatsappUrl, "_blank");

      toast.success(
        "Data transaksi telah disimpan. WhatsApp telah dibuka untuk konfirmasi pembayaran."
      );

      // KOMENTAR: Kode Midtrans di bawah ini dinonaktifkan sementara
      // if (paymentResponse.paymentUrl) {
      //   window.open(paymentResponse.paymentUrl, "_blank");
      //   toast.success(
      //     "Halaman pembayaran telah dibuka. Sistem akan memantau status secara otomatis."
      //   );
      // }
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error("Gagal menyimpan data transaksi. Silakan coba lagi.");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>
          {transactionData
            ? "Status Pembayaran"
            : "Konfirmasi Pembayaran Assignment"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {transactionData ? (
          <PaymentStatusTracker
            transaction={transactionData}
            onPaymentSuccess={() => {
              toast.success(
                "Pembayaran berhasil! Assignment telah diaktifkan."
              );
              setTimeout(
                () => navigate(`/instructor/classes/${classId}`),
                2000
              );
            }}
            onPaymentFailure={() => {
              toast.error(
                "Pembayaran gagal atau dibatalkan. Silakan coba lagi."
              );
            }}
          />
        ) : (
          <>
            <Alert variant="success">
              <strong>Assignment berhasil dibuat!</strong> Silakan lakukan
              pembayaran untuk mengaktifkan.
            </Alert>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 border">
              <h3 className="font-semibold text-gray-900">Detail Assignment</h3>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium text-gray-600">Judul:</span>{" "}
                  {assignmentData.assignment.title}
                </p>
                <p>
                  <span className="font-medium text-gray-600">
                    Jumlah Siswa:
                  </span>{" "}
                  {assignmentData.assignment.expectedStudentCount}
                </p>
                <p className="font-bold text-lg text-[#23407a] mt-2">
                  Total: Rp {assignmentData.totalPrice.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={handlePayment}
                loading={paymentLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Bayar Sekarang
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
