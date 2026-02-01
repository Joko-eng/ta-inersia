"use server";

import { connectDB } from "@/lib/mongodb";
import { recomputeMilestone } from "@/lib/recomputeMilestone";
import Milestone from "@/models/Milestone";
import Task from "@/models/Task";

export async function createMilestone(form: {
  name: string;
  dueDate?: string;
  projectId: string;
}) {
  await connectDB();

  await Milestone.create({
    name: form.name,
    projectId: form.projectId,
    dueDate: form.dueDate ? new Date(form.dueDate) : null,
  });
}

// ================= TASK =================

export async function createTask(data: {
  title: string;
  description?: string;
  milestoneId: string;
  assignee?: string;
  dueDate?: string;
  priority: "rendah" | "sedang" | "tinggi";
  status: "todo" | "inprogress" | "done";
}) {
  await connectDB();

  const task = await Task.create({
    title: data.title,
    description: data.description,
    milestoneId: data.milestoneId,
    assignee: data.assignee || "Rifa Yuwono",
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    priority: data.priority,
    status: data.status,
  });

  await recomputeMilestone(data.milestoneId);

  return task;
}

export async function updateTaskStatus(
  taskId: string,
  status: "todo" | "inprogress" | "done",
) {
  await connectDB();

  const task = await Task.findByIdAndUpdate(taskId, { status });

  if (task) {
    await recomputeMilestone(task.milestoneId.toString());
  }
}
