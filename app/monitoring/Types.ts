export type MilestoneStatus = "menunggu" | "sedang_dikerjakan" | "selesai";

export interface IMilestone {
  _id: string;
  name: string;
  description?: string;
  dueDate?: string | null;
  status: MilestoneStatus;
  completedAt?: string | null;
}

export interface IProject {
  _id: string;
  name: string;
  trackerCode: string;
  isArchived: boolean;
  createdAt: string;
}

export interface TrackResult {
  project: IProject;
  milestones: IMilestone[];
}
