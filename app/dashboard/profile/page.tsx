import { getSession } from "@/lib/auth";
import { Mail, Shield, User } from "lucide-react";
import { redirect } from "next/navigation";
import { UpdatePasswordForm } from "./update-password";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role?.replace("_", " ");

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-1">Profil Saya</h1>
        <p className="text-sm text-muted-foreground">
          Kelola informasi akun kamu
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-muted rounded-xl border dark:border-zinc-700 shadow-sm p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-white/10">
              <User size={15} className="text-primary dark:text-white" />
            </div>
            <h2 className="text-sm font-medium">Informasi Akun</h2>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between py-3 border-b dark:border-zinc-700">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User size={13} />
                <span className="text-xs sm:text-sm">Nama</span>
              </div>
              <span className="text-xs sm:text-sm font-medium truncate max-w-[55%] text-right">
                {session.user.name}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b dark:border-zinc-700">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail size={13} />
                <span className="text-xs sm:text-sm">Email</span>
              </div>
              <span className="text-xs sm:text-sm font-medium truncate max-w-[55%] text-right">
                {session.user.email}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield size={13} />
                <span className="text-xs sm:text-sm">Role</span>
              </div>
              <span className="text-xs font-medium capitalize px-2.5 py-1 rounded-full bg-primary/10 dark:bg-white/10 text-primary dark:text-white">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Update Password Card */}
        <UpdatePasswordForm />
      </div>
    </div>
  );
}