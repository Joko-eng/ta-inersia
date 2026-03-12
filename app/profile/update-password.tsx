"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updatePassword } from "./action";
import { Eye, EyeOff, Lock } from "lucide-react";

export function UpdatePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updatePassword(formData);

    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Password berhasil diperbarui");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="bg-white dark:bg-muted rounded-xl border shadow-sm p-6">
      <div className="flex items-center gap-2 mb-1">
        <Lock size={16} className="text-violet-600" />
        <h2 className="text-sm font-medium">Ubah Password</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-6">
        Pastikan password baru minimal 6 karakter
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Password Saat Ini */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Password Saat Ini
          </label>
          <div className="relative">
            <input
              name="currentPassword"
              type={showCurrent ? "text" : "password"}
              required
              placeholder="Masukkan password saat ini"
              className="w-full border rounded-lg px-3 py-2 pr-10 text-sm dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-100"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-2.5 text-muted-foreground"
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Password Baru */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Password Baru
          </label>
          <div className="relative">
            <input
              name="newPassword"
              type={showNew ? "text" : "password"}
              required
              placeholder="Masukkan password baru"
              className="w-full border rounded-lg px-3 py-2 pr-10 text-sm dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-100"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-2.5 text-muted-foreground"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Konfirmasi Password */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Konfirmasi Password Baru
          </label>
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              required
              placeholder="Ulangi password baru"
              className="w-full border rounded-lg px-3 py-2 pr-10 text-sm dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-100"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2.5 text-muted-foreground"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Password"}
          </button>
        </div>
      </form>
    </div>
  );
}