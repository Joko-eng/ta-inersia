import mongoose, { Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  trackerCode: string;
  projectManagerId: mongoose.Types.ObjectId;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
