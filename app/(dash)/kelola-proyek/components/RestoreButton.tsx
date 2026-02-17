"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RestoreButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRestore() {
    if (!confirm("Pulihkan proyek ini dari arsip?")) return;
    setLoading(true);

    const res = await fetch(`/api/projects/archive/${projectId}`, {
      method: "PATCH",
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Gagal memulihkan proyek.");
    }

    setLoading(false);
  }

  return (
    <button
      onClick={handleRestore}
      disabled={loading}
      className="px-4 py-1.5 text-xs font-semibold rounded-md border border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30 transition disabled:opacity-50"
    >
      {loading ? "..." : "Pulihkan"}
    </button>
  );
}
