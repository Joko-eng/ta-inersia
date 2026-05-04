import { connectDB } from "@/lib/mongodb";
import Milestone from "@/models/Milestone";
import Task from "@/models/Task";
import type { MilestoneInput } from "@/validators/milestoneValidator";

export function validateDueDate(date: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const input = new Date(date);
  return input >= today;
}

export async function createMilestoneRecord(data: MilestoneInput) {
  await connectDB();
  await Milestone.create({
    ...data,
    status: "menunggu",
  });
}

export async function deleteMilestoneById(id: string) {
  await connectDB();
  const taskCount = await Task.countDocuments({ milestoneId: id });
  if (taskCount > 0) {
    throw new Error("Milestone tidak dapat dihapus karena masih memiliki task");
  }
  await Milestone.findByIdAndDelete(id);
}

export async function updateMilestoneById(id: string, data: MilestoneInput) {
  await connectDB();
  await Milestone.findByIdAndUpdate(id, data);
}
