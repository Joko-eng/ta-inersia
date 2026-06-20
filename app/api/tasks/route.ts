import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import { recomputeMilestone } from "@/lib/recomputeMilestone";
import Milestone from "@/models/Milestone";
import Task from "@/models/Task";
import TeamMember from "@/models/TeamMember";
import "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const {
    title,
    description,
    milestoneId,
    assignee,
    dueDate,
    priority,
    status,
    link,
    attachmentUrl,
    attachmentPublicId,
  } = body;

  if (!title || !milestoneId)
    return NextResponse.json(
      { error: "title & milestoneId required" },
      { status: 400 },
    );

  const task = await Task.create({
    title,
    description,
    milestoneId,
    assignee: assignee || null,
    dueDate: dueDate ? new Date(dueDate) : null,
    priority,
    status,
    link: link || null,
    attachmentUrl: attachmentUrl || null,
    attachmentPublicId: attachmentPublicId || null,
  });

  await recomputeMilestone(milestoneId);

  return NextResponse.json(task);
}

export async function PATCH(req: Request) {
  await connectDB();
  const { taskId, status } = await req.json();

  const task = await Task.findByIdAndUpdate(
    taskId,
    { status, statusUpdatedAt: new Date() },
    { new: true },
  );

  if (task) {
    await recomputeMilestone(task.milestoneId.toString());
  }

  return NextResponse.json(task);
}

export async function PUT(req: Request) {
  await connectDB();
  const {
    id,
    title,
    description,
    assignee,
    dueDate,
    priority,
    link,
    attachmentUrl,
    attachmentPublicId,
  } = await req.json();

  const task = await Task.findByIdAndUpdate(
    id,
    {
      title,
      description,
      assignee: assignee || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      link: link ?? null,
      attachmentUrl: attachmentUrl ?? null,
      attachmentPublicId: attachmentPublicId ?? null,
    },
    { new: true },
  );

  if (task) {
    await recomputeMilestone(task.milestoneId.toString());
  }

  return NextResponse.json(task);
}

export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();

  const task = await Task.findById(id);
  if (!task) return NextResponse.json({ success: true });

  // Bersihkan file bukti pengerjaan di Cloudinary jika ada
  if (task.attachmentPublicId) {
    try {
      await cloudinary.uploader.destroy(task.attachmentPublicId, {
        resource_type: "image",
      });
    } catch (err) {
      console.error("Gagal menghapus attachment dari Cloudinary:", err);
    }
  }

  await Task.findByIdAndDelete(id);
  await recomputeMilestone(task.milestoneId.toString());

  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) return NextResponse.json({ tasks: [], team: [] });

  const milestones = await Milestone.find({ projectId }).select("_id");
  const milestoneIds = milestones.map((m) => m._id);

  const tasks = await Task.find({
    milestoneId: { $in: milestoneIds },
  })
    .populate({
      path: "assignee",
      populate: {
        path: "userId",
        select: "name",
      },
    })
    .lean();

  const team = await TeamMember.find().populate("userId", "name").lean();

  return NextResponse.json({
    tasks: tasks.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      description: t.description,
      milestoneId: t.milestoneId.toString(),
      assignee:
        t.assignee && typeof t.assignee === "object"
          ? {
              id: t.assignee._id?.toString(),
              name: t.assignee.userId?.name || "-",
              division: t.assignee.division || "-",
            }
          : null,
      priority: t.priority,
      status: t.status,
      statusUpdatedAt: t.statusUpdatedAt,
      link: t.link || null,
      attachmentUrl: t.attachmentUrl || null,
      attachmentPublicId: t.attachmentPublicId || null,
    })),
    team: team.map((m) => ({
      _id: m._id.toString(),
      division: m.division,
      userId: { name: m.userId?.name || "-" },
    })),
  });
}
