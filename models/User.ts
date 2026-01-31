import { Schema, model, models } from "mongoose";

export interface IUser {
  name: string;
  email: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
