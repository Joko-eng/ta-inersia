"use server";

import { connectDB } from "@/lib/mongodb";
import Lead          from "@/models/Lead";
import Project       from "@/models/Project";
import { revalidatePath } from "next/cache";
import { z }         from "zod";

export type ProjectData = {
  id:          string;
  name:        string;
  trackerCode: string;
  isArchived:  boolean;
  createdAt:   string;
  leadNama:    string | null;
};

export type LeadOption = {
  id:     string;
  nama:   string;
  lokasi: string;
};

export async function getProjects(): Promise<ProjectData[]> {
  await connectDB();

  const projects = await Project.find().sort({ createdAt: -1 }).lean();

  const leadIds = projects
    .map((p: any) => p.leadId)
    .filter(Boolean);

  let leadMap: Record<string, string> = {};

  if (leadIds.length > 0) {
    const leads = await Lead.find({ _id: { $in: leadIds } }).select("nama").lean();
    leadMap = Object.fromEntries(
      leads.map((l: any) => [l._id.toString(), l.nama as string])
    );
  }

  return projects.map((p: any) => ({
    id:          p._id.toString(),
    name:        p.name,
    trackerCode: p.trackerCode,
    isArchived:  p.isArchived,
    createdAt:   p.createdAt.toISOString(),
    leadNama:    p.leadId ? (leadMap[p.leadId.toString()] ?? null) : null,
  }));
}

export async function getProspekLeads(): Promise<LeadOption[]> {
  await connectDB();

  const leads = await Lead.find({ status: "Prospek" })
    .select("nama lokasi")
    .sort({ nama: 1 })
    .lean();

  return leads.map((l: any) => ({
    id:     l._id.toString(),
    nama:   l.nama,
    lokasi: l.lokasi ?? "",
  }));
}

const createProjectSchema = z.object({
  name:             z.string().min(3, "Nama proyek minimal 3 karakter").max(120, "Nama proyek terlalu panjang"),
  trackerCode:      z.string().min(2, "Kode tracker minimal 2 karakter").max(10, "Kode tracker maksimal 10 karakter").regex(/^[A-Za-z0-9]+$/, "Hanya huruf dan angka"),
  projectManagerId: z.string().min(1, "Project Manager ID wajib diisi").regex(/^[a-f\d]{24}$/i, "ID tidak valid"),
  leadId:           z.string().optional(),
});

export async function createProject(
  formData: FormData
): Promise<{ success: true } | { error: Record<string, string[]> }> {
  await connectDB();

  const data = {
    name:             formData.get("name"),
    trackerCode:      formData.get("trackerCode"),
    projectManagerId: formData.get("projectManagerId"),
    leadId:           formData.get("leadId") || undefined,
  };

  const parsed = createProjectSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const existing = await Project.findOne({ trackerCode: parsed.data.trackerCode.toUpperCase() });
  if (existing) {
    return { error: { trackerCode: ["Kode tracker sudah digunakan"] } };
  }

  await Project.create({
    name:             parsed.data.name,
    trackerCode:      parsed.data.trackerCode.toUpperCase(),
    projectManagerId: parsed.data.projectManagerId,
    ...(parsed.data.leadId ? { leadId: parsed.data.leadId } : {}),
  });

  revalidatePath("/proyek");

  return { success: true };
}

export async function archiveProject(projectId: string): Promise<void> {
  await connectDB();
  await Project.findByIdAndUpdate(projectId, { isArchived: true });
  revalidatePath("/proyek");
}

export async function restoreProject(projectId: string): Promise<void> {
  await connectDB();
  await Project.findByIdAndUpdate(projectId, { isArchived: false });
  revalidatePath("/proyek");
}