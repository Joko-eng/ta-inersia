import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

export async function archiveProjectById(projectId: string) {
  await connectDB();
  await Project.findByIdAndUpdate(projectId, { isArchived: true });
}

export async function restoreProjectById(projectId: string) {
  await connectDB();
  await Project.findByIdAndUpdate(projectId, { isArchived: false });
}
