import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  BookOpen,
  Save,
  Users,
  Info,
  Eye,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

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
  Tooltip,
} from "../../components";
import { classesService } from "../../services";
import { createClassSchema } from "../../utils/validation";

export default function CreateClass() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const nameValue = watch("name");
  const descriptionValue = watch("description");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await classesService.createClass(data);

      toast.success("Kelas berhasil dibuat!");
      
      // Navigate to dashboard first to refresh data
      navigate("/instructor/dashboard", {
        state: {
          refreshDashboard: true,
          newClass: response,
        },
      });
      
      // Then navigate to class detail after a short delay
      setTimeout(() => {
        navigate(`/instructor/classes/${response.id}`, {
          state: {
            classToken: response.classToken,
            isNewClass: true,
          },
        });
      }, 1000);
    } catch (error) {
      console.error("Error creating class:", error);
      // Error sudah ditangani oleh api interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-8">
      {/* Enhanced Header Section with Gradient Background */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#162849] rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"></div>

        <div className="relative px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-white/70 text-sm font-medium">
                  Buat Kelas
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Buat Kelas Baru 🎓
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Mulai perjalanan mengajar Anda dengan membuat kelas baru. Undang
                siswa dan kelola pembelajaran dengan mudah.
              </p>
            </div>

            {/* Enhanced Back Button with Glass Effect */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/instructor/classes")}
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Kembali ke Kelas
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb - moved after header */}
      <Breadcrumb />

      {/* Enhanced Two-Column Layout */}
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#23407a]/10 to-blue-500/10 rounded-full transform translate-x-16 -translate-y-16"></div>

                <CardHeader className="relative z-10 pb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#23407a]/10 rounded-2xl">
                      <BookOpen className="h-8 w-8 text-[#23407a]" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        Informasi Kelas
                      </CardTitle>
                      <p className="text-gray-600 text-sm mt-1">
                        Lengkapi informasi dasar untuk kelas Anda
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 space-y-8">
                  {/* Enhanced Name Input */}
                  <div className="space-y-3">
                    <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
                      <BookOpen className="h-4 w-4 mr-2 text-[#23407a]" />
                      Nama Kelas
                      <span className="text-red-500 ml-1">*</span>
                      <Tooltip content="Berikan nama yang jelas dan mudah diidentifikasi">
                        <Info className="h-4 w-4 ml-2 text-gray-400 hover:text-[#23407a] transition-colors" />
                      </Tooltip>
                    </label>

                    <Input
                      {...register("name")}
                      placeholder="Contoh: Matematika Diskrit - Semester Genap 2025"
                      className="h-12 text-lg border-2 border-gray-300 focus:border-[#23407a] rounded-xl"
                      error={errors.name?.message}
                    />

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">
                        💡 Gunakan nama yang deskriptif dan mudah dicari
                      </span>
                      <span
                        className={`font-medium ${
                          (nameValue?.length || 0) > 80
                            ? "text-orange-600"
                            : "text-gray-500"
                        }`}
                      >
                        {nameValue?.length || 0}/100 karakter
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Description Input */}
                  <div className="space-y-3">
                    <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
                      <FileText className="h-4 w-4 mr-2 text-[#23407a]" />
                      Deskripsi Kelas
                      <span className="text-gray-500 ml-1 font-normal">
                        (Opsional)
                      </span>
                      <Tooltip content="Deskripsi akan membantu siswa memahami konten kelas">
                        <Info className="h-4 w-4 ml-2 text-gray-400 hover:text-[#23407a] transition-colors" />
                      </Tooltip>
                    </label>

                    <Textarea
                      {...register("description")}
                      placeholder="Jelaskan materi, tujuan pembelajaran, atau informasi penting lainnya tentang kelas ini..."
                      rows={5}
                      className="border-2 border-gray-300 focus:border-[#23407a] rounded-xl resize-none"
                      error={errors.description?.message}
                    />

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">
                        📝 Deskripsi yang baik membantu siswa memahami
                        ekspektasi kelas
                      </span>
                      <span
                        className={`font-medium ${
                          (descriptionValue?.length || 0) > 450
                            ? "text-orange-600"
                            : "text-gray-500"
                        }`}
                      >
                        {descriptionValue?.length || 0}/500 karakter
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => navigate("/instructor/classes")}
                      disabled={loading}
                      className="order-2 sm:order-1"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      size="lg"
                      className="order-1 sm:order-2 bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      Buat Kelas Sekarang
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Preview & Info */}
            <div className="space-y-6">
              {/* Live Preview Card */}
              {nameValue && (
                <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>

                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500 rounded-xl shadow-lg">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-green-800">
                          Preview Kelas
                        </CardTitle>
                        <p className="text-green-700 text-sm">
                          Tampilan untuk siswa
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="bg-white rounded-xl p-4 border border-green-200/50 shadow-sm">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                        {nameValue}
                      </h3>
                      {descriptionValue && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {descriptionValue}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>0 siswa</span>
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            <span>0 tugas</span>
                          </div>
                        </div>
                        <span className="text-green-600 font-medium">
                          Baru dibuat
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Info Cards */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-500 rounded-2xl shadow-lg flex-shrink-0">
                      <Info className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900 mb-3">
                        Yang Perlu Diketahui
                      </h3>
                      <div className="space-y-3 text-sm text-blue-800">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">
                              1
                            </span>
                          </div>
                          <p>
                            Token kelas unik akan dibuat otomatis untuk siswa
                            bergabung
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">
                              2
                            </span>
                          </div>
                          <p>
                            Anda dapat mengundang siswa dan membuat tugas
                            setelah kelas dibuat
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">
                              3
                            </span>
                          </div>
                          <p>
                            Semua pengaturan dapat diubah kapan saja melalui
                            menu settings
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">
                              4
                            </span>
                          </div>
                          <p>
                            Membuat kelas gratis, pembayaran hanya untuk tugas
                            aktif
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-purple-500 rounded-2xl shadow-lg flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-900 mb-3">
                        Fitur Kelas
                      </h3>
                      <div className="grid grid-cols-1 gap-2 text-sm text-purple-800">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Manajemen tugas dan deadline</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Deteksi plagiarisme otomatis</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Sistem penilaian dan feedback</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Analytics dan laporan progress</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Notifikasi real-time</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Container>
  );
}
