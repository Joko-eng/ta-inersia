import { Browser } from "playwright";
import { connectDB } from "@/lib/mongodb";

import { SCRAPING_CONFIG }       from "@/lib/scraping/configScrap";
import { DatabaseCounter, SendFn } from "@/lib/scraping/interfaceScrap";
import { pickRandom }            from "@/lib/scraping/utilityScrap";
import { launchBrowser }         from "@/lib/scraping/browserScrap";
import { navigateToSearch, scrollResultsPanel } from "@/lib/scraping/navigationScrap";
import { collectAllBusinesses }  from "@/lib/scraping/collectorScrap";
import { saveBusinessToDatabase } from "@/lib/scraping/databaseScrap";

const encoder = new TextEncoder();

function buildSSELine(type: string, message?: string, data?: unknown): Uint8Array {
  const payload = message !== undefined ? { type, message } : { type, data };
  return encoder.encode(`data: ${JSON.stringify(payload)}\n\n`);
}

export async function POST(req: Request): Promise<Response> {
  const { lokasi, kategori, jumlahData } = await req.json();

  const target      = Math.min(parseInt(jumlahData) || 10, SCRAPING_CONFIG.MAX_DATA_PER_SESSION);
  const searchQuery = `${kategori} di ${lokasi}`;
  const userAgent   = pickRandom(SCRAPING_CONFIG.USER_AGENTS);

  const stream = new ReadableStream({
    async start(controller) {
      const send: SendFn = (type, message) => {
        controller.enqueue(buildSSELine(type, message));
      };

      let browser: Browser | null = null;

      try {
        await connectDB();
        send("info", "Koneksi database berhasil.");
        send("info", "Sesi scraping dimulai.");
        send("info", `Keyword  : ${kategori}`);
        send("info", `Lokasi   : ${lokasi}`);
        send("info", `Target   : ${target} data`);

        send("info", "Menjalankan browser...");
        const { browser: b, page } = await launchBrowser(userAgent);
        browser = b;

        send("info", `Membuka Google Maps: ${searchQuery}`);
        await navigateToSearch(page, searchQuery);

        send("loading", "Memuat hasil pencarian...");
        await scrollResultsPanel(page, SCRAPING_CONFIG.MAX_SCROLL_ATTEMPTS, target, send);

        send("info", "Memulai ekstraksi data bisnis...");

        const counter: DatabaseCounter = { saved: 0, skipped: 0 };

        const results = await collectAllBusinesses(
          page,
          target,
          send,
          (item) => saveBusinessToDatabase(item, lokasi, kategori, send, counter)
        );

        send("info",    "Sesi scraping selesai.");
        send("success", `Total terkumpul  : ${results.length} data`);
        send("success", `Tersimpan ke DB  : ${counter.saved} data`);
        send("info",    `Duplikat dilewati: ${counter.skipped} data`);
        send("info",    "Semua data disimpan dengan status: Belum Diproses");

        controller.enqueue(buildSSELine("done", undefined, results));
      } catch (err) {
        send("error", `Terjadi kesalahan fatal: ${String(err)}`);
      } finally {
        if (browser) await browser.close().catch(() => {});
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection":    "keep-alive",
    },
  });
}