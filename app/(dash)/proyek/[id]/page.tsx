import { connectDB } from "@/lib/mongodb";
import Milestone from "@/models/Milestone";
import Project from "@/models/Project";
import ProjectClient from "./project-client";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  await connectDB();

  const project = await Project.findById(id).lean();

  const milestones = await Milestone.find({
    projectId: id,
  }).lean();

  const mapped = milestones.map((m: any) => ({
    id: m._id.toString(),
    title: m.name,
    description: m.description || "",
    deadline: m.dueDate ? m.dueDate.toISOString() : "",
    status: m.status,
  }));

  return (
    <ProjectClient
      projectId={id}
      initialMilestones={mapped}
      name={project?.name || "Tanpa Nama"}
    />
  );
}
