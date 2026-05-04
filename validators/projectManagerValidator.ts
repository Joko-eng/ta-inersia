import { z } from "zod";

export const createProjectManagerSchema = z.object({
  name:     z.string().min(1, "Nama wajib diisi.").max(100, "Nama terlalu panjang."),
  email:    z.string().email("Format email tidak valid."),
  username: z.string().min(3, "Username minimal 3 karakter.").max(50, "Username terlalu panjang."),
  password: z.string().min(8, "Password minimal 8 karakter."),
});

export const updateProjectManagerSchema = z.object({
  name:     z.string().min(1, "Nama wajib diisi.").max(100, "Nama terlalu panjang.").optional(),
  email:    z.string().email("Format email tidak valid.").optional(),
  username: z.string().min(3, "Username minimal 3 karakter.").max(50, "Username terlalu panjang.").optional(),
  password: z.string().min(8, "Password minimal 8 karakter.").optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Tidak ada field yang dikirim.",
});

export type CreateProjectManagerInput = z.infer<typeof createProjectManagerSchema>;
export type UpdateProjectManagerInput = z.infer<typeof updateProjectManagerSchema>;