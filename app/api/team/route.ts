import { connectDB } from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { name, email, username, division } = await req.json();

  if (!name || !email || !username || !division) {
    return NextResponse.json({ error: "field kosong" }, { status: 400 });
  }

  // cari user
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      username,
      role: "member",
    });
  }

  // cegah dobel team
  const exist = await TeamMember.findOne({ userId: user._id });
  if (exist) {
    return NextResponse.json(
      { error: "User sudah ada di tim" },
      { status: 400 },
    );
  }

  const team = await TeamMember.create({
    userId: user._id,
    division,
  });

  return NextResponse.json(team);
}

export async function GET() {
  await connectDB();

  const members = await TeamMember.find().populate("userId");

  return NextResponse.json(members);
}

export async function DELETE(req: Request) {
  await connectDB();

  const { id } = await req.json(); // ini TeamMember _id

  const team = await TeamMember.findById(id);

  if (!team) {
    return NextResponse.json(
      { error: "data tidak ditemukan" },
      { status: 404 },
    );
  }

  // hapus akun user
  await User.findByIdAndDelete(team.userId);

  // hapus team member
  await TeamMember.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
