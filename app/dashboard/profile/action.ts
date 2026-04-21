"use server";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";

export async function updatePassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Tidak terautentikasi" };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Semua field wajib diisi" };
  }

  if (newPassword.length < 6) {
    return { error: "Password baru minimal 6 karakter" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Konfirmasi password tidak cocok" };
  }

  await connectDB();

  const user = await User.findById((session.user as any).id);
  if (!user) return { error: "User tidak ditemukan" };

  const isValid = await user.comparePassword(currentPassword);
  if (!isValid) return { error: "Password saat ini salah" };

  user.password = newPassword;
  await user.save();

  return { success: true };
}
