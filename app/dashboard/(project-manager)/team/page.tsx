import { connectDB } from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import "@/models/User";
import TeamClient from "./team-client";

async function getMembers() {
  await connectDB();
  const members = await TeamMember.find().populate("userId").lean();
  return JSON.parse(JSON.stringify(members));
}

export default async function Page() {
  const members = await getMembers();
  return <TeamClient initialMembers={members} />;
}
