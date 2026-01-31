import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const name = body.name?.trim();
    const trackerCode = body.trackerCode?.trim().toUpperCase();
    const projectManagerId = body.projectManagerId;

    console.log("CREATE PROJECT:", name, trackerCode);

    if (!name || !trackerCode || !projectManagerId) {
      return NextResponse.json(
        { message: "name, trackerCode, projectManagerId wajib diisi" },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(projectManagerId)) {
      return NextResponse.json(
        { message: "projectManagerId tidak valid" },
        { status: 400 },
      );
    }

    const pmUser = await User.findById(projectManagerId);

    if (!pmUser) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    if (pmUser.role !== "project_manager") {
      return NextResponse.json(
        { message: "User ini bukan project manager" },
        { status: 403 },
      );
    }

    const exists = await Project.findOne({ trackerCode });

    if (exists) {
      return NextResponse.json(
        { message: "Tracker code sudah dipakai" },
        { status: 409 },
      );
    }

    const project = await Project.create({
      name,
      trackerCode,
      projectManagerId: pmUser._id,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  await connectDB();

  const projects = await Project.find().select("_id name").lean();

  return NextResponse.json(
    projects.map((p) => ({
      id: p._id.toString(),
      name: p.name,
    })),
  );
}
