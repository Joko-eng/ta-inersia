import { z } from "zod";

export const milestoneSchema = z.object({
  name: z
    .string()
    .min(3, "Nama milestone minimal 3 karakter")
    .max(120, "Nama milestone terlalu panjang"),

  description: z
    .string()
    .min(3, "Deskripsi milestone minimal 3 karakter")
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional()
    .or(z.literal("")),

  dueDate: z.string().refine((d) => !isNaN(Date.parse(d)), {
    message: "Tanggal tidak valid",
  }),

  projectId: z.string().min(1),
});

export type MilestoneInput = z.infer<typeof milestoneSchema>;
