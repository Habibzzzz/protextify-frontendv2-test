import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { authService } from "../../services";
import { toast } from "react-hot-toast";
import {
  Button,
  Alert,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Container,
  LoadingSpinner,
} from "../../components";
import logo from "@/assets/logo-protextify-warna.png";

export default function EmailVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("pending"); // pending, success, error, loading
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Tambahkan state errorMessage

  const email = location.state?.email || "";
  const justRegistered = location.state?.justRegistered || false;
  const verificationToken = searchParams.get("token");

  // Verifikasi email sesuai BE
  const verifyEmail = useCallback(
    async (token) => {
      setStatus("loading");
      setErrorMessage(""); // Reset error message
      try {
        await authService.verifyEmail(token); // payload { token }
        setStatus("success");
        toast.success("Email berhasil diverifikasi!");

        setTimeout(() => {
          navigate("/auth/login", {
            state: { message: "Email berhasil diverifikasi. Silakan login." },
          });
        }, 3000);
      } catch (error) {
        setStatus("error");
        const msg =
          error?.response?.data?.message ||
          "Verifikasi email gagal. Token mungkin tidak valid atau sudah kadaluarsa.";
        setErrorMessage(msg);
        toast.error(msg);
      }
    },
    [navigate]
  );

  useEffect(() => {
    // Jika ada token di URL, verifikasi otomatis
    if (verificationToken) {
      verifyEmail(verificationToken);
    }
  }, [verificationToken, verifyEmail]);

  useEffect(() => {
    // Countdown timer untuk resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Saat mount, cek cooldown di localStorage
  useEffect(() => {
    const cooldownKey = `resendCooldown:${email}`;
    const lastResend = localStorage.getItem(cooldownKey);
    if (lastResend) {
      const secondsLeft = Math.max(
        0,
        60 - Math.floor((Date.now() - Number(lastResend)) / 1000)
      );
      if (secondsLeft > 0) setCountdown(secondsLeft);
    }
  }, [email]);

  // Resend email verifikasi sesuai BE
  const resendVerification = async () => {
    if (!email || countdown > 0) return;

    setIsResending(true);
    try {
      await authService.sendVerification(email); // payload { email }
      toast.success("Email verifikasi telah dikirim ulang!");
      setCountdown(60); // 60 detik cooldown
      localStorage.setItem(`resendCooldown:${email}`, Date.now().toString());
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Gagal mengirim ulang email verifikasi. Silakan coba beberapa saat lagi."
      );
    } finally {
      setIsResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <LoadingSpinner size="lg" className="text-[#23407a]" />;
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case "error":
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Mail className="h-16 w-16 text-[#23407a]" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "loading":
        return {
          title: "Memverifikasi Email...",
          description: "Mohon tunggu, kami sedang memverifikasi email Anda.",
        };
      case "success":
        return {
          title: "Email Berhasil Diverifikasi!",
          description:
            "Akun Anda telah aktif. Anda akan diarahkan ke halaman login dalam beberapa detik.",
        };
      case "error":
        return {
          title: "Verifikasi Gagal",
          description:
            "Token verifikasi tidak valid atau sudah kadaluarsa. Silakan minta link verifikasi baru.",
        };
      default:
        return {
          title: justRegistered ? "Cek Email Anda" : "Verifikasi Email",
          description: justRegistered
            ? `Kami telah mengirim link verifikasi ke ${email}. Silakan cek email Anda dan klik link untuk mengaktifkan akun.`
            : "Silakan cek email Anda untuk link verifikasi atau minta link baru.",
        };
    }
  };

  const { title, description } = getStatusMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#0f1b3a] relative overflow-hidden">
      {/* Background Elements - Konsisten dengan Login/Register/Home/About */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      </div>

      <Container className="relative z-10 min-h-screen flex items-center justify-center py-32">
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg">
            <CardHeader className="text-center pb-6">
              <div className="mb-6">
                <img
                  className="mx-auto h-12 w-auto"
                  src={logo}
                  alt="Protextify"
                />
              </div>
              <CardTitle className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {title}
              </CardTitle>
              <p className="text-gray-600">{description}</p>
            </CardHeader>

            <CardContent className="text-center space-y-6">
              <div className="flex justify-center">{getStatusIcon()}</div>

              {/* Notifikasi dan tombol */}
              {status === "pending" && email && (
                <div className="space-y-4">
                  <Alert variant="info" title="Tidak menerima email?">
                    <ul className="text-sm text-left mt-2 space-y-1">
                      <li>• Cek folder spam/junk</li>
                      <li>• Pastikan email {email} benar</li>
                      <li>• Tunggu beberapa menit</li>
                    </ul>
                  </Alert>
                  <Button
                    onClick={resendVerification}
                    variant="outline"
                    className="w-full"
                    disabled={countdown > 0 || isResending}
                    loading={isResending}
                  >
                    {countdown > 0 ? (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Kirim ulang dalam {countdown}s
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Kirim Ulang Email
                      </>
                    )}
                  </Button>
                </div>
              )}

              {status === "error" && (
                <Alert
                  variant="error"
                  title="Verifikasi Gagal"
                  className="mb-4"
                >
                  {errorMessage ||
                    "Token verifikasi tidak valid atau sudah kadaluarsa. Silakan minta link verifikasi baru."}
                </Alert>
              )}

              {status === "error" && email && (
                <Button
                  onClick={resendVerification}
                  className="w-full"
                  variant="outline"
                  disabled={countdown > 0 || isResending}
                  loading={isResending}
                >
                  {countdown > 0
                    ? `Kirim ulang dalam ${countdown}s`
                    : "Minta Link Verifikasi Baru"}
                </Button>
              )}

              {status === "success" && (
                <div className="space-y-4">
                  <Alert variant="success" title="Berhasil!">
                    Akun Anda telah aktif dan siap digunakan.
                  </Alert>
                  <Button
                    onClick={() => navigate("/auth/login")}
                    className="w-full bg-[#23407a] hover:bg-[#1a2f5c] text-white font-semibold"
                  >
                    Lanjut ke Login
                  </Button>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/auth/login")}
                  className="w-full"
                >
                  Kembali ke Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
