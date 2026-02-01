import mongoose, { Document, Schema } from "mongoose";

export interface IMilestone extends Document {
  name: string;
  projectId: mongoose.Types.ObjectId;
  dueDate?: Date | null;
  status: "menunggu" | "sedang_dikerjakan" | "selesai";
  completedAt?: Date | null;
}

const MilestoneSchema = new Schema<IMilestone>(
  {
    name: { type: String, required: true },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    dueDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ["menunggu", "sedang_dikerjakan", "selesai"],
      default: "menunggu",
    },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export default mongoose.models.Milestone ||
  mongoose.model<IMilestone>("Milestone", MilestoneSchema);
