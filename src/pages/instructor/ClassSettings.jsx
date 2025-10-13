// src/pages/instructor/ClassSettings.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Settings,
  Save,
  Trash2,
  AlertTriangle,
  Copy,
  RefreshCw,
  Users,
  FileText,
  BookOpen,
} from "lucide-react";
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
  Modal,
  LoadingSpinner,
} from "../../components";
import { classesService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import { updateClassSchema } from "../../utils/validation";

export default function ClassSettings() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  const {
    data: classDetail,
    loading: fetchLoading,
    error,
    refetch,
  } = useAsyncData(() => classesService.getClassById(classId), [classId]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(updateClassSchema),
  });

  useEffect(() => {
    if (classDetail) {
      reset({
        name: classDetail.name,
        description: classDetail.description || "",
      });
    }
  }, [classDetail, reset]);

  const onSubmit = async (data) => {
    await toast.promise(classesService.updateClass(classId, data), {
      loading: "Menyimpan perubahan...",
      success: () => {
        refetch();
        return "Pengaturan kelas berhasil diperbarui!";
      },
      error: (err) =>
        err.response?.data?.message || "Gagal menyimpan perubahan.",
    });
  };

  const handleDeleteClass = async () => {
    await toast.promise(classesService.deleteClass(classId), {
      loading: "Menghapus kelas...",
      success: () => {
        navigate("/instructor/classes");
        return "Kelas berhasil dihapus!";
      },
      error: (err) => err.response?.data?.message || "Gagal menghapus kelas.",
    });
    setShowDeleteModal(false);
  };

  const regenerateToken = async () => {
    await toast.promise(classesService.regenerateClassToken(classId), {
      loading: "Membuat token baru...",
      success: () => {
        refetch();
        return "Token kelas berhasil diperbarui!";
      },
      error: (err) =>
        err.response?.data?.message || "Gagal membuat token baru.",
    });
    setShowRegenerateModal(false);
  };

  const copyClassToken = () => {
    navigator.clipboard.writeText(classDetail?.classToken);
    toast.success("Token kelas disalin!");
  };

  if (fetchLoading) {
    return (
      <Container className="py-6 flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-6">
        <Alert variant="error" title="Gagal Memuat Data">
          <p>{error.message || "Terjadi kesalahan saat mengambil data."}</p>
          <Button onClick={refetch} size="sm" className="mt-4">
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {/* Header Section */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#162849] rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"></div>
        <div className="relative px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-white/70 text-sm font-medium">
                  Pengaturan Kelas
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 truncate max-w-2xl">
                {classDetail?.name}
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Ubah informasi dasar, kelola akses, dan atur statistik kelas
                Anda.
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(`/instructor/classes/${classId}`)}
              className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali ke Detail Kelas
            </Button>
          </div>
        </div>
      </div>

      <Breadcrumb />

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column - Main Settings */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Settings Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-[#23407a]" />
                Informasi Dasar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Kelas
                  </label>
                  <Input
                    {...register("name")}
                    placeholder="Contoh: Kalkulus Lanjutan 2025"
                    error={errors.name?.message}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <Textarea
                    {...register("description")}
                    placeholder="Deskripsi singkat mengenai kelas ini..."
                    rows={4}
                    error={errors.description?.message}
                  />
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={!isDirty || isSubmitting}
                    className="bg-[#23407a] hover:bg-[#1a2f5c]"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Side Info */}
        <div className="space-y-8">
          {/* Token Management Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Copy className="h-5 w-5 mr-2 text-[#23407a]" />
                Token Kelas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg border">
                <span className="font-mono text-lg font-bold text-gray-800 flex-1 truncate">
                  {classDetail?.classToken}
                </span>
                <Button size="sm" variant="outline" onClick={copyClassToken}>
                  Salin
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowRegenerateModal(true)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Buat Token Baru
              </Button>
            </CardContent>
          </Card>

          {/* Class Statistics Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-[#23407a]" />
                Statistik
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {classDetail?.enrollments?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Siswa</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {classDetail?.assignments?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Tugas</p>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone Card */}
          <Card className="border-red-200 bg-red-50/30">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-red-800">
                Tindakan ini akan menghapus kelas beserta semua data terkait
                secara permanen dan tidak dapat dibatalkan.
              </p>
              <Button
                variant="outline"
                className="w-full border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Kelas Ini
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Konfirmasi Hapus Kelas"
      >
        <p className="text-gray-600 mb-4">
          Apakah Anda yakin ingin menghapus kelas "{classDetail?.name}"?
        </p>
        <Alert variant="error">
          <strong>Data berikut akan dihapus permanen:</strong>
          <ul className="list-disc list-inside mt-2 text-sm">
            <li>{classDetail?.enrollments?.length || 0} data siswa</li>
            <li>{classDetail?.assignments?.length || 0} data tugas</li>
            <li>Semua submission dan laporan plagiarisme terkait</li>
          </ul>
        </Alert>
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteClass}
            loading={isSubmitting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Ya, Hapus Kelas
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showRegenerateModal}
        onClose={() => setShowRegenerateModal(false)}
        title="Buat Token Baru?"
      >
        <p className="text-gray-600">
          Token lama akan segera tidak valid. Pastikan Anda membagikan token
          baru kepada siswa yang belum bergabung.
        </p>
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setShowRegenerateModal(false)}
          >
            Batal
          </Button>
          <Button
            onClick={regenerateToken}
            className="bg-[#23407a] hover:bg-[#1a2f5c]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Ya, Buat Token Baru
          </Button>
        </div>
      </Modal>
    </Container>
  );
}
