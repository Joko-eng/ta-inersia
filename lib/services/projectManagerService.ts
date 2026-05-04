import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import { ProjectManagerData } from "@/types/IProjectManager";
import { CreateProjectManagerInput, UpdateProjectManagerInput } from "@/validators/projectManagerValidator";

export async function archiveProjectById(projectId: string) {
  await connectDB();
  await Project.findByIdAndUpdate(projectId, { isArchived: true });
}

export async function restoreProjectById(projectId: string) {
  await connectDB();
  await Project.findByIdAndUpdate(projectId, { isArchived: false });
}

function toProjectManagerData(item: any): ProjectManagerData {
  return {
    id:        item._id.toString(),
    name:      item.name ?? "",
    email:     item.email ?? "",
    username:  item.username ?? "",
    createdAt: item.createdAt?.toISOString() ?? "",
  };
}
 
export async function dbGetProjectManagers(): Promise<ProjectManagerData[]> {
  await connectDB();
  const users = await User.find({ role: "project_manager" })
    .sort({ createdAt: -1 })
    .lean();
  return users.map(toProjectManagerData);
}
 
export async function dbCreateProjectManager(
  payload: CreateProjectManagerInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await connectDB();
    await User.create({ ...payload, role: "project_manager" });
    return { ok: true };
  } catch (err: any) {
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern ?? {})[0];
      const label = field === "email" ? "Email" : "Username";
      return { ok: false, error: `${label} sudah digunakan.` };
    }
    return { ok: false, error: "Gagal membuat project manager." };
  }
}
 
export async function dbUpdateProjectManager(
  id:      string,
  payload: UpdateProjectManagerInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await connectDB();
    const result = await User.findOneAndUpdate(
      { _id: id, role: "project_manager" },
      { $set: payload },
      { new: true },
    );
    if (!result) return { ok: false, error: "Project manager tidak ditemukan." };
    return { ok: true };
  } catch (err: any) {
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern ?? {})[0];
      const label = field === "email" ? "Email" : "Username";
      return { ok: false, error: `${label} sudah digunakan.` };
    }
    return { ok: false, error: "Gagal mengupdate project manager." };
  }
}
 
export async function dbDeleteProjectManager(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await connectDB();
    const result = await User.findOneAndDelete({ _id: id, role: "project_manager" });
    if (!result) return { ok: false, error: "Project manager tidak ditemukan." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal menghapus project manager." };
  }
}
