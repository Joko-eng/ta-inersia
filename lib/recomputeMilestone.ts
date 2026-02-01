import Milestone from "@/models/Milestone";
import Task from "@/models/Task";

export async function recomputeMilestone(milestoneId: string) {
  const tasks = await Task.find({ milestoneId });

  if (!tasks.length) {
    await Milestone.findByIdAndUpdate(milestoneId, {
      status: "menunggu",
      completedAt: null,
    });
    return;
  }

  const allDone = tasks.every((t) => t.status === "done");
  const anyProgress = tasks.some((t) => t.status === "inprogress");

  let status: "menunggu" | "sedang_dikerjakan" | "selesai" = "menunggu";

  if (allDone) status = "selesai";
  else if (anyProgress) status = "sedang_dikerjakan";

  await Milestone.findByIdAndUpdate(milestoneId, {
    status,
    completedAt: status === "selesai" ? new Date() : null,
  });
}
