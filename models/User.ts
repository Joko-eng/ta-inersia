import { Document, Schema, model, models } from "mongoose";

export type UserRole = "admin" | "project_manager" | "member";

export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  role: UserRole;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["admin", "project_manager", "member"],
      default: "member",
      required: true,
    },
  },
  { timestamps: true },
);

export default models.User || model<IUser>("User", UserSchema);
