import mongoose, { Document } from "mongoose";

export interface IMilestone extends Document {
  name: string;
  description?: string;
  projectId: mongoose.Types.ObjectId;
  dueDate?: Date | null;
  status: "menunggu" | "sedang_dikerjakan" | "selesai";
  completedAt?: Date | null;
}
