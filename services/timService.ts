import { connectDB } from "@/lib/mongodb";
import Milestone from "@/models/Milestone";
import Project from "@/models/Project";
import Task from "@/models/Task";
import "@/models/TeamMember";
import { Milestone as MilestoneDTO } from "@/types/IMilestone";
import { Task as TaskDTO } from "@/types/ITask";

export async function getSharePageData(id: string) {
  await connectDB();

  const project = await Project.findById(id).lean();
  if (!project) return null;

  const milestones = await Milestone.find({ projectId: id }).lean();
  const milestoneIds = milestones.map((m: any) => m._id);

  const tasks = await Task.find({ milestoneId: { $in: milestoneIds } })
    .populate({
      path: "assignee",
      populate: { path: "userId", select: "name" },
    })
    .lean();

  const mappedTasks: TaskDTO[] = tasks.map((t: any) => ({
    id: t._id.toString(),
    title: t.title,
    description: t.description || "",
    milestoneId: t.milestoneId?.toString() || "",
    assigneeName: t.assignee?.userId?.name || null,
    dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : "",
    priority: t.priority,
    status: t.status,
    statusUpdatedAt: t.statusUpdatedAt
      ? new Date(t.statusUpdatedAt).toISOString()
      : undefined,
  }));

  const mappedMilestones: MilestoneDTO[] = milestones.map((m: any) => ({
    id: m._id.toString(),
    title: m.name,
  }));

  return {
    projectName: (project as any).name || "Tanpa Nama",
    tasks: mappedTasks,
    milestones: mappedMilestones,
  };
}
