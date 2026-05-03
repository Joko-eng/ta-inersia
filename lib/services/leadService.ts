import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { LeadData } from "@/types/ILead";

export async function dbGetLeads(): Promise<LeadData[]> {
  await connectDB();
  const leads = await Lead.find().sort({ createdAt: -1 }).lean();

  return leads.map((item: any) => ({
    id:           item._id.toString(),
    nama:         item.nama          ?? "",
    rating:       item.rating        ?? 0,
    jumlahUlasan: item.jumlahUlasan  ?? 0,
    noTelp:       item.noTelp        ?? "",
    alamat:       item.alamat        ?? "",
    mapsUrl:      item.mapsUrl       ?? "",
    keterangan:   item.keterangan    ?? "",
    status:       item.status        ?? "Belum Diproses",
  }));
}

export async function dbUpdateLead(
  id:      string,
  payload: Partial<Omit<LeadData, "id">>,
): Promise<{ ok: boolean; error?: string }> {
  if (!id || !Object.keys(payload).length) {
    return { ok: false, error: "Payload kosong." };
  }

  try {
    await connectDB();
    const result = await Lead.findByIdAndUpdate(id, { $set: payload }, { new: true });

    if (!result) return { ok: false, error: "Data tidak ditemukan." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal mengupdate data." };
  }
}

export async function dbDeleteLead(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: "ID tidak valid." };

  try {
    await connectDB();
    const result = await Lead.findByIdAndDelete(id);

    if (!result) return { ok: false, error: "Data tidak ditemukan." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal menghapus data." };
  }
}