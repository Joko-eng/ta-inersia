"use server";

import { connectDB } from "@/lib/mongodb";
import Milestone from "@/models/Milestone";
import Project from "@/models/Project";
import { TrackResult } from "./Types";

export type TrackingState = {
  result: TrackResult | null;
  error: string | null;
  searched: boolean;
};

export async function searchTracking(
  _prevState: TrackingState,
  formData: FormData,
): Promise<TrackingState> {
  const code = (formData.get("code") as string)?.trim();

  if (!code) {
    return { result: null, error: null, searched: false };
  }

  await connectDB();

  const project = await Project.findOne({
    trackerCode: code,
    isArchived: false,
  }).lean();

  if (!project) {
    return { result: null, error: "Proyek tidak ditemukan", searched: true };
  }

  const milestones = await Milestone.find({ projectId: project._id })
    .sort({ createdAt: 1 })
    .lean();

  return {
    result: {
      project: JSON.parse(JSON.stringify(project)),
      milestones: JSON.parse(JSON.stringify(milestones)),
    },
    error: null,
    searched: true,
  };
}
