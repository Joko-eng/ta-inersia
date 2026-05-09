"use client";

import { Trash } from "lucide-react";

interface MemberActionButtonsProps {
  compact?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MemberActionButtons({
  compact = false,
  onEdit,
  onDelete,
}: MemberActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* <button
      
        onClick={onEdit}
        className={`${
          compact ? "h-8 px-4" : "flex-1 h-9"
        } flex items-center justify-center gap-1.5 text-sm font-medium rounded-lg border border-zinc-300 dark:bg-white dark:border-zinc-600 text-zinc-700 dark:text-black hover:bg-zinc-50 transition-colors`}
      >
        <PencilLine size={13} />
        Edit
      </button> */}

      <button
        onClick={onDelete}
        className={`${
          compact ? "h-8 px-2" : "flex-1 h-9"
        } flex items-center justify-center gap-1.5 text-sm font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors`}
      >
        <Trash size={13} />
        Hapus
      </button>
    </div>
  );
}
