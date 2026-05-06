import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Button,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Modal,
  Pagination,
} from "../ui";
import { classesService } from "../../services";
import { formatDate } from "../../utils/helpers";
import {
  Users,
  Mail,
  Copy,
  Download,
  Search,
  MoreVertical,
  UserMinus,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * Komponen utama untuk manajemen anggota kelas.
 * Menampilkan daftar anggota, fitur pencarian, ekspor, undangan, dan pagination.
 *
 * @param {Object} props
 * @param {Object} props.classDetail - Detail kelas beserta enrollments.
 * @param {Function} props.onRefresh - Callback untuk refresh data setelah aksi (mis. hapus anggota).
 */
export default function MemberManagement({ classDetail, onRefresh }) {
  const navigate = useNavigate();
  // State untuk kata kunci pencarian anggota
  const [searchTerm, setSearchTerm] = useState("");
  // State untuk modal undangan anggota
  const [showInviteModal, setShowInviteModal] = useState(false);
  // State untuk halaman saat ini pada pagination
  const [currentPage, setCurrentPage] = useState(1);
  // State jumlah anggota per halaman
  const [itemsPerPage] = useState(10);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileMember, setProfileMember] = useState(null);

  /**
   * Ambil data anggota dari enrollments (backend).
   * Mapping data enrollments menjadi array anggota.
   */
  const members = Array.isArray(classDetail?.enrollments)
    ? classDetail.enrollments.map((e) => ({
        id: e.student?.id,
        fullName: e.student?.fullName,
        email: e.student?.email || "",
        institution: e.student?.institution || "",
        joinedAt: e.joinedAt,
      }))
    : [];

  /**
   * Filter anggota berdasarkan kata kunci pencarian (nama/email).
   * Mengembalikan array anggota yang sesuai dengan pencarian.
   */
  const filteredMembers = members.filter((member) => {
    const q = searchTerm.toLowerCase();
    return (
      (member.fullName ?? "").toLowerCase().includes(q) ||
      (member.email ?? "").toLowerCase().includes(q)
    );
  });

  /**
   * Ambil anggota sesuai halaman (pagination).
   * Menggunakan useMemo untuk optimasi render.
   */
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, currentPage, itemsPerPage]);

  /**
   * Fungsi untuk mengekspor daftar anggota ke file CSV.
   * Hanya field yang tersedia di backend yang diekspor.
   */
  const exportMemberList = () => {
    const csvContent = [
      "Nama,Email,Institusi,Tanggal Bergabung",
      ...filteredMembers.map(
        (member) =>
          `${member.fullName},${member.email},${
            member.institution
          },${formatDate(member.joinedAt)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${classDetail.name}_members.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions: Judul, total anggota, tombol export & undang */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Manajemen Anggota
          </h3>
          <p className="text-sm text-gray-600">
            Total: {members.length} anggota
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={exportMemberList}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={() => setShowInviteModal(true)}
            className="bg-[#23407a] hover:bg-[#1a2f5c]"
          >
            <Mail className="h-4 w-4 mr-2" />
            Undang Siswa
          </Button>
        </div>
      </div>

      {/* Search: Input pencarian anggota */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari nama atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members List: Tabel daftar anggota kelas */}
      <Card>
        <CardContent className="p-0">
          {filteredMembers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-medium text-gray-900">
                      Nama
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Email
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Institusi
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Bergabung
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-900">
                        {member.fullName}
                      </td>
                      <td className="p-4 text-gray-600">{member.email}</td>
                      <td className="p-4 text-gray-600">
                        {member.institution}
                      </td>
                      <td className="p-4 text-gray-600">
                        {formatDate(member.joinedAt)}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Aktif
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {/* Dropdown menu untuk aksi anggota */}
                        <DropdownMenu>
                          {({ isOpen, setIsOpen }) => (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsOpen(!isOpen)}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                              {isOpen && (
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setProfileMember(member);
                                      setShowProfileModal(true);
                                      setIsOpen(false);
                                    }}
                                  >
                                    Lihat Profil
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      if (!member?.id || !classDetail?.id) {
                                        toast.error(
                                          "Data siswa tidak lengkap — tidak bisa membuka progress."
                                        );
                                        setIsOpen(false);
                                        return;
                                      }
                                      navigate(
                                        `/instructor/classes/${classDetail.id}/history?studentId=${member.id}`
                                      );
                                      setIsOpen(false);
                                    }}
                                  >
                                    Lihat Progress
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => {
                                      setMemberToRemove(member);
                                      setShowRemoveModal(true);
                                      setIsOpen(false);
                                    }}
                                  >
                                    <UserMinus className="h-4 w-4 mr-2" />
                                    Hapus dari Kelas
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              )}
                            </>
                          )}
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Tampilan jika tidak ada anggota atau hasil pencarian kosong
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm
                  ? "Tidak ada anggota yang ditemukan"
                  : "Belum ada anggota"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "Coba ubah kata kunci pencarian"
                  : "Bagikan token kelas untuk bergabung"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination: Navigasi halaman anggota */}
      {filteredMembers.length > itemsPerPage && (
        <div className="flex justify-center py-4">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredMembers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Invite Modal: Modal untuk mengundang anggota via token kelas */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        classDetail={classDetail}
      />

      <StudentProfileModal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setProfileMember(null);
        }}
        member={profileMember}
      />

      <RemoveMemberModal
        isOpen={showRemoveModal}
        onClose={() => {
          setShowRemoveModal(false);
          setMemberToRemove(null);
        }}
        member={memberToRemove}
        classDetail={classDetail}
        onSuccess={() => onRefresh?.()}
      />
    </div>
  );
}

function StudentProfileModal({ isOpen, onClose, member }) {
  const initial = (member?.fullName || "?").charAt(0).toUpperCase();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profil Siswa">
      {member ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#23407a]/10 text-xl font-semibold text-[#23407a]">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-900">
                {member.fullName || "—"}
              </p>
              <p className="text-sm text-gray-500">Anggota kelas ini</p>
            </div>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="break-all text-gray-900">
                {member.email?.trim() ? member.email : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Institusi</dt>
              <dd className="text-gray-900">
                {member.institution?.trim() ? member.institution : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Bergabung</dt>
              <dd className="text-gray-900">{formatDate(member.joinedAt)}</dd>
            </div>
          </dl>
          <p className="text-xs leading-relaxed text-gray-500">
            Bio dan foto profil hanya bisa diubah oleh siswa dari akun mereka.
            Ini ringkasan yang instruktur lihat untuk konteks kelas.
          </p>
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

/**
 * Komponen modal undangan anggota ke kelas.
 * Hanya menampilkan metode undangan via token kelas.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Status modal terbuka/tutup.
 * @param {Function} props.onClose - Fungsi untuk menutup modal.
 * @param {Object} props.classDetail - Detail kelas (termasuk token kelas).
 */
function InviteModal({ isOpen, onClose, classDetail }) {
  /**
   * Fungsi untuk menyalin token kelas ke clipboard.
   * Menampilkan toast sukses jika berhasil.
   */
  const copyClassToken = () => {
    navigator.clipboard.writeText(classDetail.classToken);
    toast.success("Token kelas disalin!");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Undang Siswa ke Kelas">
      <div className="space-y-6">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-3"
            htmlFor="class-token-input"
          >
            Bagikan Token Kelas
          </label>
          <div className="flex items-center space-x-3">
            <Input
              id="class-token-input"
              value={classDetail.classToken}
              readOnly
              className="font-mono"
            />
            <Button onClick={copyClassToken}>
              <Copy className="h-4 w-4 mr-2" />
              Salin
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Siswa dapat bergabung ke kelas dengan memasukkan token ini di halaman
          "Gabung Kelas".
        </div>
      </div>
    </Modal>
  );
}

function RemoveMemberModal({
  isOpen,
  onClose,
  member,
  classDetail,
  onSuccess,
}) {
  const [removing, setRemoving] = useState(false);

  const handleConfirm = async () => {
    if (!member?.id || !classDetail?.id) return;
    setRemoving(true);
    try {
      await toast.promise(
        classesService.removeStudentFromClass(classDetail.id, member.id),
        {
          loading: "Mengeluarkan siswa...",
          success: "Siswa berhasil dikeluarkan dari kelas",
          error: (err) =>
            err?.response?.data?.message ||
            err?.message ||
            "Gagal mengeluarkan siswa dari kelas",
        }
      );
      onSuccess?.();
      onClose();
    } catch {
      // Error sudah ditampilkan oleh toast.promise
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keluarkan dari kelas?">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Yakin ingin mengeluarkan{" "}
          <span className="font-medium text-gray-900">
            {member?.fullName ?? "siswa ini"}
          </span>{" "}
          dari kelas ini? Siswa tidak lagi melihat kelas ini; riwayat tugas yang
          sudah ada tetap tersimpan.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={removing}>
            Batal
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleConfirm}
            disabled={removing}
          >
            Keluarkan
          </Button>
        </div>
      </div>
    </Modal>
  );
}
