"use server";

import {
  addTeamMember,
  deleteTeamMember,
} from "@/services/teamServices";
import { teamSchema } from "@/validations/teamValidator";

import { revalidatePath } from "next/cache";

export async function addMember(data: unknown) {
  const parsed = teamSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await addTeamMember(parsed.data);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menambahkan anggota";
    return { error: { email: [message] } };
  }

  revalidatePath("/team");
  return { success: true };
}

export async function deleteMember(id: string) {
  await deleteTeamMember(id);
  revalidatePath("/team");
}
