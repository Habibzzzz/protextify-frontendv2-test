import { z } from "zod";

// Common validation schemas
export const emailSchema = z.string().email("Email tidak valid");

export const passwordSchema = z
  .string()
  .min(6, "Password minimal 6 karakter")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password harus mengandung huruf besar, kecil, dan angka"
  );

export const requiredStringSchema = z.string().min(1, "Field ini wajib diisi");

export const phoneSchema = z
  .string()
  .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, "Nomor telepon tidak valid");

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: requiredStringSchema.min(2, "Nama minimal 2 karakter"),
  role: z.enum(["STUDENT", "INSTRUCTOR"], {
    required_error: "Role wajib dipilih",
  }),
  institution: requiredStringSchema.min(2, "Institusi minimal 2 karakter"),
});

// Profile update schema
export const updateProfileSchema = z.object({
  fullName: requiredStringSchema.min(2, "Nama minimal 2 karakter"),
  institution: requiredStringSchema.min(2, "Institusi minimal 2 karakter"),
  phone: phoneSchema.optional().or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio maksimal 500 karakter")
    .optional()
    .or(z.literal("")),
  avatarUrl: z
    .string()
    .url("URL avatar tidak valid")
    .optional()
    .or(z.literal("")),
});

// Email verification schema
export const emailVerificationSchema = z.object({
  email: emailSchema,
});

export const verifyTokenSchema = z.object({
  token: requiredStringSchema,
});

// Reset password schema
export const resetPasswordSchema = z.object({
  token: requiredStringSchema,
  newPassword: passwordSchema,
});

// Class schemas
export const createClassSchema = z.object({
  name: requiredStringSchema
    .min(3, "Nama kelas minimal 3 karakter")
    .max(100, "Nama kelas maksimal 100 karakter"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional(),
});

export const joinClassSchema = z.object({
  classToken: requiredStringSchema
    .length(8, "Token kelas harus 8 karakter")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "Token hanya boleh berisi huruf, angka, dan tanda strip (-)"
    ),
});

// Assignment schemas
export const createAssignmentSchema = z.object({
  title: z
    .string()
    .min(3, "Judul tugas minimal 3 karakter")
    .max(200, "Judul tugas maksimal 200 karakter"),
  instructions: z.string().min(10, "Instruksi minimal 10 karakter"),
  deadline: z.string().datetime("Deadline tidak valid"),
  expectedStudentCount: z
    .number()
    .min(1, "Jumlah siswa minimal 1")
    .max(1000, "Maksimal 1000 siswa"),
});

// Submission schemas
export const createSubmissionSchema = z.object({
  content: requiredStringSchema.min(100, "Konten minimal 100 karakter"),
});

export const updateContentSchema = z.object({
  content: z.string(),
});

export const gradeSubmissionSchema = z.object({
  grade: z.number().min(0).max(100),
  feedback: z.string().optional(),
});

// Update class schema
export const updateClassSchema = z.object({
  name: requiredStringSchema
    .min(3, "Nama kelas minimal 3 karakter")
    .max(100, "Nama kelas maksimal 100 karakter"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional(),
});
