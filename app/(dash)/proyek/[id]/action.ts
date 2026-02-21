"use server";

import { connectDB } from "@/lib/mongodb";
import Milestone from "@/models/Milestone";
import Task from "@/models/Task";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const milestoneSchema = z.object({
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

function validateDueDate(date: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const input = new Date(date);
  return input >= today;
}

export async function createMilestone(formData: FormData) {
  await connectDB();

  const data = {
    name: formData.get("name"),
    description: formData.get("description") || "",
    dueDate: formData.get("dueDate"),
    projectId: formData.get("projectId"),
  };

  const parsed = milestoneSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: parsed.error.flatten().fieldErrors,
    };
  }

  if (!validateDueDate(parsed.data.dueDate)) {
    return {
      error: { dueDate: ["Tanggal tidak boleh di masa lalu"] },
    };
  }

  await Milestone.create({
    ...parsed.data,
    status: "menunggu",
  });

  revalidatePath(`/proyek/${parsed.data.projectId}`);

  return { success: true };
}

export async function deleteMilestone(id: string, projectId: string) {
  await connectDB();

  if (!id) {
    return { error: "ID tidak valid" };
  }

  const taskCount = await Task.countDocuments({ milestoneId: id });

  if (taskCount > 0) {
    return {
      error: "Milestone tidak dapat dihapus karena masih memiliki task",
    };
  }

  await Milestone.findByIdAndDelete(id);

  revalidatePath(`/proyek/${projectId}`);

  return { success: true };
}

export async function updateMilestone(
  id: string,
  projectId: string,
  formData: FormData,
) {
  await connectDB();

  const data = {
    name: formData.get("name"),
    description: formData.get("description") || "",
    dueDate: formData.get("dueDate"),
    projectId,
  };

  const parsed = milestoneSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: parsed.error.flatten().fieldErrors,
    };
  }

  if (!validateDueDate(parsed.data.dueDate)) {
    return {
      error: { dueDate: ["Tanggal tidak boleh di masa lalu"] },
    };
  }

  await Milestone.findByIdAndUpdate(id, parsed.data);

  revalidatePath(`/proyek/${projectId}`);

  return { success: true };
}
