"use client";

import { useState } from "react";
import { deleteLead, LeadData } from "./leadAction";

interface DeleteModalProps {
  lead:      LeadData;
  onClose:   () => void;
  onDeleted: () => void;
}

export default function DeleteModal({ lead, onClose, onDeleted }: DeleteModalProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteLead(lead.id);
    setDeleting(false);
    onDeleted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-xs bg-white dark:bg-zinc-900 sm:rounded-2xl rounded-t-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
        <div className="sm:hidden flex justify-center pt-3 pb-0">
          <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>

        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-[15px] font-semibold text-zinc-900 dark:text-white tracking-tight">Hapus Data</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-[12px] text-zinc-400 dark:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            x
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-medium text-zinc-800 dark:text-zinc-100">
              Yakin ingin menghapus?
            </p>
            <p className="text-[13px] text-zinc-400 dark:text-zinc-600 leading-relaxed">
              Data{" "}
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">{lead.nama}</span>{" "}
              akan dihapus permanen dan tidak bisa dikembalikan.
            </p>
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