import { NextResponse } from "next/server";

export async function GET() {
  // Fetch dari database
  // const projects = await db.project.findMany();

  // Contoh data
  const projects = [
    { id: "1", name: "Inventaris PT XYZ" },
    { id: "2", name: "Manajamen Toko ABC" },
    { id: "3", name: "Company Profile Ijenesia" },
    { id: "4", name: "Design Web Tech" },
  ];

  return NextResponse.json(projects);
}
