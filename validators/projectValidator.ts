import { z } from "zod";

export const createProjectSchema = z.object({
  name:             z.string().min(1, "Nama project wajib diisi.").max(100, "Nama terlalu panjang."),
  projectManagerId: z.string().min(1, "Project manager wajib dipilih."),
  clientName:       z.string().min(1, "Nama PIC wajib diisi.").max(100, "Nama terlalu panjang."),
  clientBusiness:   z.string().min(1, "Nama perusahaan/toko wajib diisi.").max(150, "Nama terlalu panjang."),
});

export const updateProjectSchema = z.object({
  name:             z.string().min(1, "Nama project wajib diisi.").max(100, "Nama terlalu panjang.").optional(),
  projectManagerId: z.string().min(1, "Project manager wajib dipilih.").optional(),
  clientName:       z.string().min(1, "Nama PIC wajib diisi.").max(100, "Nama terlalu panjang.").optional(),
  clientBusiness:   z.string().min(1, "Nama perusahaan/toko wajib diisi.").max(150, "Nama terlalu panjang.").optional(),
  isArchived:       z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Tidak ada field yang dikirim.",
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;