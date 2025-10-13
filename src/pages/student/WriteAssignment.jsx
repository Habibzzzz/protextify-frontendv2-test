import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Send, AlertCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Breadcrumb,
  LoadingSpinner,
  Alert,
  Button,
  Modal,
} from "../../components";

import RichTextEditor from "../../components/forms/RichTextEditor";
import TextStatistics from "../../components/editor/TextStatistics";
import DraftActions from "../../components/editor/DraftActions";
import CitationManager from "../../components/editor/CitationManager";
import CopyPasteMonitor from "../../components/editor/CopyPasteMonitor";
import SubmissionActions from "../../components/submission/SubmissionActions";

import { useTextAnalytics } from "../../hooks/useTextAnalytics";
import { assignmentsService, submissionsService } from "../../services";
import { formatDate } from "../../utils/helpers";

export default function WriteAssignment() {
  const { classId, assignmentId, id } = useParams();
  const effectiveAssignmentId = assignmentId || id;
  const navigate = useNavigate();
  const editorRef = useRef(null);

  // State
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [localSubmissionId, setLocalSubmissionId] = useState(null);
  const [content, setContent] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [citations, setCitations] = useState([]);
  const [loadingAssignment, setLoadingAssignment] = useState(true);
  const [loadingSubmission, setLoadingSubmission] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [contentInitialized, setContentInitialized] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false); // 1. Tambahkan state modal di sini

  // Load assignment data
  useEffect(() => {
    const loadAssignmentData = async () => {
      setLoadingAssignment(true);
      try {
        let assignmentData;
        if (classId) {
          assignmentData = await assignmentsService.getAssignmentDetail(
            classId,
            effectiveAssignmentId
          );
        } else {
          assignmentData = await assignmentsService.getAssignmentById(
            effectiveAssignmentId
          );
        }
        setAssignment(assignmentData);
      } catch (error) {
        toast.error("Gagal memuat data tugas");
        setAssignment(null);
      } finally {
        setLoadingAssignment(false);
      }
    };
    if (effectiveAssignmentId) loadAssignmentData();
  }, [classId, effectiveAssignmentId]);

  // Create draft submission jika belum ada
  useEffect(() => {
    const createOrFetchSubmission = async () => {
      if (!effectiveAssignmentId || !assignment) return;
      setLoadingSubmission(true);
      try {
        const history = await submissionsService.getHistory();
        const existing = history.find(
          (s) => s.assignmentId === effectiveAssignmentId
        );
        if (existing) {
          setLocalSubmissionId(existing.id);
        } else {
          const newSubmission = await submissionsService.createSubmission(
            effectiveAssignmentId,
            { content: "" }
          );
          setLocalSubmissionId(newSubmission.id);
        }
      } catch (error) {
        toast.error("Gagal membuat/memuat submission");
      } finally {
        setLoadingSubmission(false);
      }
    };
    if (assignment && effectiveAssignmentId) createOrFetchSubmission();
  }, [assignment, effectiveAssignmentId]);

  // Fetch submission detail setiap kali localSubmissionId berubah
  useEffect(() => {
    const fetchSubmission = async () => {
      if (!localSubmissionId) return;
      setLoadingSubmission(true);
      try {
        const data = await submissionsService.getSubmissionById(
          localSubmissionId
        );
        setSubmission(data);
        const draftContent = data.content || "";
        setInitialContent(draftContent);
        setContent(draftContent);
        setContentInitialized(false);
      } catch (error) {
        setSubmission(null);
      } finally {
        setLoadingSubmission(false);
      }
    };
    if (localSubmissionId) fetchSubmission();
  }, [localSubmissionId]);

  // Polling submission status setiap 45 detik
  useEffect(() => {
    if (!localSubmissionId) return;
    const interval = setInterval(async () => {
      try {
        const data = await submissionsService.getSubmissionById(
          localSubmissionId
        );
        setSubmission(data);
      } catch (error) {
        // Silent error
      }
    }, 45000);
    return () => clearInterval(interval);
  }, [localSubmissionId]);

  // Auto-save konten setiap 15 detik
  useEffect(() => {
    if (
      !localSubmissionId ||
      !submission ||
      submission.status !== "DRAFT" ||
      !contentInitialized
    )
      return;
    const interval = setInterval(async () => {
      if (content.trim() === "" || content === initialContent) return;
      setSaving(true);
      try {
        await submissionsService.updateSubmissionContent(
          localSubmissionId,
          content
        );
        toast.success("Draft tersimpan otomatis");
      } catch (error) {
        toast.error("Auto-save gagal");
      } finally {
        setSaving(false);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [
    localSubmissionId,
    content,
    submission,
    initialContent,
    contentInitialized,
  ]);

  // Handle content change
  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  // Handle editor ready
  const handleEditorReady = () => {
    setEditorReady(true);
    setTimeout(() => {
      setContentInitialized(true);
    }, 300);
  };

  // Manual save
  const handleSave = async () => {
    if (!localSubmissionId) return;

    // Perbaikan: Ubah validasi untuk memeriksa plain text, bukan HTML mentah.
    const plainText = content.replace(/<[^>]*>/g, "").trim();
    if (plainText === "") {
      toast.error("Tidak bisa menyimpan draft kosong.");
      return;
    }

    setSaving(true);
    try {
      await submissionsService.updateSubmissionContent(
        localSubmissionId,
        content
      );
      toast.success("Draft berhasil disimpan");
    } catch (error) {
      toast.error("Gagal menyimpan draft");
    } finally {
      setSaving(false);
    }
  };

  // Submit tugas
  const handleSubmit = async () => {
    if (
      !localSubmissionId ||
      !submission ||
      submission.status !== "DRAFT" ||
      !content.trim()
    ) {
      toast.error(
        "Submission tidak bisa dikumpulkan. Pastikan draft sudah diisi."
      );
      return Promise.reject(new Error("Submission tidak bisa dikumpulkan")); // Return rejected promise
    }
    setSubmitting(true);
    try {
      await submissionsService.submitSubmission(localSubmissionId);
      toast.success("Tugas berhasil dikumpulkan!");
      const updated = await submissionsService.getSubmissionById(
        localSubmissionId
      );
      setSubmission(updated);
      navigate(`/dashboard/classes/${assignment?.classId}`);
    } catch (error) {
      toast.error("Gagal mengumpulkan tugas");
      throw error; // Re-throw error for the modal handler
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Buat handler untuk konfirmasi dari modal
  const handleConfirmSubmit = async () => {
    try {
      await handleSubmit();
      setShowSubmitModal(false); // Tutup modal jika sukses
    } catch (error) {
      // Jangan tutup modal jika gagal, agar pengguna tahu ada masalah
    }
  };

  // Citation handlers
  const handleAddCitation = (citation) =>
    setCitations([...citations, citation]);
  const handleEditCitation = (index, citation) => {
    const newCitations = [...citations];
    newCitations[index] = citation;
    setCitations(newCitations);
  };
  const handleRemoveCitation = (index) =>
    setCitations(citations.filter((_, i) => i !== index));
  const handleInsertCitation = (citationText) => {
    // Sisipkan teks sitasi lengkap tanpa tanda kurung, tambahkan spasi di akhir.
    if (editorRef.current) editorRef.current.insertText(`${citationText} `);
  };

  // Suspicious activity handler
  const handleSuspiciousActivity = (event) => {
    toast.warning(
      `Terdeteksi aktivitas copy-paste: ${event.textLength} karakter. Pastikan ini adalah karya asli Anda.`,
      { duration: 5000 }
    );
  };

  const { stats, limitChecks, validation } = useTextAnalytics(content, {
    maxWords: 1000,
    maxCharacters: 7000,
    minWords: 100,
  });

  if (loadingAssignment || loadingSubmission) {
    return (
      <Container className="py-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Container>
    );
  }

  if (!assignment || !submission) {
    return (
      <Container className="py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div>
            <strong>Data tidak ditemukan</strong>
            <p>Submission atau assignment tidak dapat dimuat.</p>
          </div>
        </Alert>
      </Container>
    );
  }

  const statusInfo = {
    DRAFT: { label: "Draft", color: "yellow" },
    SUBMITTED: { label: "Dikumpulkan", color: "blue" },
    GRADED: { label: "Dinilai", color: "green" },
  }[submission.status] || { label: "Draft", color: "yellow" };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <Container className="py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                to={`/dashboard/classes/${assignment.classId}`}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Kembali ke Kelas
              </Link>
              <Breadcrumb
                items={[
                  { label: "Dashboard", href: "/dashboard" },
                  {
                    label: assignment.class?.name || "Kelas",
                    href: `/dashboard/classes/${assignment.classId}`,
                  },
                  { label: assignment.title, current: true },
                ]}
              />
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  statusInfo.color === "yellow"
                    ? "bg-yellow-100 text-yellow-800"
                    : statusInfo.color === "blue"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {statusInfo.label}
              </div>
              {saving && (
                <span className="text-blue-600 text-xs ml-2 animate-pulse">
                  Menyimpan...
                </span>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:col-span-3 space-y-8 w-full">
            {/* Assignment Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {assignment.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none text-gray-700 mb-6">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: assignment.instructions,
                    }}
                  />
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                  <span>
                    <strong>Deadline:</strong>{" "}
                    {formatDate(assignment.deadline, "dd MMM yyyy, HH:mm")}
                  </span>
                  <span>
                    <strong>Min:</strong> 100 kata
                  </span>
                  <span>
                    <strong>Maks:</strong> 1000 kata
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Editor */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <RichTextEditor
                  ref={editorRef}
                  key={localSubmissionId}
                  value={content}
                  onChange={handleContentChange}
                  onEditorReady={handleEditorReady}
                  disabled={submission.status !== "DRAFT"}
                  disablePaste={submission.status === "DRAFT"}
                  maxWords={1000}
                  placeholder="Klik untuk memuat draft yang tersedia, atau mulai tulis jawaban Anda di sini..."
                />
              </CardContent>
            </Card>

            {/* Citations */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Daftar Pustaka & Sitasi</CardTitle>
              </CardHeader>
              <CardContent>
                <CitationManager
                  citations={citations}
                  onAdd={
                    submission.status === "DRAFT"
                      ? handleAddCitation
                      : undefined
                  }
                  onEdit={
                    submission.status === "DRAFT"
                      ? handleEditCitation
                      : undefined
                  }
                  onRemove={
                    submission.status === "DRAFT"
                      ? handleRemoveCitation
                      : undefined
                  }
                  onInsert={
                    submission.status === "DRAFT"
                      ? handleInsertCitation
                      : undefined
                  }
                  disabled={submission.status !== "DRAFT"}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          {/* <div className="w-full lg:sticky lg:top-24 space-y-6">
            <TextStatistics
              stats={stats}
              limitChecks={limitChecks}
              validation={validation}
            />
            <CopyPasteMonitor
              editorRef={editorRef}
              onSuspiciousActivity={handleSuspiciousActivity}
              enabled={submission.status === "DRAFT"}
            />
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-base">Informasi Tambahan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Kelas:</span>
                  <p className="font-semibold text-gray-900">
                    {assignment.class?.name}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Dibuat:</span>
                  <p className="font-semibold text-gray-900">
                    {formatDate(submission.createdAt)}
                  </p>
                </div>
                {submission.submittedAt && (
                  <div>
                    <span className="font-medium text-gray-600">
                      Dikumpulkan:
                    </span>
                    <p className="font-semibold text-gray-900">
                      {formatDate(submission.submittedAt)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div> */}
        </motion.div>
      </Container>

      {/* Fixed Bottom Actions */}
      <div className="sticky bottom-0 z-30 bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-lg">
        <Container className="py-4">
          <DraftActions
            submission={submission}
            canEdit={submission.status === "DRAFT"}
            canSubmit={submission.status === "DRAFT" && content.trim()}
            saving={saving}
            submitting={submitting}
            onSave={handleSave}
            onSubmit={() => setShowSubmitModal(true)} // 3. Ubah prop onSubmit untuk memicu modal
            onRefresh={() => {
              if (localSubmissionId) {
                submissionsService
                  .getSubmissionById(localSubmissionId)
                  .then(setSubmission);
              }
            }}
            validation={validation}
          />
        </Container>
      </div>

      {/* 4. Render Modal di sini, di luar container sticky */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Konfirmasi Pengumpulan"
      >
        <div className="space-y-4">
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <div>
              <strong>Perhatian!</strong>
              <p className="mt-1">
                Setelah dikumpulkan, Anda tidak dapat lagi mengedit jawaban.
                Pastikan jawaban sudah sesuai sebelum mengumpulkan.
              </p>
            </div>
          </Alert>

          {validation.warnings.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Peringatan:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {validation.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowSubmitModal(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button onClick={handleConfirmSubmit} loading={submitting}>
              Ya, Kumpulkan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
