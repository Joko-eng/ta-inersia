"use client";

import { ProjectData } from "@/types/IProject";
import { PencilLine, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import CreateProjectModal from "./createModal";
import DeleteProjectModal from "./deleteModal";
import EditProjectModal from "./editModal";

const TABLE_COLUMNS = [
  { label: "No", align: "text-center", w: "w-10" },
  { label: "Nama Project", align: "text-left", w: "w-50" },
  { label: "Tracker Code", align: "text-left", w: "w-44" },
  { label: "Project Manager", align: "text-left", w: "w-56" },
  { label: "Klien", align: "text-left", w: "w-52" },
  { label: "Dibuat", align: "text-left", w: "w-36" },
  { label: "Aksi", align: "text-center", w: "w-36" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function ActionButtons({
  onEdit,
  onDelete,
  compact = false,
}: {
  onEdit: () => void;
  onDelete: () => void;
  compact?: boolean;
}) {
  return (
    <div className={`flex gap-2 ${compact ? "items-center justify-end" : ""}`}>
      <button
        onClick={onEdit}
        className={`${compact ? "h-8 px-4" : "flex-1 h-9"} flex items-center justify-center gap-1.5 text-sm font-medium rounded-lg border border-zinc-300 dark:bg-white dark:border-zinc-600 text-zinc-700 dark:text-black hover:bg-zinc-50 transition-colors`}
      >
        <PencilLine size={13} /> Edit
      </button>
      <button
        onClick={onDelete}
        className={`${compact ? "h-8 px-2" : "flex-1 h-9"} flex items-center justify-center gap-1.5 text-sm font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors`}
      >
        <Trash size={13} /> Hapus
      </button>
    </div>
  );
}

function MobileCard({
  item,
  index,
  onEdit,
  onDelete,
}: {
  item: ProjectData;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-3">
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-sm text-zinc-400 dark:text-zinc-600">
          #{index}
        </span>
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
          {item.name}
        </p>
        <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400">
          {item.trackerCode}
        </p>
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium text-zinc-400 dark:text-zinc-600">
          Project Manager
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {item.projectManagerName}
        </p>
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium text-zinc-400 dark:text-zinc-600">
          Klien
        </p>
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 truncate">
          {item.clientBusiness}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
          {item.clientName}
        </p>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-500">
        {formatDate(item.createdAt)}
      </p>

      <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800">
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}

function EmptyState({ colSpan }: { colSpan?: number }) {
  const text = (
    <p className="text-sm text-zinc-400 dark:text-zinc-600">
      Belum ada project.
    </p>
  );
  if (colSpan) {
    return (
      <tr>
        <td colSpan={colSpan} className="py-16 text-center">
          {text}
        </td>
      </tr>
    );
  }
  return <div className="flex-1 flex items-center justify-center">{text}</div>;
}

export default function ProjectTable({
  initialProjects,
}: {
  initialProjects: ProjectData[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<ProjectData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectData | null>(null);

  const refresh = useCallback(
    () => startTransition(() => router.refresh()),
    [router],
  );

  return (
    <div
      className={`flex flex-col h-full min-h-0 gap-4 transition-opacity duration-200 ${
        isPending ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            refresh();
          }}
        />
      )}

      {editTarget && (
        <EditProjectModal
          project={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => {
            setEditTarget(null);
            refresh();
          }}
        />
      )}

      {deleteTarget && (
        <DeleteProjectModal
          project={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSaved={() => {
            setDeleteTarget(null);
            refresh();
          }}
        />
      )}

      <div className="flex items-center justify-between gap-3 shrink-0">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {initialProjects.length} Total Project
        </span>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center justify-center gap-2 h-9 px-5 text-sm font-semibold rounded-lg bg-primary dark:bg-white dark:text-black hover:bg-blue-700 text-white transition-colors"
        >
          <Plus size={16} />
          Project
        </button>
      </div>

      <div className="lg:hidden flex-1 min-h-0 flex flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 flex flex-col gap-3 bg-zinc-50 dark:bg-zinc-950">
          {initialProjects.length === 0 ? (
            <EmptyState />
          ) : (
            initialProjects.map((item, idx) => (
              <MobileCard
                key={item.id}
                item={item}
                index={idx + 1}
                onEdit={() => setEditTarget(item)}
                onDelete={() => setDeleteTarget(item)}
              />
            ))
          )}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 min-h-0 flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
        <div className="flex-1 min-h-0 overflow-auto">
          <table
            className="border-collapse w-full"
            style={{ minWidth: "900px" }}
          >
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60">
                {TABLE_COLUMNS.map(({ label, align, w }) => (
                  <th
                    key={label}
                    className={`py-3.5 px-5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 ${align} ${w}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {initialProjects.length === 0 ? (
                <EmptyState colSpan={TABLE_COLUMNS.length} />
              ) : (
                initialProjects.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors duration-75"
                  >
                    <td className="py-4 px-5 text-center text-sm text-zinc-500 dark:text-zinc-500 tabular-nums">
                      {idx + 1}
                    </td>

                    <td className="py-4 px-5 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                      {item.name}
                    </td>

                    <td className="py-4 px-5 text-sm text-zinc-600 dark:text-zinc-400 tracking-tight">
                      {item.trackerCode}
                    </td>

                    <td className="py-4 px-5 text-sm text-zinc-600 dark:text-zinc-400">
                      {item.projectManagerName}
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 truncate max-w-[180px]">
                          {item.clientBusiness}
                        </span>
                        <span className="text-sm text-zinc-500 dark:text-zinc-500 truncate max-w-[180px]">
                          {item.clientName}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-5 text-sm text-zinc-600 dark:text-zinc-400 tabular-nums">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="py-4 px-5">
                      <ActionButtons
                        compact
                        onEdit={() => setEditTarget(item)}
                        onDelete={() => setDeleteTarget(item)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
