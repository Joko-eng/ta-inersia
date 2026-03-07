import { connectDB } from "@/lib/mongodb";
import Milestone from "@/models/Milestone";
export async function getDeadlines() {
  await connectDB();
  const today = new Date();
  const inThreeDays = new Date();
  inThreeDays.setDate(today.getDate() + 3);

  const milestones = await Milestone.find({
    status: { $ne: "selesai" },
    dueDate: { $ne: null, $gte: today, $lte: inThreeDays },
  })
    .populate("projectId", "name")
    .sort({ dueDate: 1 })
    .lean();

  return JSON.parse(JSON.stringify(milestones));
}
