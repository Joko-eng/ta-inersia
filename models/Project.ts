import { IProject } from "@/types/IProject";
import mongoose, { Model, Schema } from "mongoose";

const ProjectSchema = new Schema<IProject>(
  {
    name:             { type: String, required: true, trim: true },
    trackerCode:      { type: String, required: true, uppercase: true, trim: true },
    projectManagerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clientName:       { type: String, required: true, trim: true },
    clientBusiness:   { type: String, required: true, trim: true },
    isArchived:       { type: Boolean, default: false },
  },
  { timestamps: true },
);

ProjectSchema.index({ trackerCode: 1 }, { unique: true });

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;