"use server";

import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

export async function archiveProject(projectId: string) {
  await connectDB();
  await Project.findByIdAndUpdate(projectId, { isArchived: true });
}

export async function restoreProject(projectId: string) {
  await connectDB();
  await Project.findByIdAndUpdate(projectId, { isArchived: false });
}
