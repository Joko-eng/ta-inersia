import { NextRequest, NextResponse } from "next/server";

const FASTAPI_BASE = process.env.FASTAPI_URL ?? "http://localhost:8000";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ job_id: string }> },
) {
  const { job_id } = await params;
  const res = await fetch(`${FASTAPI_BASE}/scrape/${params.job_id}/cancel`, {
    method: "POST",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: body?.detail ?? `FastAPI error ${res.status}` },
      { status: res.status },
    );
  }

  return new Response(null, { status: 204 });
}