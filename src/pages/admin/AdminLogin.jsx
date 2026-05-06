import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../contexts/AuthContext";
import { USER_ROLES } from "../../utils/constants";
import { Alert, Button, Card, CardContent, CardHeader, CardTitle, Input } from "../../components";

const adminLoginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setError(null);
    setLoading(true);
    try {
      const response = await loginAdmin(values);
      if (response?.user?.role !== USER_ROLES.ADMIN) {
        setError("Akun ini tidak memiliki akses admin.");
        return;
      }
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login admin gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#1a2f5c] to-[#23407a] px-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#23407a] text-white flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Admin Login
          </CardTitle>
          <p className="text-sm text-gray-600">
            Masuk ke panel administrasi Protextify.
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="error" title="Akses Ditolak" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Admin"
              type="email"
              placeholder="admin@protextify.id"
              leftElement={<Mail className="w-4 h-4 text-gray-400" />}
              error={errors.email?.message}
              disabled={loading}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Masukkan password admin"
              leftElement={<Lock className="w-4 h-4 text-gray-400" />}
              error={errors.password?.message}
              disabled={loading}
              {...register("password")}
            />
            <Button type="submit" className="w-full" loading={loading}>
              Masuk sebagai Admin
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
