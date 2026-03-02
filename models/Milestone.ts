import { IMilestone } from "@/types/IMilestone";
import mongoose, { Schema } from "mongoose";

const MilestoneSchema = new Schema<IMilestone>(
  {
    name: { type: String, required: true },
    description: {
      type: String,
      default: "",
      trim: true,
    },
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
