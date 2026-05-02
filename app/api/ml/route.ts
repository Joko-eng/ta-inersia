import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const FASTAPI_BASE = process.env.FASTAPI_URL ?? "http://localhost:8000";

function parseClassificationCounts(logs: string[]): { prospek: number; belum_prospek: number } {
  let prospek = 0;
  let belum_prospek = 0;

  for (const entry of logs) {
    const match = entry.match(/Prospek:\s*(\d+),\s*Belum Prospek:\s*(\d+)/i);
    if (match) {
      prospek += parseInt(match[1]);
      belum_prospek += parseInt(match[2]);
    }
  }

  return { prospek, belum_prospek };
}

export async function POST(_req: NextRequest) {
  try {
    const { data } = await axios.post<{ log: string[] }>(`${FASTAPI_BASE}/classify`);
    const { prospek, belum_prospek } = parseClassificationCounts(data.log ?? []);

    return NextResponse.json({ prospek, belum_prospek, log: data.log });
  } catch (e) {
    const message = axios.isAxiosError(e)
      ? (e.response?.data?.detail ?? e.message)
      : String(e);

    return NextResponse.json(
      { error: `Tidak bisa terhubung ke ML server: ${message}` },
      { status: axios.isAxiosError(e) ? (e.response?.status ?? 502) : 502 }
    );
  }
}