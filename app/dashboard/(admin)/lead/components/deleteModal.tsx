"use client";

import { BottomSheetHandle, ModalOverlay } from "@/components/ui/props";
import { LeadData } from "@/types/ILead";
import { useState } from "react";
import { deleteLead } from "../leadAction";

interface DeleteModalProps {
  lead: LeadData;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteModal({
  lead,
  onClose,
  onDeleted,
}: DeleteModalProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    const result = await deleteLead(lead.id);

    if (!result.ok) {
      setError(result.error ?? "Terjadi kesalahan.");
      setDeleting(false);
      return;
    }

    onDeleted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <ModalOverlay onClick={onClose} />

      <div className="relative w-full sm:max-w-sm bg-white dark:bg-zinc-900 sm:rounded-2xl rounded-t-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
        <BottomSheetHandle />

        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Hapus Data
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Tindakan ini tidak dapat dibatalkan
          </p>
        </div>

        <div className="px-6 py-5 flex flex-col gap-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Data{" "}
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {lead.nama}
            </span>{" "}
            akan dihapus permanen dan tidak bisa dikembalikan.
          </p>

          {error && (
            <p className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            disabled={deleting}
            className="h-9 px-5 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="h-9 px-5 text-sm font-semibold rounded-lg bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {deleting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
