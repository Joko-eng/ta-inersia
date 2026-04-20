"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { archiveProject } from "../actions";

type Project = {
  _id: string;
  name: string;
  createdAt: string;
};

export default function ProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null);

  return (
    <div className="flex-1 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Daftar Proyek</h1>
        <Link
          href="/kelola-proyek/arsip"
          className="px-4 py-2 text-xs font-semibold rounded-md bg-primary dark:bg-white text-primary-foreground shadow-sm hover:shadow hover:opacity-90 transition"
        >
          Lihat Proyek Diarsipkan
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm">
        <div className="grid grid-cols-12 px-8 py-4 text-sm font-semibold border-b bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300">
          <div className="col-span-5">Nama Proyek</div>
          <div className="col-span-3">Tanggal Dibuat</div>
          <div className="col-span-4 text-right pr-2">Aksi</div>
        </div>

        {projects.map((p) => (
          <div
            key={p._id}
            className="grid grid-cols-12 items-center px-8 py-5 text-sm border-b last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition"
          >
            <div className="col-span-5 font-medium text-zinc-800 dark:text-zinc-100">
              {p.name}
            </div>
            <div className="col-span-3 text-zinc-500 dark:text-zinc-400">
              {new Date(p.createdAt).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="col-span-4 flex justify-end gap-3">
              <Link
                href={`/proyek/${p._id}`}
                className="px-4 py-1.5 text-xs font-semibold rounded-md bg-primary dark:bg-white text-primary-foreground hover:opacity-90 transition"
              >
                Detail
              </Link>
              <button
                onClick={() => setArchiveTarget(p._id)}
                className="px-4 py-1.5 text-xs font-semibold rounded-md border border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
              >
                Arsipkan
              </button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="px-8 py-10 text-center text-sm text-zinc-500">
            Belum ada proyek.
          </div>
        )}
      </div>

      {archiveTarget && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-sm p-6 space-y-4 border dark:border-zinc-800">
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
              Arsipkan Proyek
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Yakin ingin mengarsipkan proyek ini?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setArchiveTarget(null)}
                className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400"
              >
                Batal
              </button>
              <form
                action={async () => {
                  await archiveProject(archiveTarget);
                  setArchiveTarget(null);
                  router.refresh();
                }}
              >
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-700 text-white text-sm rounded-lg hover:bg-zinc-800 transition"
                >
                  Arsipkan
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
