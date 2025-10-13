import { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Modal,
  Pagination,
} from "../ui";
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

export default function MemberManagement({ classDetail, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Data anggota dari enrollments (BE)
  const members = Array.isArray(classDetail?.enrollments)
    ? classDetail.enrollments.map((e) => ({
        id: e.student?.id,
        fullName: e.student?.fullName,
        email: e.student?.email || "",
        institution: e.student?.institution || "",
        joinedAt: e.createdAt || classDetail.currentUserEnrollment?.joinedAt,
      }))
    : [];

  // Filter members based on search
  const filteredMembers = members.filter(
    (member) =>
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, currentPage, itemsPerPage]);

  // Export member list (hanya field yang tersedia di BE)
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
      {/* Header Actions */}
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

      {/* Search */}
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

      {/* Members List */}
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
                                  <DropdownMenuItem>
                                    Lihat Profil
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Lihat Progress
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => {
                                      setMemberToRemove(enrollment.student);
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

      {/* Pagination */}
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

      {/* Invite Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        classDetail={classDetail}
      />
    </div>
  );
}

// Invite Modal Component
function InviteModal({ isOpen, onClose, classDetail }) {
  // Hanya tampilkan metode undangan via token kelas
  const copyClassToken = () => {
    navigator.clipboard.writeText(classDetail.classToken);
    toast.success("Token kelas disalin!");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Undang Siswa ke Kelas">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Bagikan Token Kelas
          </label>
          <div className="flex items-center space-x-3">
            <Input
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
