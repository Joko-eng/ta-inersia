"use client";

interface DeleteMemberModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteMemberModal({
  open,
  onClose,
  onConfirm,
}: DeleteMemberModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-sm p-6 space-y-4 border dark:border-zinc-800">
        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
          Hapus Tim Pengembang
        </h3>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Yakin ingin menghapus Tim Pengembang?
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400"
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
