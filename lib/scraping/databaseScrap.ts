import Lead from "@/models/Lead";
import { BusinessData, SendFn, DatabaseCounter } from "./interfaceScrap";

export async function saveBusinessToDatabase(
  item:     BusinessData,
  location: string,
  category: string,
  send:     SendFn,
  counter:  DatabaseCounter
): Promise<void> {
  try {
    const exists = await Lead.findOne({ nama: item.business_name, lokasi: location });

    if (exists) {
      counter.skipped++;
      return;
    }

    await Lead.create({
      nama:         item.business_name,
      rating:       item.rating,
      jumlahUlasan: item.review_count,
      noTelp:       item.phone,
      alamat:       item.address,
      status:       "Belum Diproses",
      keyword:      category,
      lokasi:       location,
    });

    counter.saved++;
    send("success", `Tersimpan ke database: ${item.business_name}`);
  } catch (err) {
    send("error", `Gagal menyimpan "${item.business_name}": ${String(err)}`);
  }
}