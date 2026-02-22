import { NextResponse }   from "next/server";
import { connectDB }       from "@/lib/mongodb";
import Lead                from "@/models/Lead";
import { runPrediction }   from "@/lib/ml/predictorML";
import { PredictionInput } from "@/lib/ml/interfaceML";

export async function POST(): Promise<NextResponse> {
  try {
    await connectDB();

    const leads = await Lead.find({ status: "Belum Diproses" }).lean();

    if (leads.length === 0) {
      return NextResponse.json({
        pesan:    "Tidak ada data dengan status Belum Diproses.",
        diproses: 0,
      });
    }

    const inputs: PredictionInput[] = leads.map((lead: any) => ({
      rating:        lead.rating       ?? 0,
      jumlah_ulasan: lead.jumlahUlasan ?? 0,
      website:       lead.website ? 1 : 0,
    }));

    const predictions = await runPrediction(inputs);

    let prospek      = 0;
    let belumProspek = 0;

    await Promise.all(
      leads.map(async (lead: any, i: number) => {
        const status = predictions[i].status;
        if (status === "Prospek") prospek++;
        else belumProspek++;
        await Lead.findByIdAndUpdate(lead._id, { $set: { status } });
      })
    );

    return NextResponse.json({
      pesan:         "Klasifikasi selesai.",
      diproses:      leads.length,
      prospek,
      belum_prospek: belumProspek,
    });

  } catch (err) {
    return NextResponse.json(
      { error: `Terjadi kesalahan: ${String(err)}` },
      { status: 500 }
    );
  }
}