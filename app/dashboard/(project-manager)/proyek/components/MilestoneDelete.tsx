"use client";

import { deleteMilestone } from "../[id]/action";

interface MilestoneDeleteModalProps {
  milestoneId: string;
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export default function MilestoneDeleteModal({
  milestoneId,
  projectId,
  onClose,
  onSuccess,
  onError,
}: MilestoneDeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-sm p-6 space-y-4 border dark:border-zinc-800">
        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
          Hapus Milestone
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Yakin ingin menghapus milestone ini?
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400"
          >
            Batal
          </button>

          <form
            action={async () => {
              const result = await deleteMilestone(milestoneId, projectId);
              if (result?.error) {
                onError(result.error);
                return;
              }
              onSuccess();
            }}
          >
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Hapus
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
