import { useState, useCallback, useEffect } from "react";
import { submissionsService } from "../services";
import toast from "react-hot-toast";

export const useDraftManager = (submissionId) => {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load submission data
  const loadSubmission = useCallback(async () => {
    if (!submissionId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await submissionsService.getSubmissionById(submissionId);
      setSubmission(data);
    } catch (err) {
      const formattedError = {
        statusCode: err?.response?.data?.statusCode || err?.statusCode || 400,
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Gagal memuat data submission",
      };
      setError(formattedError);
      toast.error(formattedError.message);
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  // Save draft
  const saveDraft = useCallback(
    async (content) => {
      if (!submissionId || saving) return;

      try {
        setSaving(true);
        setError(null);

        const updatedSubmission =
          await submissionsService.updateSubmissionContent(
            submissionId,
            content
          );

        setSubmission((prev) => ({
          ...prev,
          ...updatedSubmission,
        }));

        return updatedSubmission;
      } catch (err) {
        const formattedError = {
          statusCode: err?.response?.data?.statusCode || err?.statusCode || 400,
          message:
            err?.response?.data?.message ||
            err?.message ||
            "Gagal menyimpan draft",
        };
        setError(formattedError);
        toast.error(formattedError.message);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [submissionId, saving]
  );

  // Submit final submission
  const submitSubmission = useCallback(
    async (answers) => {
      if (!submissionId) return;
      setSubmitting(true);
      setError(null);

      try {
        const result = await submissionsService.submitSubmission(
          submissionId,
          answers
        );
        setSubmission((prev) => ({
          ...prev,
          status: result.status,
          submittedAt: result.submittedAt,
          studentFeedback: result.studentFeedback ?? null,
        }));
        toast.success("Tugas berhasil dikumpulkan!");
        return result;
      } catch (err) {
        const formattedError = {
          statusCode: err?.response?.data?.statusCode || err?.statusCode || 400,
          message:
            err?.response?.data?.message ||
            err?.message ||
            "Gagal mengumpulkan tugas",
        };
        setError(formattedError);
        toast.error(formattedError.message);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [submissionId, submitting]
  );

  // Check if can edit
  const canEdit = useCallback(() => {
    return submission?.status === "DRAFT";
  }, [submission?.status]);

  // Check if can submit
  const canSubmit = useCallback(() => {
    return submission?.status === "DRAFT" && submission?.content?.trim();
  }, [submission?.status, submission?.content]);

  // Get submission status info
  const getStatusInfo = useCallback(() => {
    if (!submission) return null;

    const statusMap = {
      DRAFT: {
        label: "Draft",
        color: "yellow",
        description: "Sedang dikerjakan",
      },
      SUBMITTED: {
        label: "Dikumpulkan",
        color: "blue",
        description: "Menunggu penilaian",
      },
      GRADED: {
        label: "Dinilai",
        color: "green",
        description: "Sudah dinilai",
      },
    };

    return statusMap[submission.status] || statusMap.DRAFT;
  }, [submission]);

  // Initialize
  useEffect(() => {
    loadSubmission();
  }, [loadSubmission]);

  return {
    submission,
    loading,
    saving,
    submitting,
    error,
    saveDraft,
    submitSubmission,
    loadSubmission,
    canEdit,
    canSubmit,
    getStatusInfo,
  };
};
