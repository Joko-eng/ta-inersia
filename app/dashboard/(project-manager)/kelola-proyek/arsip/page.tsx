import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import ArsipList from "../components/ArsipList";

export default async function ArsipPage() {
  await connectDB();

  const raw = await Project.find({ isArchived: true }).lean();

  const projects = raw.map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    createdAt: p.createdAt.toISOString(),
  }));

  return <ArsipList projects={projects} />;
}
