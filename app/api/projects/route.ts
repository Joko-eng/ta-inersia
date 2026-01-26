import { NextResponse } from "next/server";

export async function GET() {
  // Fetch nantinya kalau sudah terhubung ke database
  // ingat ini caranya joko
  // const projects = await db.project.findMany();

  // Contoh data
  const projects = [
    { id: "1", name: "Inventaris PT XYZ" },
    { id: "2", name: "Manajamen Toko ABC" },
    { id: "3", name: "Company Profile Mudapedia" },
    { id: "4", name: "Sistem Informasi Akademik" },
  ];

  return NextResponse.json(projects);
}
