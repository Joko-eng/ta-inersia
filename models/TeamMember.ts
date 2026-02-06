import mongoose, { Document, model, models, Schema } from "mongoose";

export interface ITeamMember extends Document {
  userId: mongoose.Types.ObjectId;
  division: string;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },

    division: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default models.TeamMember ||
  model<ITeamMember>("TeamMember", TeamMemberSchema);
