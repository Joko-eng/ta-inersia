"use server";

import { revalidatePath } from "next/cache";
import { dbGetProjects, dbCreateProject, dbUpdateProject, dbDeleteProject } from "@/lib/services/projectAdminService";
import { dbGetLeads } from "@/lib/services/leadService";
import { createProjectSchema, updateProjectSchema } from "@/validators/projectValidator";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { ProjectData, ProjectManagerOption } from "@/types/IProject";
import { LeadData } from "@/types/ILead";

const REVALIDATE_PATH = "/project";

export async function getProjects(): Promise<ProjectData[]> {
  return dbGetProjects();
}

export async function getProspekLeads(): Promise<LeadData[]> {
  const leads = await dbGetLeads();
  return leads.filter((l) => l.status === "Prospek");
}

export async function getProjectManagers(): Promise<ProjectManagerOption[]> {
  await connectDB();
  const users = await User.find({ role: "project_manager" })
    .select("name email")
    .sort({ name: 1 })
    .lean();

  return users.map((u: any) => ({
    id:    u._id.toString(),
    name:  u.name,
    email: u.email,
  }));
}

export async function createProject(
  raw: unknown,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = createProjectSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const result = await dbCreateProject(parsed.data);
  if (result.ok) revalidatePath(REVALIDATE_PATH);
  return result;
}

export async function updateProject(
  id:  string,
  raw: unknown,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = updateProjectSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const result = await dbUpdateProject(id, parsed.data);
  if (result.ok) revalidatePath(REVALIDATE_PATH);
  return result;
}

export async function deleteProject(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const result = await dbDeleteProject(id);
  if (result.ok) revalidatePath(REVALIDATE_PATH);
  return result;
}