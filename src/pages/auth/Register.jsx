// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  User,
  GraduationCap,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { registerSchema } from "../../utils/validation";
import { USER_ROLES } from "../../utils/constants";
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

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      role: "",
      institution: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      clearError();
      // Kirim payload sesuai BE
      const response = await registerUser({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: data.role,
        institution: data.institution,
      });

      // Setelah sukses, arahkan ke halaman verifikasi email
      navigate("/auth/email-verification", {
        state: { email: data.email, justRegistered: true },
      });
    } catch (error) {
      // Error sudah ditangani oleh context
    }
  };

  const handleGoogleRegister = () => {
    // Gunakan service untuk Google OAuth
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    // Atau: authService.googleLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#0f1b3a] relative overflow-hidden">
      {/* Background Elements - Konsisten dengan Login */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      </div>

      <Container className="relative z-10 min-h-screen flex items-center justify-center py-32">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 place-items-center items-start">
          {/* Left Side - Branding & Information */}
          <div className="hidden lg:block text-white">
            <div className="space-y-8">
              {/* Main Heading */}
              <div>
                <Badge
                  variant="glass"
                  className="mb-6 px-4 py-2 text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Bergabunglah Sekarang
                </Badge>

                <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Mulai Perjalanan{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Akademik
                  </span>
                  <br />
                  yang Berkualitas
                </h1>

                <p className="text-xl text-white/80 leading-relaxed mb-8">
                  Daftar sekarang dan rasakan pengalaman mengelola tugas
                  akademik dengan teknologi AI terdepan. Bergabunglah dengan
                  ribuan educator yang telah mempercayai Protextify.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-4">
                {[
                  {
                    icon: <Shield className="w-5 h-5" />,
                    text: "Gratis untuk siswa",
                  },
                  {
                    icon: <Sparkles className="w-5 h-5" />,
                    text: "Setup instant dalam 2 menit",
                  },
                  {
                    icon: <CheckCircle className="w-5 h-5" />,
                    text: "Dukungan 24/7",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-green-400">
                      {item.icon}
                    </div>
                    <span className="text-white/90">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">500</div>
                    <div className="text-sm text-white/70">Pengguna Aktif</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-sm text-white/70">Institusi</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">99%</div>
                    <div className="text-sm text-white/70">Akurasi AI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
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
                  Daftar Akun Baru
                </CardTitle>
                <p className="text-gray-600">
                  Bergabunglah dengan platform Protextify untuk pengalaman
                  pembelajaran yang lebih baik
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {error && (
                    <Alert
                      variant="error"
                      title="Registrasi Gagal"
                      className="mb-4"
                    >
                      {error}
                    </Alert>
                  )}

                  <div className="space-y-4">
                    {/* Role Selection - Enhanced Design */}
                    <div>
                      <label
                        htmlFor="role-student"
                        className="block text-sm font-medium text-gray-700 mb-3"
                      >
                        Saya adalah... <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label
                          className="relative group"
                          htmlFor="role-student"
                        >
                          <input
                            type="radio"
                            id="role-student"
                            value={USER_ROLES.STUDENT}
                            {...register("role")}
                            className="sr-only peer"
                            disabled={loading}
                          />
                          <div className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-200 hover:border-[#23407a] hover:shadow-md peer-checked:border-[#23407a] peer-checked:bg-[#23407a]/5 peer-checked:shadow-lg group-hover:scale-[1.02]">
                            <div className="flex flex-col items-center text-center">
                              <User className="h-8 w-8 text-gray-400 peer-checked:text-[#23407a] mb-3 transition-colors" />
                              <span className="font-semibold text-gray-900 mb-1">
                                Siswa
                              </span>
                              <span className="text-xs text-gray-500 leading-tight">
                                Mengerjakan tugas
                              </span>
                            </div>
                          </div>
                        </label>

                        <label
                          className="relative group"
                          htmlFor="role-instructor"
                        >
                          <input
                            type="radio"
                            id="role-instructor"
                            value={USER_ROLES.INSTRUCTOR}
                            {...register("role")}
                            className="sr-only peer"
                            disabled={loading}
                          />
                          <div className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-200 hover:border-[#23407a] hover:shadow-md peer-checked:border-[#23407a] peer-checked:bg-[#23407a]/5 peer-checked:shadow-lg group-hover:scale-[1.02]">
                            <div className="flex flex-col items-center text-center">
                              <GraduationCap className="h-8 w-8 text-gray-400 peer-checked:text-[#23407a] mb-3 transition-colors" />
                              <span className="font-semibold text-gray-900 mb-1">
                                Pengajar
                              </span>
                              <span className="text-xs text-gray-500 leading-tight">
                                Mengelola tugas
                              </span>
                            </div>
                          </div>
                        </label>
                      </div>
                      {errors.role && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.role.message}
                        </p>
                      )}
                    </div>

                    {/* Form Fields - Enhanced with consistent styling */}
                    <div>
                      <Input
                        label="Nama Lengkap"
                        type="text"
                        {...register("fullName")}
                        error={errors.fullName?.message}
                        placeholder="Masukkan nama lengkap"
                        autoComplete="name"
                        disabled={loading}
                        className="h-12 text-base"
                        required
                      />
                    </div>

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
                        required
                      />
                    </div>

                    <div>
                      <Input
                        label="Institusi"
                        type="text"
                        {...register("institution")}
                        error={errors.institution?.message}
                        placeholder="Nama sekolah/universitas"
                        disabled={loading}
                        className="h-12 text-base"
                        required
                      />
                    </div>

                    <div>
                      <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        error={errors.password?.message}
                        placeholder="Minimal 6 karakter"
                        autoComplete="new-password"
                        disabled={loading}
                        className="h-12 text-base"
                        required
                        helperText="Password harus mengandung huruf besar, kecil, dan angka"
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

                  {/* Terms & Conditions - Enhanced */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="terms"
                        className="mt-1 h-4 w-4 text-[#23407a] border-gray-300 rounded focus:ring-[#23407a] focus:ring-2"
                        required
                        disabled={loading}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm text-gray-600 leading-relaxed"
                      >
                        Saya setuju dengan{" "}
                        <Link
                          to="/terms"
                          className="font-medium text-[#23407a] hover:text-[#1a2f5c] underline"
                        >
                          Syarat & Ketentuan
                        </Link>{" "}
                        dan{" "}
                        <Link
                          to="/privacy"
                          className="font-medium text-[#23407a] hover:text-[#1a2f5c] underline"
                        >
                          Kebijakan Privasi
                        </Link>{" "}
                        Protextify
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
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
                          Daftar Sekarang
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

                  {/* Google Register - Enhanced */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-200 hover:border-[#23407a] hover:bg-gray-50 transition-all duration-200 hover:text-gray-600"
                    onClick={handleGoogleRegister}
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
                    <span className="font-medium">Daftar dengan Google</span>
                  </Button>

                  {/* Bottom Links */}
                  <div className="text-center">
                    <span className="text-sm text-gray-600">
                      Sudah punya akun?{" "}
                      <Link
                        to="/auth/login"
                        className="font-semibold text-[#23407a] hover:text-[#1a2f5c] transition-colors"
                      >
                        Masuk di sini
                      </Link>
                    </span>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Mobile Trust Indicators */}
            <div className="lg:hidden mt-8 text-center">
              <div className="flex justify-center space-x-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Gratis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">Setup 2 Menit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Support 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
