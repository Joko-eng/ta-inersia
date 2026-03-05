import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectList from "./components/ProjectList";

export default async function Page() {
  await connectDB();

  const raw = await Project.find({ isArchived: false }).lean();

  const projects = raw.map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    createdAt: p.createdAt.toISOString(),
  }));

  return <ProjectList projects={projects} />;
}
