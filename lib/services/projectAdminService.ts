import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { ProjectData } from "@/types/IProject";
import { CreateProjectInput, UpdateProjectInput } from "@/validators/projectValidator";

function generateTrackerCode(index: number): string {
  const date   = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const order  = String(index).padStart(4, "0");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${order}-${date}-${random}`;
}

function toProjectData(item: any): ProjectData {
  return {
    id:                 item._id.toString(),
    name:               item.name ?? "",
    trackerCode:        item.trackerCode ?? "",
    projectManagerId:   item.projectManagerId?._id?.toString() ?? "",
    projectManagerName: item.projectManagerId?.name ?? "",
    clientName:         item.clientName ?? "",
    clientBusiness:     item.clientBusiness ?? "",
    isArchived:         item.isArchived ?? false,
    createdAt:          item.createdAt?.toISOString() ?? "",
  };
}

export async function dbGetProjects(): Promise<ProjectData[]> {
  await connectDB();
  const projects = await Project.find()
    .sort({ createdAt: -1 })
    .populate("projectManagerId", "name")
    .lean();
  return projects.map(toProjectData);
}

export async function dbCreateProject(
  payload: CreateProjectInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await connectDB();
    const count       = await Project.countDocuments();
    const trackerCode = generateTrackerCode(count + 1);
    await Project.create({ ...payload, trackerCode });
    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal membuat project." };
  }
}

export async function dbUpdateProject(
  id:      string,
  payload: UpdateProjectInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await connectDB();
    const result = await Project.findByIdAndUpdate(id, { $set: payload }, { new: true });
    if (!result) return { ok: false, error: "Project tidak ditemukan." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal mengupdate project." };
  }
}

export async function dbDeleteProject(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await connectDB();
    const result = await Project.findByIdAndDelete(id);
    if (!result) return { ok: false, error: "Project tidak ditemukan." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal menghapus project." };
  }
}