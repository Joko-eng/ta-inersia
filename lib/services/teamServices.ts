import { connectDB } from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import User from "@/models/User";
import type { TeamMemberInput } from "@/validators/teamValidator";

export async function addTeamMember(data: TeamMemberInput) {
  const { name, email, username, division } = data;

  await connectDB();

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      username,
      role: "member",
    });
  }

  const exist = await TeamMember.findOne({ userId: user._id });
  if (exist) {
    throw new Error("User sudah ada di tim");
  }

  await TeamMember.create({
    userId: user._id,
    division,
  });
}

export async function deleteTeamMember(id: string) {
  await connectDB();

  const team = await TeamMember.findById(id);
  if (!team) return;

  await User.findByIdAndDelete(team.userId);
  await TeamMember.findByIdAndDelete(id);
}
