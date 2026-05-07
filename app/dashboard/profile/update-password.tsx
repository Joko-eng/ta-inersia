"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updatePassword } from "./action";

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

  const inputClass =
    "w-full border dark:border-zinc-700 rounded-lg px-3 py-2 pr-10 text-sm bg-white dark:bg-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-white/20 transition placeholder:text-muted-foreground [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden";

  const fields = [
    {
      name: "currentPassword",
      label: "Password Saat Ini",
      placeholder: "Masukkan password saat ini",
      show: showCurrent,
      toggle: () => setShowCurrent(!showCurrent),
    },
    {
      name: "newPassword",
      label: "Password Baru",
      placeholder: "Minimal 6 karakter",
      show: showNew,
      toggle: () => setShowNew(!showNew),
    },
    {
      name: "confirmPassword",
      label: "Konfirmasi Password Baru",
      placeholder: "Ulangi password baru",
      show: showConfirm,
      toggle: () => setShowConfirm(!showConfirm),
    },
  ];

  return (
    <div className="bg-white dark:bg-muted rounded-xl border dark:border-zinc-700 shadow-sm p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-white/10">
          <Lock size={15} className="text-primary dark:text-white" />
        </div>
        <h2 className="text-sm font-medium">Ubah Password</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-5 ml-0.5">
        Pastikan password baru minimal 6 karakter
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              {field.label}
            </label>
            <div className="relative">
              <input
                name={field.name}
                type={field.show ? "text" : "password"}
                required
                placeholder={field.placeholder}
                className={inputClass}
              />
              <button
                type="button"
                onClick={field.toggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              >
                {field.show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-primary dark:bg-white text-primary-foreground dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-primary/90 dark:hover:bg-zinc-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Menyimpan...
              </span>
            ) : (
              "Simpan Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
