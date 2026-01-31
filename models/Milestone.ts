import mongoose, { Document, Model, Schema } from "mongoose";

export type MilestoneStatus = "menunggu" | "sedang_dikerjakan" | "selesai";

export interface IMilestone extends Document {
  name: string;
  dueDate: Date;
  status: MilestoneStatus;
  projectId: mongoose.Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema<IMilestone>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["menunggu", "sedang_dikerjakan", "selesai"],
      default: "menunggu",
      required: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  },
);

// index untuk urutan milestone per project
MilestoneSchema.index({ projectId: 1, order: 1 });

const Milestone: Model<IMilestone> =
  mongoose.models.Milestone ||
  mongoose.model<IMilestone>("Milestone", MilestoneSchema);

export default Milestone;
