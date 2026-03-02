import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Milestone from "@/models/Milestone";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Parameter 'code' wajib diisi." },
        { status: 400 }
      );
    }

    await connectDB();

    const project = await Project.findOne({
      trackerCode: code.trim().toUpperCase(),
    }).lean();

    if (!project) {
      return NextResponse.json(
        { error: "Project dengan kode tersebut tidak ditemukan." },
        { status: 404 }
      );
    }

    const milestones = await Milestone.find({
      projectId: project._id,
    })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ project, milestones });
  } catch (error) {
    console.error("[TRACK_GET]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}