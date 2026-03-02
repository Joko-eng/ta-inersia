"use server";

import { connectDB } from "@/lib/mongodb";
import Milestone from "@/models/Milestone";
import Project from "@/models/Project";
import { TrackResult } from "./types";

export async function getTrackingByCode(
  code: string,
): Promise<TrackResult | null> {
  await connectDB();

  const project = await Project.findOne({
    trackerCode: code,
    isArchived: false,
  }).lean();

  if (!project) return null;

  const milestones = await Milestone.find({
    projectId: project._id,
  })
    .sort({ createdAt: 1 })
    .lean();

  return {
    project: JSON.parse(JSON.stringify(project)),
    milestones: JSON.parse(JSON.stringify(milestones)),
  };
}
