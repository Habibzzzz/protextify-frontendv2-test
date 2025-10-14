import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services";
import { getDefaultRoute } from "../../utils/constants";
import {
  LoadingSpinner,
  Container,
  Card,
  CardContent,
  Alert,
} from "../../components";
import logo from "@/assets/logo-protextify-warna.png";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearError, isAuthenticated, user, ...authContext } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        const errorMessage = errorDescription || "Google login failed";
        clearError();
        toast.error(`Login Google gagal: ${errorMessage}`);
        navigate("/auth/login", { replace: true });
        return;
      }

      if (token) {
        try {
          localStorage.setItem("token", token);
          // Ambil user dari BE menggunakan token yang baru saja disimpan
          const response = await authService.getGoogleUser();
          const { accessToken, user } = response;
          localStorage.setItem("token", accessToken);
          localStorage.setItem("user", JSON.stringify(user));
          // Update context secara manual
          if (authContext && authContext.dispatch) {
            authContext.dispatch({
              type: "LOGIN_SUCCESS",
              payload: { user, token: accessToken },
            });
          }
          toast.success(`Selamat datang, ${user.fullName}!`);
          navigate(getDefaultRoute(user.role), { replace: true });
        } catch (error) {
          clearError();
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.error(
            error?.response?.data?.message ||
              error?.message ||
              "Gagal mendapatkan informasi pengguna"
          );
          navigate("/auth/login", { replace: true });
        }
      } else {
        clearError();
        toast.error("Token tidak ditemukan");
        navigate("/auth/login", { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, navigate, clearError, authContext]);

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
            <CardContent className="text-center py-12">
              <div className="mb-6">
                <img
                  className="mx-auto h-12 w-auto"
                  src={logo}
                  alt="Protextify"
                />
              </div>
              <div className="flex justify-center">
                <LoadingSpinner size="lg" className="mb-4" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Memproses Login Google
              </h2>
              <p className="text-gray-600 text-base">
                Mohon tunggu, kami sedang memverifikasi akun Google Anda...
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default GoogleCallback;
