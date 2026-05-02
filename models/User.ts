import bcrypt from "bcryptjs";
import { Document, Schema, model, models } from "mongoose";

export type UserRole = "admin" | "project_manager" | "member";

export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  password: string;
  role: UserRole;
  comparePassword(candidate: string): Promise<boolean>;
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
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: false },
    role: {
      type: String,
      enum: ["admin", "project_manager", "member"],
      default: "member",
      required: true,
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  if (!this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default models.User || model<IUser>("User", UserSchema);
