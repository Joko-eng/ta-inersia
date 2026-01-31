import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, role } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: "name dan email wajib diisi" },
        { status: 400 },
      );
    }

    const user = await User.create({
      name,
      email,
      role: role || "member",
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 409 },
      );
    }

    console.error(err);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
