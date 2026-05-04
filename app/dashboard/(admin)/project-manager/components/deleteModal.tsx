"use client";

import { useState } from "react";
import { deleteProjectManager } from "../projectManagerAction";
import { ProjectManagerData } from "@/types/IProjectManager";
import {
  BottomSheetHandle,
  ModalHeader,
  ModalOverlay,
} from "@/components/ui/props";

interface Props {
  manager: ProjectManagerData;
  onClose: () => void;
  onSaved: () => void;
}

export default function DeleteProjectManagerModal({ manager, onClose, onSaved }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    setError(null);

    const result = await deleteProjectManager(manager.id);

    if (!result.ok) {
      setError(result.error ?? "Gagal menghapus project manager.");
      setDeleting(false);
      return;
    }

    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <ModalOverlay onClick={onClose} />

      <div className="relative w-full sm:max-w-sm bg-white dark:bg-zinc-900 sm:rounded-2xl rounded-t-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        <BottomSheetHandle />
        <ModalHeader title="Hapus Project Manager" onClose={onClose} />

        <div className="px-6 py-5 flex flex-col gap-3">
          {error && (
            <p className="text-[12px] text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <p className="text-[13px] text-zinc-600 dark:text-zinc-400">
            Yakin ingin menghapus project manager ini? Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex flex-col gap-1">
            <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-100">{manager.name}</p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{manager.email}</p>
            <p className="text-[11px] font-mono text-zinc-300 dark:text-zinc-700">@{manager.username}</p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="h-9 px-5 text-[13px] font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="h-9 px-5 text-[13px] font-semibold rounded-lg bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {deleting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}