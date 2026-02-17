import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params; 

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { message: "Proyek tidak ditemukan" },
        { status: 404 },
      );
    }

    project.isArchived = !project.isArchived;
    await project.save();

    return NextResponse.json({
      message: project.isArchived
        ? "Proyek berhasil diarsipkan"
        : "Proyek berhasil dipulihkan",
      isArchived: project.isArchived,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
