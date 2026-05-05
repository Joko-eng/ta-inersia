"use client";

import { Milestone, formatTanggalID } from "@/types/IMilestone";
import {
  AlignLeft,
  Calendar,
  ListChecks,
  NotepadText,
  PencilLine,
  Tag,
  Trash,
} from "lucide-react";

interface MilestoneTableProps {
  milestones: Milestone[];
  onEdit: (milestone: Milestone) => void;
  onDelete: (id: string) => void;
}

export default function MilestoneTable({
  milestones,
  onEdit,
  onDelete,
}: MilestoneTableProps) {
  return (
    <div className="bg-white dark:bg-muted rounded-xl border shadow-sm overflow-hidden">
      <div className="grid grid-cols-5 px-8 py-3 text-sm text-foreground border-b">
        <div className="flex items-center gap-2">
          <AlignLeft size={16} /> <span>Milestone</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} /> <span>Tanggal</span>
        </div>
        <div className="flex items-center gap-2">
          <NotepadText size={16} /> <span>Deskripsi</span>
        </div>
        <div className="flex items-center gap-2">
          <ListChecks size={16} /> <span>Status</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag size={16} /> <span>Aksi</span>
        </div>
      </div>

      {milestones.map((item) => {
        const status =
          item.status === "selesai"
            ? "Selesai"
            : item.status === "menunggu"
              ? "Menunggu"
              : "Sedang Dikerjakan";

        const statusStyle =
          item.status === "selesai"
            ? "bg-green-100 text-green-700"
            : item.status === "menunggu"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700";

        return (
          <div
            key={item.id}
            className="grid grid-cols-5 items-center px-8 py-4 border-b last:border-b-0 text-sm"
          >
            <div className="font-medium pr-4">{item.title}</div>
            <div className="text-muted-foreground">
              {item.deadline ? formatTanggalID(item.deadline) : "-"}
            </div>
            <div className="font-medium pr-2">{item.description}</div>
            <div>
              <span
                className={`inline-flex rounded-md px-3 py-1 text-xs font-medium ${statusStyle}`}
              >
                {status}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(item)}
                className="text-blue-500 text-xs"
              >
                <PencilLine size={16} />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="text-red-500 text-xs"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
