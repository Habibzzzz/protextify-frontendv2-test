import { useState } from "react";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Container,
  Alert,
} from "../../components";
import { authService } from "../../services";
import logo from "@/assets/logo-protextify-warna.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    setSuccessMsg("");
    try {
      // Kirim request ke service sesuai BE
      const response = await authService.forgotPassword(email);
      setStatus("success");
      setSuccessMsg(
        response.message ||
          "Jika email terdaftar, link reset password akan dikirim ke email Anda."
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal mengirim permintaan reset password"
      );
      setStatus("error");
    }
  };

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
                Lupa Password
              </CardTitle>
              <p className="text-gray-600">
                Masukkan email Anda untuk mendapatkan link reset password
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Masukkan email Anda"
                  className="h-12 text-base"
                />
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                  loading={status === "loading"}
                >
                  {status === "loading"
                    ? "Memproses..."
                    : "Kirim Link Reset Password"}
                </Button>
                {status === "success" && (
                  <Alert variant="success" title="Berhasil!">
                    {successMsg}
                  </Alert>
                )}
                {status === "error" && (
                  <Alert variant="error" title="Gagal">
                    {error}
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
