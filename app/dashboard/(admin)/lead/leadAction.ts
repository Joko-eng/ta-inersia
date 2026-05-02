"use server";

import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { revalidatePath } from "next/cache";

export type LeadData = {
  id:           string;
  nama:         string;
  rating:       number;
  jumlahUlasan: number;
  noTelp:       string;
  alamat:       string;
  mapsUrl:      string;
  keterangan:   string;
  status:       string;
};

const REVALIDATE_PATH = "/lead-generation";

export async function getLeads(): Promise<LeadData[]> {
  await connectDB();
  const leads = await Lead.find().sort({ createdAt: -1 }).lean();

  return leads.map((item: any) => ({
    id:           item._id.toString(),
    nama:         item.nama,
    rating:       item.rating,
    jumlahUlasan: item.jumlahUlasan,
    noTelp:       item.noTelp,
    alamat:       item.alamat,
    mapsUrl:      item.mapsUrl    ?? "",
    keterangan:   item.keterangan ?? "",
    status:       item.status,
  }));
}

export async function deleteLead(id: string): Promise<void> {
  await connectDB();
  await Lead.findByIdAndDelete(id);
  revalidatePath(REVALIDATE_PATH);
}

export async function updateLead(
  id:      string,
  payload: Partial<Omit<LeadData, "id">>
): Promise<void> {
  await connectDB();
  await Lead.findByIdAndUpdate(id, { $set: payload });
  revalidatePath(REVALIDATE_PATH);
}