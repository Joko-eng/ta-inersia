"use server";

import {
  createMilestoneRecord,
  deleteMilestoneById,
  updateMilestoneById,
  validateDueDate,
} from "@/lib/services/milestoneService";
import { milestoneSchema } from "@/validations/milestoneValidator";
import { revalidatePath } from "next/cache";

export async function createMilestone(formData: FormData) {
  const data = {
    name: formData.get("name"),
    description: formData.get("description") || "",
    dueDate: formData.get("dueDate"),
    projectId: formData.get("projectId"),
  };

  const parsed = milestoneSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  if (!validateDueDate(parsed.data.dueDate)) {
    return { error: { dueDate: ["Tanggal tidak boleh di masa lalu"] } };
  }

  await createMilestoneRecord(parsed.data);
  revalidatePath(`/proyek/${parsed.data.projectId}`);
  return { success: true };
}

export async function deleteMilestone(id: string, projectId: string) {
  if (!id) return { error: "ID tidak valid" };

  try {
    await deleteMilestoneById(id);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menghapus milestone";
    return { error: message };
  }

  revalidatePath(`/proyek/${projectId}`);
  return { success: true };
}

export async function updateMilestone(
  id: string,
  projectId: string,
  formData: FormData,
) {
  const data = {
    name: formData.get("name"),
    description: formData.get("description") || "",
    dueDate: formData.get("dueDate"),
    projectId,
  };

  const parsed = milestoneSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  if (!validateDueDate(parsed.data.dueDate)) {
    return { error: { dueDate: ["Tanggal tidak boleh di masa lalu"] } };
  }

  await updateMilestoneById(id, parsed.data);
  revalidatePath(`/proyek/${projectId}`);
  return { success: true };
}
