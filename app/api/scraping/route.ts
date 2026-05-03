import { NextRequest } from "next/server";

const FASTAPI_BASE = process.env.FASTAPI_URL ?? "http://localhost:8000";

const encoder = new TextEncoder();

function toSSE(type: string, message: string): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify({ type, message })}\n\n`);
}

async function startScrapeJob(
  keyword:  string,
  location: string,
  target:   number | null,
): Promise<string> {
  const res = await fetch(`${FASTAPI_BASE}/scrape`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ keyword, location, target }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.detail ?? `FastAPI error ${res.status}`);
  }

  const data = await res.json() as { job_id: string };
  return data.job_id;
}

function createErrorStream(message: string): ReadableStream {
  return new ReadableStream({
    start(ctrl) {
      ctrl.enqueue(toSSE("error", message));
      ctrl.close();
    },
  });
}

function createProxyStream(jobId: string): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      const send = (type: string, message: string) =>
        controller.enqueue(toSSE(type, message));

      try {
        const res = await fetch(`${FASTAPI_BASE}/scrape/${jobId}/stream`);

        if (!res.ok || !res.body) {
          send("error", `Stream tidak tersedia (${res.status})`);
          controller.close();
          return;
        }

        const reader  = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer    = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          let idx: number;
          while ((idx = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, idx).trim();
            buffer     = buffer.slice(idx + 1);

            if (!line.startsWith("data: ")) continue;

            try {
              const json = JSON.parse(line.slice(6)) as { type: string; message?: string };

              if (json.type === "closed") {
                send("done", "Scraping selesai.");
                controller.close();
                return;
              }

              if (json.type !== "connected" && json.type !== "ping") {
                send(json.type, json.message ?? "");
              }
            } catch { }
          }
        }
      } catch (e) {
        controller.enqueue(toSSE("error", `Stream terputus: ${String(e)}`));
      } finally {
        controller.close();
      }
    },
  });
}

export async function POST(req: NextRequest) {
  const { lokasi, kategori, jumlahData } = await req.json();

  if (!lokasi?.trim() || !kategori?.trim()) {
    return new Response(createErrorStream("Lokasi dan kategori wajib diisi."), {
      status:  400,
      headers: { "Content-Type": "text/event-stream" },
    });
  }

  let jobId: string;
  try {
    jobId = await startScrapeJob(kategori.trim(), lokasi.trim(), jumlahData ?? null);
  } catch (e) {
    return new Response(createErrorStream(`Gagal memulai job: ${String(e)}`), {
      headers: { "Content-Type": "text/event-stream" },
    });
  }

  return new Response(createProxyStream(jobId), {
    headers: {
      "Content-Type":              "text/event-stream",
      "Cache-Control":             "no-cache",
      "X-Accel-Buffering":         "no",
      Connection:                  "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}