"use server";

import { connectDB } from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const teamSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  division: z.enum(["Front End", "Back End", "QA", "UI/UX"]),
});

export async function addMember(data: unknown) {
  const parsed = teamSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, username, division } = parsed.data;

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
    return { error: { email: ["User sudah ada di tim"] } };
  }

  await TeamMember.create({
    userId: user._id,
    division,
  });

  revalidatePath("/team");

  return { success: true };
}

export async function deleteMember(id: string) {
  await connectDB();

  const team = await TeamMember.findById(id);
  if (!team) return;

  await User.findByIdAndDelete(team.userId);
  await TeamMember.findByIdAndDelete(id);

  revalidatePath("/team");
}
