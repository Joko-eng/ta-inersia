import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { ProjectData } from "@/types/IProject";
import { CreateProjectInput, UpdateProjectInput } from "@/validators/projectValidator";

const RANDOM_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateRandomString(length: number): string {
  return Array.from({ length }, () =>
    RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)]
  ).join("");
}

function getDateStamp(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

async function generateTrackerCode(): Promise<string> {
  const last = await Project.findOne({}, { trackerCode: 1 })
    .sort({ trackerCode: -1 })
    .lean();

  let nextNumber = 1;

  if (last?.trackerCode) {
    const parts = (last.trackerCode as string).split("-");
    const lastNum = parseInt(parts[0], 10);
    if (!isNaN(lastNum)) nextNumber = lastNum + 1;
  }

  const order  = String(nextNumber).padStart(4, "0");
  const date   = getDateStamp();
  const random = generateRandomString(8);

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
    clientPhone:        item.clientPhone ?? "",
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
    const trackerCode = await generateTrackerCode();
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