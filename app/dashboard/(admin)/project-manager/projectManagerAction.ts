"use server";

import { revalidatePath } from "next/cache";
import {
  dbGetProjectManagers,
  dbCreateProjectManager,
  dbUpdateProjectManager,
  dbDeleteProjectManager,
} from "@/lib/services/projectManagerService";
import {
  createProjectManagerSchema,
  updateProjectManagerSchema,
} from "@/validators/projectManagerValidator";
import { ProjectManagerData } from "@/types/IProjectManager";

const REVALIDATE_PATH = "/project-manager";

export async function getProjectManagers(): Promise<ProjectManagerData[]> {
  return dbGetProjectManagers();
}

export async function createProjectManager(
  raw: unknown,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = createProjectManagerSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const result = await dbCreateProjectManager(parsed.data);
  if (result.ok) revalidatePath(REVALIDATE_PATH);
  return result;
}

export async function updateProjectManager(
  id:  string,
  raw: unknown,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = updateProjectManagerSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const result = await dbUpdateProjectManager(id, parsed.data);
  if (result.ok) revalidatePath(REVALIDATE_PATH);
  return result;
}

export async function deleteProjectManager(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const result = await dbDeleteProjectManager(id);
  if (result.ok) revalidatePath(REVALIDATE_PATH);
  return result;
}