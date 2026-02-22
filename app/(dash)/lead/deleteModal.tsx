"use client";

import { useState } from "react";
import { X, Trash2, Loader2 } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xs bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Hapus Lead</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-5 flex flex-col gap-4">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center">
              <Trash2 size={22} className="text-red-500" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              Apakah kamu yakin?
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Data{" "}
              <span className="font-semibold text-gray-600 dark:text-gray-300">{lead.nama}</span>{" "}
              akan dihapus permanen dan tidak bisa dikembalikan.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 py-2.5 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {deleting ? (
                <><Loader2 size={13} className="animate-spin" /> Menghapus...</>
              ) : (
                <><Trash2 size={13} /> Ya, Hapus</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}