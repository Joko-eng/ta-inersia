import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  milestoneId: mongoose.Types.ObjectId;
  assignee: mongoose.Types.ObjectId;
  priority: "rendah" | "sedang" | "tinggi";
  status: "todo" | "inprogress" | "done";
  statusUpdatedAt: Date;
  // Bukti pengerjaan (gambar/dokumen) — disimpan di Cloudinary
  attachmentUrl?: string;
  attachmentPublicId?: string;
  // Link referensi tambahan (deploy, Figma, repo, dsb)
  link?: string;
  createdAt: Date;
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
    attachmentUrl: {
      type: String,
      default: null,
    },
    attachmentPublicId: {
      type: String,
      default: null,
    },
    link: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Task ||
  mongoose.model<ITask>("Task", TaskSchema);