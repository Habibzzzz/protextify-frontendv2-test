import { Save, Send, Clock, AlertCircle } from "lucide-react";
import { Button, Badge } from "../ui";
import toast from "react-hot-toast";

/**
 * Komponen DraftActions
 * Menampilkan status draft, waktu terakhir disimpan, jumlah kesalahan validasi,
 * serta tombol aksi untuk menyimpan dan mengumpulkan draft.
 *
 * Props:
 * - submission: Object data submission (berisi status dan updatedAt)
 * - canEdit: Boolean, apakah user bisa mengedit
 * - canSubmit: Boolean, apakah user bisa submit
 * - saving: Boolean, status proses penyimpanan
 * - submitting: Boolean, status proses pengumpulan
 * - onSave: Fungsi handler untuk aksi simpan
 * - onSubmit: Fungsi handler untuk aksi submit
 * - validation: Object validasi (isValid, errors)
 */
const DraftActions = ({
  submission,
  canEdit,
  canSubmit,
  saving,
  submitting,
  onSave,
  onSubmit,
  validation,
}) => {
  /**
   * Menghasilkan badge status berdasarkan status submission.
   * @returns {JSX.Element|null} Badge status atau null jika submission tidak ada.
   */
  const getStatusBadge = () => {
    if (!submission) return null;

    // Pemetaan status ke label dan variant badge
    const statusMap = {
      DRAFT: { label: "Draft", variant: "warning" },
      SUBMITTED: { label: "Dikumpulkan", variant: "info" },
      GRADED: { label: "Dinilai", variant: "success" },
    };

    const status = statusMap[submission.status] || statusMap.DRAFT;
    return <Badge variant={status.variant}>{status.label}</Badge>;
  };

  /**
   * Handler klik tombol submit.
   * Menampilkan toast error jika validasi gagal, jika tidak, memanggil onSubmit.
   */
  const handleSubmitClick = () => {
    if (!validation.isValid) {
      toast.error("Harap perbaiki semua kesalahan sebelum mengumpulkan.");
      return;
    }
    onSubmit();
  };

  return (
    <div className="flex items-center justify-between">
      {/* Bagian kiri: Status badge dan waktu terakhir disimpan */}
      <div className="flex items-center space-x-4">
        {getStatusBadge()}
        {submission?.updatedAt && (
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>
              Terakhir disimpan:{" "}
              {new Date(submission.updatedAt).toLocaleString("id-ID")}
            </span>
          </div>
        )}
      </div>

      {/* Bagian kanan: Info error dan tombol aksi */}
      <div className="flex items-center space-x-3">
        {/* Menampilkan jumlah kesalahan validasi jika ada */}
        {validation.errors.length > 0 && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm hidden sm:inline">
              {validation.errors.length} kesalahan
            </span>
          </div>
        )}

        {/* Tombol Simpan, hanya muncul jika bisa edit */}
        {canEdit && (
          <Button
            variant="outline"
            onClick={onSave}
            disabled={saving || submitting}
            loading={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        )}

        {/* Tombol Kumpulkan, hanya muncul jika bisa edit */}
        {canEdit && (
          <Button
            onClick={handleSubmitClick}
            disabled={!canSubmit || saving || submitting}
            loading={submitting}
          >
            <Send className="h-4 w-4 mr-2" />
            {submitting ? "Mengumpulkan..." : "Kumpulkan"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DraftActions;
