import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Link from "next/link";
import RestoreButton from "../components/RestoreButton";

export default async function ArsipPage() {
  await connectDB();

  const projects = await Project.find({ isArchived: true }).lean();

  return (
    <div className="flex-1 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Proyek Diarsipkan</h1>
        <Link
          href="/kelola-proyek"
          className="px-4 py-2 text-xs font-semibold rounded-md bg-primary text-primary-foreground shadow-sm hover:shadow hover:opacity-90 transition"
        >
          Kembali ke Daftar Proyek
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm">
        <div className="grid grid-cols-12 px-8 py-4 text-sm font-semibold border-b bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300">
          <div className="col-span-5">Nama Proyek</div>
          <div className="col-span-3">Tanggal Dibuat</div>
          <div className="col-span-4 text-right pr-2">Aksi</div>
        </div>

        {projects.map((p: any) => (
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
              <RestoreButton projectId={p._id.toString()} />
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="px-8 py-10 text-center text-sm text-zinc-500">
            Tidak ada proyek yang diarsipkan.
          </div>
        )}
      </div>
    </div>
  );
}
