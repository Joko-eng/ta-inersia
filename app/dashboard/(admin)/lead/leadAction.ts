"use server";

import { revalidatePath } from "next/cache";
import { dbGetLeads, dbUpdateLead, dbDeleteLead } from "@/lib/services/leadService";
import { LeadData } from "@/types/ILead";

const REVALIDATE_PATH = "/lead-generation";

export async function getLeads(): Promise<LeadData[]> {
  return dbGetLeads();
}

export async function updateLead(
  id:      string,
  payload: Partial<Omit<LeadData, "id">>,
): Promise<{ ok: boolean; error?: string }> {
  const result = await dbUpdateLead(id, payload);
  if (result.ok) revalidatePath(REVALIDATE_PATH);
  return result;
}

export async function deleteLead(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const result = await dbDeleteLead(id);
  if (result.ok) revalidatePath(REVALIDATE_PATH);
  return result;
}