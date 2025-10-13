// src/pages/instructor/BulkGrade.jsx
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Star, FileText } from "lucide-react";
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
  Breadcrumb,
  LoadingSpinner,
} from "../../components";
import { submissionsService } from "../../services";
import { formatDateTime } from "../../utils/helpers";

const bulkGradeSchema = z.object({
  grades: z.array(
    z.object({
      submissionId: z.string(),
      grade: z.coerce
        .number({ invalid_type_error: "Nilai harus angka" })
        .min(0, "Nilai minimal 0")
        .max(100, "Nilai maksimal 100"),
      feedback: z.string().optional(),
    })
  ),
});

export default function BulkGrade() {
  const { assignmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { selectedSubmissions } = location.state || { selectedSubmissions: [] };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bulkGradeSchema),
    defaultValues: {
      grades: [],
    },
  });

  useEffect(() => {
    if (selectedSubmissions.length === 0) {
      toast.error("Tidak ada submission yang dipilih.");
      navigate(`/instructor/assignments/${assignmentId}/monitor`);
      return;
    }
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const promises = selectedSubmissions.map((id) =>
        submissionsService.getSubmissionById(id)
      );
      const submissionData = await Promise.all(promises);
      setSubmissions(submissionData);

      const initialGrades = submissionData.map((sub) => ({
        submissionId: sub.id,
        grade: sub.grade || 0,
        feedback: sub.feedback || "",
      }));
      setValue("grades", initialGrades);
    } catch (error) {
      toast.error("Gagal memuat data submission yang dipilih.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    toast.promise(submissionsService.bulkGradeSubmissions(data), {
      loading: "Menyimpan semua nilai...",
      success: (res) => {
        navigate(`/instructor/assignments/${assignmentId}/monitor`);
        return res.message || "Nilai berhasil disimpan!";
      },
      error: (err) => err.response?.data?.message || "Gagal menyimpan nilai.",
    });
  };

  const handleGradeAll = (grade) => {
    const currentGrades = watch("grades") || [];
    const updatedGrades = currentGrades.map((g, index) => {
      setValue(`grades.${index}.grade`, grade);
      return { ...g, grade };
    });
  };

  if (loading) {
    return (
      <Container className="py-6 flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </Container>
    );
  }

  return (
    <Container className="py-6 space-y-6">
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              navigate(`/instructor/assignments/${assignmentId}/monitor`)
            }
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nilai Massal</h1>
            <p className="text-gray-600">
              Memberi nilai untuk {submissions.length} submission terpilih.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" /> Aksi Cepat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Terapkan nilai yang sama untuk semua submission di bawah ini.
          </p>
          <div className="flex flex-wrap gap-2">
            {[100, 90, 80, 70, 0].map((grade) => (
              <Button
                key={grade}
                variant="outline"
                size="sm"
                onClick={() => handleGradeAll(grade)}
              >
                Nilai Semua: {grade}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Grading Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {submissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {submission.student?.fullName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Dikumpulkan:{" "}
                        {submission.submittedAt
                          ? formatDateTime(submission.submittedAt)
                          : "-"}
                      </p>
                    </div>

                    <div className="flex w-full md:w-auto gap-4">
                      <div className="w-28">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nilai
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          {...register(`grades.${index}.grade`)}
                          className={`text-center font-semibold text-lg ${
                            errors.grades?.[index]?.grade
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors.grades?.[index]?.grade && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.grades[index].grade.message}
                          </p>
                        )}
                      </div>

                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Feedback
                        </label>
                        <Textarea
                          {...register(`grades.${index}.feedback`)}
                          placeholder="Feedback untuk siswa..."
                          className="resize-none h-24"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-end space-x-3 bg-white/80 backdrop-blur-sm py-4 px-6 sticky bottom-0 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate(`/instructor/assignments/${assignmentId}/monitor`)
            }
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            className="bg-[#23407a] hover:bg-[#1a2f5c]"
          >
            <Save className="h-4 w-4 mr-2" />
            Simpan {submissions.length} Nilai
          </Button>
        </div>
      </form>
    </Container>
  );
}
