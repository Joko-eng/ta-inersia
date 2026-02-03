import { connectDB } from "@/lib/mongodb";
import Milestone from "@/models/Milestone";
import ProjectClient from "./project-client";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  await connectDB();

  const milestones = await Milestone.find({
    projectId: id,
  }).lean();

  const mapped = milestones.map((m: any) => ({
    id: m._id.toString(),
    title: m.name,
    deadline: m.dueDate ? m.dueDate.toISOString() : "",
    status: m.status,
  }));

  return <ProjectClient projectId={id} initialMilestones={mapped} />;
}
