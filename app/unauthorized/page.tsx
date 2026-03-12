"use client";

import { Home, Lock, LogIn } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white px-4">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(79, 70, 229, 0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(79,70,229,0.04) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="pointer-events-none absolute -top-20 -right-16 h-80 w-80 rounded-full bg-primary opacity-[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-52 w-52 rounded-full bg-violet-600 opacity-[0.06] blur-3xl" />

      <div className="relative w-full max-w-md rounded-2xl border border-primary bg-white p-10 text-center shadow-[0_20px_60px_rgba(79,70,229,0.08)]">
        <div className="mx-auto mb-6 flex h-18 w-18 items-center justify-center rounded-full bg-violet-50 ring-1 ring-violet-200">
          <Lock className="h-7 w-7 text-violet-600" />
        </div>

        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-red-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          Akses Ditolak
        </span>

        <h1 className="mb-2 font-serif text-2xl font-semibold text-gray-900">
          Halaman ini <em className="italic text-primary">terbatas</em>
        </h1>
        <p className="mx-auto mb-8 max-w-xs text-sm leading-relaxed text-gray-500">
          Kamu tidak memiliki izin untuk mengakses halaman ini. Silakan masuk
          dengan akun yang sesuai atau kembali ke beranda.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition hover:bg-primary active:scale-[0.98]"
          >
            <LogIn size={15} />
            Masuk ke Akun
          </Link>

          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span className="flex-1 border-t border-gray-100" />
            atau
            <span className="flex-1 border-t border-gray-100" />
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-600 transition hover:bg-gray-50 active:scale-[0.98]"
          >
            <Home size={15} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      <p className="mt-5 text-xs text-gray-400">
        Butuh bantuan?{" "}
        <a href="#" className="text-primary hover:underline">
          Hubungi tim support
        </a>
      </p>
    </div>
  );
}
