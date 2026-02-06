import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, trackerCode, projectManagerId } = body;

    if (!name || !trackerCode || !projectManagerId) {
      return NextResponse.json(
        { message: "name, trackerCode, dan projectManagerId wajib diisi" },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(projectManagerId)) {
      return NextResponse.json(
        { message: "projectManagerId tidak valid" },
        { status: 400 },
      );
    }

    const exists = await Project.findOne({
      trackerCode: trackerCode.toUpperCase(),
    });

    if (exists) {
      return NextResponse.json(
        { message: "trackerCode sudah digunakan" },
        { status: 409 },
      );
    }

    const project = await Project.create({
      name,
      trackerCode,
      projectManagerId,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err: any) {
    console.error(err);

    if (err.code === 11000) {
      return NextResponse.json(
        { message: "trackerCode harus unik" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "Gagal membuat project" },
      { status: 500 },
    );
  }
}
