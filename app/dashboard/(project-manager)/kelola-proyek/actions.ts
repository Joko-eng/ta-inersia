"use server";
import {
  archiveProjectById,
  restoreProjectById,
} from "@/lib/services/projectMService";

export async function archiveProject(projectId: string) {
  await archiveProjectById(projectId);
}

export async function restoreProject(projectId: string) {
  await restoreProjectById(projectId);
}
