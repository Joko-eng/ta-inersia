import { connectDB } from "@/lib/mongodb";
import { recomputeMilestone } from "@/lib/recomputeMilestone";
import Milestone from "@/models/Milestone";
import Task from "@/models/Task";
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
  } = body;

  if (!title || !milestoneId) {
    return NextResponse.json(
      { error: "title & milestoneId required" },
      { status: 400 },
    );
  }

  const task = await Task.create({
    title,
    description,
    milestoneId,
    assignee: assignee,
    dueDate: dueDate ? new Date(dueDate) : null,
    priority,
    status,
  });

  await recomputeMilestone(milestoneId);

  return NextResponse.json(task);
}

export async function PATCH(req: Request) {
  await connectDB();
  const body = await req.json();

  const { taskId, status } = body;

  const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true });

  if (task) {
    await recomputeMilestone(task.milestoneId.toString());
  }

  return NextResponse.json(task);
}

export async function PUT(req: Request) {
  await connectDB();
  const body = await req.json();

  const { id, title, description, assignee, dueDate, priority } = body;

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  try {
    const task = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        assignee: assignee || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (task) {
      await recomputeMilestone(task.milestoneId.toString());
    }

    return NextResponse.json(task);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const task = await Task.findById(id);
  if (!task) return NextResponse.json({ success: true });

  await Task.findByIdAndDelete(id);
  await recomputeMilestone(task.milestoneId.toString());

  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) return NextResponse.json([]);

  const milestones = await Milestone.find({ projectId }).select("_id");

  const milestoneIds = milestones.map((m) => m._id);

  const tasks = await Task.find({
    milestoneId: { $in: milestoneIds },
    assignee: { $ne: null },
  })
    .populate({
      path: "assignee",
      populate: { path: "userId" },
    })
    .lean();

  return NextResponse.json(
    tasks.map((t) => ({
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
      dueDate: t.dueDate,
      priority: t.priority,
      status: t.status,
    })),
  );
}
