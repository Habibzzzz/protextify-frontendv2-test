import { useEffect, useMemo, useState } from "react";
import { Edit3, Plus, Search, Trash2, UserRoundPlus } from "lucide-react";
import toast from "react-hot-toast";
import { adminService } from "../../services";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  Input,
  Modal,
  Select,
} from "../../components";

const roleOptions = [
  { label: "Instruktur", value: "INSTRUCTOR" },
  { label: "Mahasiswa", value: "STUDENT" },
  { label: "Admin", value: "ADMIN" },
];

const statusOptions = [
  { label: "Aktif", value: "ACTIVE" },
  { label: "Nonaktif", value: "INACTIVE" },
];

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  role: "INSTRUCTOR",
  status: "ACTIVE",
};

const roleLabels = {
  ADMIN: "Admin",
  INSTRUCTOR: "Instruktur",
  STUDENT: "Mahasiswa",
};

const statusLabels = {
  ACTIVE: "Aktif",
  INACTIVE: "Nonaktif",
};

function UserForm({ form, setForm, onSubmit, submitLabel }) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Input
        label="Nama Lengkap"
        placeholder="Nama pengguna"
        value={form.fullName}
        onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder="email@univ.ac.id"
        value={form.email}
        onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="Minimal 6 karakter"
        value={form.password}
        onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        helperText="Kosongkan saat edit jika password tidak ingin diubah."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Role</label>
          <Select
            value={form.role}
            onChange={(value) => setForm((prev) => ({ ...prev, role: value }))}
            options={roleOptions}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
          <Select
            value={form.status}
            onChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
            options={statusOptions}
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async (keyword = "") => {
    setLoading(true);
    try {
      const data = await adminService.getAdminUsers(keyword);
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const summary = useMemo(
    () => ({
      instructors: users.filter((user) => user.role === "INSTRUCTOR").length,
      students: users.filter((user) => user.role === "STUDENT").length,
      active: users.filter((user) => user.status === "ACTIVE").length,
    }),
    [users]
  );

  const filteredUsers = users.filter((user) => {
    const keyword = query.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      roleLabels[user.role].toLowerCase().includes(keyword) ||
      statusLabels[user.status].toLowerCase().includes(keyword)
    );
  });

  const toPayload = () => ({
    fullName: form.fullName,
    email: form.email,
    role: form.role,
    status: form.status,
    ...(form.password ? { password: form.password } : {}),
  });

  const handleAddUser = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const createdUser = await adminService.createAdminUser(toPayload());
      setUsers((prev) => [createdUser, ...prev]);
      setForm(emptyForm);
      toast.success("Pengguna berhasil ditambahkan");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      password: "",
    });
  };

  const handleEditUser = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const updatedUser = await adminService.updateAdminUser(editingUser.id, toPayload());
      setUsers((prev) =>
        prev.map((user) => (user.id === editingUser.id ? updatedUser : user))
      );
      setEditingUser(null);
      setForm(emptyForm);
      toast.success("Pengguna berhasil diperbarui");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    setSubmitting(true);
    try {
      await adminService.deleteAdminUser(deleteTarget.id);
      setUsers((prev) => prev.filter((user) => user.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Pengguna berhasil dihapus");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Badge variant="outline" className="mb-3 bg-white">
            Kelola Pengguna
          </Badge>
          <h1 className="text-2xl font-bold text-gray-950">
            Manajemen Akun Instruktur & Mahasiswa
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Tambah, ubah, dan hapus akun pengguna platform dari satu panel admin.
          </p>
        </div>
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Cari nama, email, role, status..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Total Instruktur</p>
            <p className="mt-2 text-3xl font-bold text-gray-950">{summary.instructors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Total Mahasiswa</p>
            <p className="mt-2 text-3xl font-bold text-gray-950">{summary.students}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Pengguna Aktif</p>
            <p className="mt-2 text-3xl font-bold text-gray-950">{summary.active}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.6fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <UserRoundPlus className="mr-2 h-5 w-5 text-[#23407a]" />
              Tambah Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm
              form={form}
              setForm={setForm}
              onSubmit={handleAddUser}
              submitLabel={submitting ? "Menyimpan..." : "Tambah Pengguna"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Daftar Pengguna</CardTitle>
              <p className="mt-1 text-sm text-gray-500">
                Menampilkan seluruh entitas pengguna di platform.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => {
                setForm(emptyForm);
                document.querySelector("input[placeholder='Nama pengguna']")?.focus();
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pengguna
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading && (
                    <tr>
                      <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                        Memuat data pengguna...
                      </td>
                    </tr>
                  )}
                  {!loading && filteredUsers.length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                        Tidak ada pengguna yang cocok.
                      </td>
                    </tr>
                  )}
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-950">{user.fullName}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant={user.role === "STUDENT" ? "outline" : "success"}>
                          {roleLabels[user.role]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={user.status === "ACTIVE" ? "success" : "warning"}>
                          {statusLabels[user.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => openEditModal(user)}
                          >
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => setDeleteTarget(user)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={Boolean(editingUser)}
        onClose={() => {
          setEditingUser(null);
          setForm(emptyForm);
        }}
        title="Edit Pengguna"
        description="Perbarui informasi pengguna yang dipilih."
      >
        <UserForm
          form={form}
          setForm={setForm}
          onSubmit={handleEditUser}
          submitLabel={submitting ? "Menyimpan..." : "Simpan Perubahan"}
        />
      </Modal>

      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Konfirmasi Hapus"
        description="Data pengguna akan dihapus dari daftar admin."
      >
        <p className="text-sm text-gray-700">
          Apakah Anda yakin ingin menghapus{" "}
          <span className="font-semibold text-gray-950">{deleteTarget?.fullName}</span>?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Batal
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={submitting}>
            {submitting ? "Menghapus..." : "Hapus Pengguna"}
          </Button>
        </div>
      </Modal>
    </Container>
  );
}
