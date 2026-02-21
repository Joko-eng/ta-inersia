import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  milestoneId: mongoose.Types.ObjectId;
  assignee: mongoose.Types.ObjectId;
  priority: "rendah" | "sedang" | "tinggi";
  status: "todo" | "inprogress" | "done";
  statusUpdatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    milestoneId: {
      type: Schema.Types.ObjectId,
      ref: "Milestone",
      required: true,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "TeamMember",
      default: null,
    },

    priority: {
      type: String,
      enum: ["rendah", "sedang", "tinggi"],
      default: "sedang",
    },
    status: {
      type: String,
      enum: ["todo", "inprogress", "done"],
      default: "todo",
    },
    statusUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Task ||
  mongoose.model<ITask>("Task", TaskSchema);
