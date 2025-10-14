import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight, Shield, Sparkles } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { loginSchema } from "../../utils/validation";
import { getDefaultRoute } from "../../utils/constants"; // ✅ Pastikan import ini ada
import {
  Button,
  Input,
  Alert,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Container,
  Badge,
} from "../../components";
import logo from "@/assets/logo-protextify-warna.png";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;
  const { login, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Get the page user was trying to access
  const from = location.state?.from?.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      clearError();
      const response = await login({
        email: data.email,
        password: data.password,
      });
      if (response && response.user) {
        const redirectPath = getDefaultRoute(response.user.role);
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 100);
      }
      // Tidak perlu else, error akan ditangani catch
    } catch (error) {
      // Error sudah ditangani oleh context, tidak perlu navigate
      // Pesan error akan muncul di <Alert> pada form
    }
  };

  const handleGoogleLogin = () => {
    // Gunakan endpoint BE untuk Google OAuth
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    // Atau: authService.googleLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#0f1b3a] relative overflow-hidden">
      {/* Background Elements - Konsisten dengan Home/About */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      </div>

      <Container className="relative z-10 min-h-screen flex items-center justify-center py-32">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 place-items-center items-center">
          {/* Left Side - Branding & Information */}
          <div className="hidden lg:block text-white">
            <div className="space-y-8">
              {/* Main Heading */}
              <div>
                <Badge
                  variant="glass"
                  className="mb-6 px-4 py-2 text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Platform Terpercaya
                </Badge>

                <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Selamat Datang di{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Protextify
                  </span>
                </h1>

                <p className="text-xl text-white/80 leading-relaxed mb-8">
                  Platform deteksi plagiarisme terdepan dengan teknologi AI yang
                  membantu
                  <br />
                  institusi pendidikan menjaga integritas akademik dan
                  meningkatkan kualitas pembelajaran.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-4">
                {[
                  {
                    icon: <Shield className="w-5 h-5" />,
                    text: "Keamanan tingkat enterprise",
                  },
                  {
                    icon: <Sparkles className="w-5 h-5" />,
                    text: "99% akurasi deteksi AI",
                  },
                  {
                    icon: <ArrowRight className="w-5 h-5" />,
                    text: "Trusted by 50+ institusi",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-blue-400">
                      {item.icon}
                    </div>
                    <span className="text-white/90">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <p className="text-white/80 italic mb-3">
                  "Protextify telah mengubah cara mengelola tugas dan menjaga
                  integritas akademik. Platform yang sangat recommended!"
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg">
              <CardHeader className="text-center pb-6">
                {/* Mobile Logo */}
                <div className="mb-6 lg:hidden">
                  <img
                    className="mx-auto h-12 w-auto"
                    src={logo}
                    alt="Protextify"
                  />
                </div>

                <CardTitle className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Masuk ke Akun Anda
                </CardTitle>
                <p className="text-gray-600">
                  Silakan masuk untuk mengakses platform Protextify
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {successMessage && (
                  <Alert variant="success" title="Berhasil!" className="mb-4">
                    {successMessage}
                  </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {error && (
                    <Alert variant="error" title="Login Gagal" className="mb-4">
                      {typeof error === "object" ? error.message : error}
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Input
                        label="Email"
                        type="email"
                        {...register("email")}
                        error={errors.email?.message}
                        placeholder="nama@email.com"
                        autoComplete="email"
                        disabled={loading}
                        className="h-12 text-base"
                      />
                    </div>

                    <div>
                      <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        error={errors.password?.message}
                        placeholder="Masukkan password"
                        autoComplete="current-password"
                        disabled={loading}
                        className="h-12 text-base"
                        rightElement={
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                      loading={loading}
                      disabled={loading}
                    >
                      {loading ? (
                        "Memproses..."
                      ) : (
                        <>
                          Masuk
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-gray-500 font-medium">
                        atau
                      </span>
                    </div>
                  </div>

                  {/* Google Login - Enhanced */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-200 hover:border-[#23407a] hover:bg-gray-50 transition-all duration-200 hover:text-gray-600"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="font-medium">Masuk dengan Google</span>
                  </Button>

                  {/* Bottom Links */}
                  <div className="space-y-4 text-center">
                    <div>
                      <span className="text-sm text-gray-600">
                        Belum punya akun?{" "}
                        <Link
                          to="/auth/register"
                          className="font-semibold text-[#23407a] hover:text-[#1a2f5c] transition-colors"
                        >
                          Daftar sekarang
                        </Link>
                      </span>
                    </div>

                    {/* Forgot Password - Aktifkan link */}
                    <div>
                      <Link
                        to="/auth/forgot-password"
                        className="text-xs text-[#23407a] hover:text-[#1a2f5c] transition-colors underline"
                      >
                        Lupa password?
                      </Link>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Mobile Trust Indicators */}
            <div className="lg:hidden mt-8 text-center">
              <div className="flex justify-center space-x-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Aman</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">99% Akurat</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4" />
                  <span className="text-sm">Terpercaya</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
