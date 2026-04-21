import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UpdatePasswordForm } from "./update-password";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-2">Profil Saya</h1>
      <p className="text-muted-foreground mb-8">Kelola informasi akun kamu</p>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-muted rounded-xl border shadow-sm p-6 mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">
            Informasi Akun
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b dark:border-zinc-700">
              <span className="text-sm text-muted-foreground">Nama</span>
              <span className="text-sm font-medium">{session.user.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b dark:border-zinc-700">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{session.user.email}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Role</span>
              <span className="text-sm font-medium capitalize">
                {(session.user as any).role?.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        <UpdatePasswordForm />
      </div>
    </div>
  );
}
