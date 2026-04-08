import { connectDB } from "@/lib/mongodb";
import Milestone from "@/models/Milestone";
import Project from "@/models/Project";
import Task from "@/models/Task";
import "@/models/TeamMember";
import ShareTaskView from "./share-task";

export default async function SharePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  await connectDB();

  const project = await Project.findById(id).lean();

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Proyek tidak ditemukan.</p>
      </div>
    );
  }

  const milestones = await Milestone.find({ projectId: id }).lean();

  const milestoneIds = milestones.map((m: any) => m._id);
  const tasks = await Task.find({ milestoneId: { $in: milestoneIds } })
    .populate({
      path: "assignee",
      populate: { path: "userId", select: "name" },
    })
    .lean();

  const mappedTasks = tasks.map((t: any) => ({
    id: t._id.toString(),
    title: t.title,
    description: t.description || "",
    milestoneId: t.milestoneId?.toString() || "",
    assigneeName: (t.assignee as any)?.userId?.name || null,
    dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : "",
    priority: t.priority as "rendah" | "sedang" | "tinggi",
    status: t.status as "todo" | "inprogress" | "done",
    statusUpdatedAt: t.statusUpdatedAt
      ? new Date(t.statusUpdatedAt).toISOString()
      : "",
  }));

  const mappedMilestones = milestones.map((m: any) => ({
    id: m._id.toString(),
    title: m.name,
  }));

  return (
    <ShareTaskView
      projectName={(project as any).name || "Tanpa Nama"}
      tasks={mappedTasks}
      milestones={mappedMilestones}
    />
  );
}
