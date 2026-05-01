"use server";

import { getSharePageData } from "@/services/timService";

export async function fetchSharePageData(id: string) {
  return await getSharePageData(id);
}