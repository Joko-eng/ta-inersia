"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ArchiveButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleArchive() {
    if (!confirm("Arsipkan proyek ini?")) return;
    setLoading(true);

    const res = await fetch(`/api/projects/archive/${projectId}`, {
      method: "PATCH",
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Gagal mengarsipkan proyek.");
    }

    setLoading(false);
  }

  return (
    <button
      onClick={handleArchive}
      disabled={loading}
      className="px-4 py-1.5 text-xs font-semibold rounded-md border border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition disabled:opacity-50"
    >
      {loading ? "..." : "Arsipkan"}
    </button>
  );
}
