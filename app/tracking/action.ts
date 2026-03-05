"use server";

import { connectDB } from "@/lib/mongodb";
import Milestone from "@/models/Milestone";
import Project from "@/models/Project";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TrackResult } from "./Types";

export async function submitTrackingCode(formData: FormData) {
  const code = (formData.get("code") as string)?.trim();
  if (!code) return;

  const cookieStore = await cookies();
  cookieStore.set("tracking_code", code, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/tracking");
}

export async function getTrackingCodeFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("tracking_code")?.value ?? null;
}

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
