"use server";

import { getSharePageData } from "@/lib/services/timService";

export async function fetchSharePageData(id: string) {
  return await getSharePageData(id);
}
