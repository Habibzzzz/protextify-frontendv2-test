/**
 * Mapping utama:
 * - usersService.getCurrentUser() -> profil user (id, email, fullName, institution, role, emailVerified, createdAt, updatedAt)
 * - usersService.updateProfile({ fullName?, institution? }) -> profil user terbaru
 * - Tidak render data/fitur yang tidak dikirim BE.
 */

import React, { useState } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Alert,
  LoadingSpinner,
  Breadcrumb,
} from "../../components";
import { usersService, authService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useApi } from "../../hooks/useApi";
import { updateProfileSchema } from "../../utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  GraduationCap,
  ShieldCheck,
  Edit2,
  Save,
  KeyRound,
  Info,
  Calendar,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "../../utils/helpers";

export default function StudentProfile() {
  const {
    data: user,
    loading,
    error,
    refetch,
  } = useAsyncData(() => usersService.getCurrentUser(), [], {
    refetchOnWindowFocus: true,
    pollIntervalMs: 10000,
  });

  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: "",
      institution: "",
      phone: "",
    },
  });

  const { loading: saving, error: saveError, execute: saveProfile } = useApi();
  const { loading: sendingLink, execute: doSendLink } = useApi();

  // Sync form with user data
  React.useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || "",
        institution: user.institution || "",
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  // Handle save
  const onSave = async (data) => {
    try {
      await saveProfile(() => usersService.updateProfile(data), {
        loadingMessage: "Menyimpan perubahan...",
        successMessage: "Profil berhasil diperbarui",
        showSuccessToast: true,
      });
      setIsEditing(false);
      refetch();
    } catch (err) {
      // Error toast is handled by useApi hook
    }
  };

  // Avatar (initial)
  const avatar = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U";
  const roleLabel = user?.role === "INSTRUCTOR" ? "Instructor" : "Student";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Container className="py-8">
      {/* Header Section */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#162849] rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"></div>
        <div className="relative px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-white/70 text-sm font-medium">
                  Profil Saya
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Profil Akun {roleLabel}
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Lihat dan perbarui data profil Anda agar informasi akun tetap
                akurat dan mudah dikelola.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Loading/Error State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Alert variant="error" className="mb-8">
          <p>Gagal memuat data profil: {error.message}</p>
          <Button size="sm" onClick={refetch} className="mt-3">
            Coba Lagi
          </Button>
        </Alert>
      ) : (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column: Profile Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
              <CardHeader className="relative z-10 pb-6 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#23407a] to-[#3b5fa4] text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                    {avatar}
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {isEditing ? "Edit Profil" : user?.fullName || "-"}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      {user?.role === "STUDENT" ? "Siswa" : user?.role}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 pt-8">
                <form onSubmit={handleSubmit(onSave)} className="space-y-6">
                  {/* Form Fields */}
                  <ProfileField
                    label="Nama Lengkap"
                    name="fullName"
                    icon={User}
                    register={register}
                    isEditing={isEditing}
                    error={errors.fullName}
                    placeholder="Nama lengkap Anda"
                    watch={watch}
                  />
                  <ProfileField
                    label="Institusi"
                    name="institution"
                    icon={GraduationCap}
                    register={register}
                    isEditing={isEditing}
                    error={errors.institution}
                    placeholder="Nama institusi Anda"
                    watch={watch}
                  />
                  <ProfileField
                    label="Nomor Telepon"
                    name="phone"
                    icon={User}
                    register={register}
                    isEditing={isEditing}
                    error={errors.phone}
                    placeholder="Contoh: 081234567890"
                    watch={watch}
                  />

                  {/* Error Alert */}
                  {saveError && (
                    <Alert variant="error" className="mb-4">
                      <p>{saveError.message}</p>
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <AnimatePresence mode="wait">
                      {isEditing ? (
                        <motion.div
                          key="edit-buttons"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                          className="flex justify-end space-x-3"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="lg"
                            onClick={() => {
                              setIsEditing(false);
                              reset({
                                fullName: user?.fullName || "",
                                institution: user?.institution || "",
                                phone: user?.phone || "",
                              });
                            }}
                            disabled={saving}
                          >
                            Batal
                          </Button>
                          <Button
                            type="submit"
                            loading={saving}
                            disabled={!isDirty || saving}
                            size="lg"
                            className="bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            aria-label="Simpan Perubahan"
                          >
                            <Save className="h-5 w-5 mr-2" />
                            Simpan Perubahan
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="view-button"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={() => setIsEditing(true)}
                            className="border-2 border-[#23407a]/30 text-[#23407a] hover:bg-[#23407a] hover:text-white transition-all duration-300"
                            aria-label="Edit Profil"
                          >
                            <Edit2 className="h-5 w-5 mr-2" />
                            Edit Profil
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Security & Info */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <KeyRound className="h-5 w-5 text-[#23407a]" />
                  <span>Keamanan Akun</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Untuk mengubah kata sandi, kami akan mengirimkan tautan aman
                  ke email terdaftar Anda.
                </p>
                <Button
                  type="button"
                  loading={sendingLink}
                  onClick={() =>
                    doSendLink(() => authService.forgotPassword(user.email), {
                      loadingMessage: "Mengirim tautan...",
                      successMessage: "Tautan reset terkirim ke email Anda",
                      showSuccessToast: true,
                    })
                  }
                  className="w-full bg-[#23407a] hover:bg-[#1a2f5c]"
                >
                  Kirim Tautan Reset
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-[#23407a]" />
                  <span>Informasi Akun</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoItem icon={Mail} label="Email" value={user?.email} />
                <InfoItem
                  icon={ShieldCheck}
                  label="Status Email"
                  value={
                    user?.emailVerified ? "Terverifikasi" : "Belum Diverifikasi"
                  }
                  valueColor={
                    user?.emailVerified ? "text-green-600" : "text-yellow-600"
                  }
                />
                <InfoItem
                  icon={Calendar}
                  label="Bergabung Pada"
                  value={formatDate(user?.createdAt)}
                />
                <InfoItem
                  icon={RefreshCw}
                  label="Terakhir Diperbarui"
                  value={formatDate(user?.updatedAt)}
                />
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </Container>
  );
}

// Helper component for profile fields
function ProfileField({
  label,
  name,
  icon: Icon,
  register,
  isEditing,
  error,
  placeholder,
  watch, // Tambahkan prop watch
}) {
  const value = watch ? watch(name) : ""; // Ambil value dari form state

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5 text-gray-400 flex-shrink-0" />
        {isEditing ? (
          <Input
            {...register(name)}
            placeholder={placeholder}
            error={error?.message}
            className="flex-1"
            value={value ?? ""}
          />
        ) : (
          <p className="text-gray-800 text-base w-full py-2 px-3 bg-gray-100 rounded-md">
            {value || "-"}
          </p>
        )}
      </div>
      {error && isEditing && (
        <p className="text-xs text-red-600 mt-1 ml-8">{error.message}</p>
      )}
    </div>
  );
}

// Helper component for info items
function InfoItem({ icon: Icon, label, value, valueColor = "text-gray-800" }) {
  return (
    <div className="flex items-start space-x-3 text-sm">
      <Icon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-medium text-gray-600">{label}</p>
        <p className={`font-semibold ${valueColor}`}>{value || "-"}</p>
      </div>
    </div>
  );
}
