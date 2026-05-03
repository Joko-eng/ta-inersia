"use client";

import { useState } from "react";
import { LeadData } from "@/types/ILead";
import { deleteLead } from "./leadAction";
import {
  BottomSheetHandle,
  ModalHeader,
  ModalOverlay,
} from "./components/props";

interface DeleteModalProps {
  lead:      LeadData;
  onClose:   () => void;
  onDeleted: () => void;
}

export default function DeleteModal({ lead, onClose, onDeleted }: DeleteModalProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState<string | null>(null);

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

      <div className="relative w-full sm:max-w-xs bg-white dark:bg-zinc-900 sm:rounded-2xl rounded-t-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
        <BottomSheetHandle />

        <ModalHeader title="Hapus Data" onClose={onClose} />

        <div className="px-6 py-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-medium text-zinc-800 dark:text-zinc-100">
              Yakin ingin menghapus?
            </p>
            <p className="text-[13px] text-zinc-400 dark:text-zinc-600 leading-relaxed">
              Data{" "}
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                {lead.nama}
              </span>{" "}
              akan dihapus permanen dan tidak bisa dikembalikan.
            </p>

            {error && (
              <p className="text-[12px] text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 h-10 rounded-lg text-[13px] font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 h-10 rounded-lg text-[13px] font-semibold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {deleting ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}