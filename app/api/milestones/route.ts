import { connectDB } from "@/lib/mongodb";
import Milestone from "@/models/Milestone";
import Project from "@/models/Project";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

/* =========================
   CREATE MILESTONE
   ========================= */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, dueDate, projectId, status } = await req.json();

    if (!name || !dueDate || !projectId) {
      return NextResponse.json(
        { message: "name, dueDate, projectId wajib diisi" },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { message: "projectId tidak valid" },
        { status: 400 },
      );
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { message: "Project tidak ditemukan" },
        { status: 404 },
      );
    }

    const last = await Milestone.find({ projectId })
      .sort({ order: -1 })
      .limit(1);

    const nextOrder = last.length ? last[0].order + 1 : 1;

    const milestone = await Milestone.create({
      name,
      dueDate: new Date(dueDate),
      status: status || "menunggu",
      projectId,
      order: nextOrder,
    });

    return NextResponse.json(milestone, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

/* =========================
   GET MILESTONE BY PROJECT
   ========================= */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const projectId = req.nextUrl.searchParams.get("projectId");

    if (!projectId) return NextResponse.json([]);

    if (!mongoose.Types.ObjectId.isValid(projectId))
      return NextResponse.json([]);

    const milestones = await Milestone.find({ projectId }).sort({ order: 1 });

    return NextResponse.json(milestones);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}
