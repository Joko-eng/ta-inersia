"use client";

interface TaskDeleteModalProps {
  taskId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TaskDeleteModal({
  taskId,
  onClose,
  onSuccess,
}: TaskDeleteModalProps) {
  const handleDelete = async () => {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId }),
    });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-sm p-6 space-y-4 border dark:border-zinc-800">
        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
          Hapus Task
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Apakah kamu yakin ingin menghapus task ini?
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded text-sm"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
