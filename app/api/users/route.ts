import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  await User.create({
    name: "test",
    email: "test@mail.com",
  });

  return NextResponse.json({ ok: true });
}
