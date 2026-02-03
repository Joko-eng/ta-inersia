"use server";
import { connectDB } from "@/lib/mongodb";
import Milestone from "@/models/Milestone";
import { revalidatePath } from "next/cache";

export async function createMilestone(formData: FormData) {
  await connectDB();

  const projectId = formData.get("projectId") as string;

  await Milestone.create({
    name: formData.get("name"),
    dueDate: formData.get("dueDate"),
    projectId: projectId,
    status: "menunggu",
  });

  revalidatePath(`/proyek/${projectId}`);
}

export async function deleteMilestone(id: string, projectId: string) {
  "use server";

  await connectDB();
  await Milestone.findByIdAndDelete(id);

  revalidatePath(`/proyek/${projectId}`);
}

export async function updateMilestone(
  id: string,
  projectId: string,
  formData: FormData,
) {
  "use server";

  await connectDB();

  await Milestone.findByIdAndUpdate(id, {
    name: formData.get("name"),
    dueDate: formData.get("dueDate"),
  });

  revalidatePath(`/proyek/${projectId}`);
}
