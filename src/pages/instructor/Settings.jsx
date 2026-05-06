import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  Save,
  User,
  Shield,
  Building2,
  Phone,
  Mail,
  KeyRound,
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
  Breadcrumb,
} from "../../components";
import { storageService, authService } from "../../services";
import { updateProfileSchema } from "../../utils/validation";

export default function InstructorSettings() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [sendingResetLink, setSendingResetLink] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    "/src/assets/logo-protextify-warna.png"
  );
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || "",
        institution: user.institution || "",
        phone: user.phone || "",
        avatarUrl: user.avatarUrl || "",
      });
      setAvatarPreview(
        user.avatarUrl || "/src/assets/logo-protextify-warna.png"
      );
    }
  }, [user, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.error("Ukuran file maksimal adalah 2MB.");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    let finalData = { ...data };

    if (avatarFile) {
      const uploadToast = toast.loading("Mengunggah foto profil...");
      try {
        const response = await storageService.uploadFile(avatarFile);
        // Asumsi base URL storage ada di env. Ganti jika perlu.
        const storageBaseUrl =
          import.meta.env.VITE_STORAGE_BASE_URL ||
          "https://your-storage-base-url.com";
        const fullAvatarUrl = `${storageBaseUrl}/${response.cloudKey}`;
        finalData.avatarUrl = fullAvatarUrl;
        toast.dismiss(uploadToast);
      } catch (error) {
        toast.dismiss(uploadToast);
        toast.error("Gagal mengunggah foto profil.");
        return; // Hentikan proses jika upload gagal
      }
    }

    try {
      await updateUser(finalData);
      // Reset form ke state baru untuk membersihkan status 'isDirty'
      reset(finalData);
      setAvatarFile(null); // Hapus state file setelah berhasil
    } catch (error) {
      // Error sudah ditangani oleh updateUser di AuthContext
    }
  };

  return (
    <Container className="py-8">
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between my-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#23407a]/10 text-[#23407a] flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Pengaturan Akun
            </h1>
            <p className="text-gray-600">
              Perbarui profil dan informasi akun Anda.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Security */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Foto Profil</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-4">
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-[#23407a] text-white rounded-full flex items-center justify-center hover:bg-[#1a2f5c] transition-all duration-300 shadow-md"
                    aria-label="Ubah foto profil"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  JPG, PNG, atau WEBP. Ukuran maks 2MB.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-[#23407a]" />
                  Keamanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 flex items-start gap-2">
                  <KeyRound className="w-4 h-4 mt-0.5 shrink-0 text-[#23407a]" />
                  <span>
                    Untuk mengubah kata sandi, kami mengirim tautan aman ke
                    email terdaftar (sama seperti menu Pengaturan di desktop).
                    Otentikasi dua faktor (2FA) tetap dalam rencana pengembangan.
                  </span>
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={sendingResetLink || !user?.email}
                  loading={sendingResetLink}
                  onClick={async () => {
                    if (!user?.email) return;
                    setSendingResetLink(true);
                    try {
                      await toast.promise(
                        authService.forgotPassword(user.email),
                        {
                          loading: "Mengirim tautan...",
                          success:
                            "Tautan reset terkirim — periksa email Anda.",
                          error: (err) =>
                            err?.response?.data?.message ||
                            "Gagal mengirim tautan reset.",
                        }
                      );
                    } finally {
                      setSendingResetLink(false);
                    }
                  }}
                >
                  Kirim Tautan Reset Kata Sandi
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Profile Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Informasi Profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nama Lengkap"
                    {...register("fullName")}
                    error={errors.fullName?.message}
                    icon={User}
                  />
                  <Input
                    label="Email"
                    value={user?.email || ""}
                    disabled
                    readOnly
                    icon={Mail}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Institusi"
                    {...register("institution")}
                    error={errors.institution?.message}
                    icon={Building2}
                  />
                  <Input
                    label="Nomor Telepon"
                    {...register("phone")}
                    error={errors.phone?.message}
                    placeholder="+62 812-3456-7890"
                    icon={Phone}
                  />
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isDirty && !avatarFile}
                    loading={isSubmitting}
                    className="bg-[#23407a] hover:bg-[#1a2f5c]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Container>
  );
}
