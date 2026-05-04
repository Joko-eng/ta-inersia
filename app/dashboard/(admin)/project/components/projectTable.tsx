"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { ProjectData } from "@/types/IProject";
import CreateProjectModal from "./createModal";
import EditProjectModal from "./editModal";
import DeleteProjectModal from "./deleteModal";

const TABLE_COLUMNS = [
  { label: "No", align: "text-center", w: "w-12" },
  { label: "Nama Project", align: "text-left", w: "w-auto" },
  { label: "Tracker Code", align: "text-left", w: "w-44" },
  { label: "Project Manager", align: "text-left", w: "w-56" },
  { label: "Klien", align: "text-left", w: "w-52" },
  { label: "Dibuat", align: "text-center", w: "w-32" },
  { label: "Aksi", align: "text-center", w: "w-32" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
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
  const size = compact ? 11 : 11;
  const h = compact ? "h-7" : "h-8";
  const px = compact ? "px-3" : "";

  return (
    <div
      className={`flex gap-2 ${compact ? "items-center justify-center" : ""}`}
    >
      <button
        onClick={onEdit}
        className={`${compact ? h : "flex-1 " + h} ${px} flex items-center justify-center gap-1.5 text-[11px] font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 ${compact ? "hover:border-zinc-300 dark:hover:border-zinc-600" : ""} transition-colors`}
      >
        <Pencil size={size} /> Edit
      </button>
      <button
        onClick={onDelete}
        className={`${compact ? h : "flex-1 " + h} ${px} flex items-center justify-center gap-1.5 text-[11px] font-medium rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-colors`}
      >
        <Trash2 size={size} /> Hapus
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
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 p-4 flex flex-col gap-3">
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[10px] text-zinc-300 dark:text-zinc-700 tabular-nums">
          #{index}
        </span>
        <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-100 truncate">
          {item.name}
        </p>
        <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
          {item.trackerCode}
        </p>
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-300 dark:text-zinc-700">
          PM
        </p>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="font-mono text-zinc-300 dark:text-zinc-700 mr-1">
            {item.projectManagerId.slice(-6).toUpperCase()}
          </span>
          {item.projectManagerName}
        </p>
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-300 dark:text-zinc-700">
          Klien
        </p>
        <p className="text-[12px] font-medium text-zinc-700 dark:text-zinc-300 truncate">
          {item.clientBusiness}
        </p>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
          {item.clientName}
        </p>
      </div>

      <p className="text-[11px] text-zinc-300 dark:text-zinc-700">
        {formatDate(item.createdAt)}
      </p>

      <div className="pt-1 border-t border-zinc-50 dark:border-zinc-800">
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}

function EmptyState({ colSpan }: { colSpan?: number }) {
  const text = (
    <p className="text-[13px] text-zinc-300 dark:text-zinc-700">
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
        <span className="text-[12px] text-zinc-400 dark:text-zinc-600">
          {initialProjects.length} project
        </span>
        <button
          onClick={() => setShowCreate(true)}
          className="h-9 px-5 text-[12px] font-semibold rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors"
        >
          Buat Project
        </button>
      </div>

      <div className="lg:hidden flex-1 min-h-0 flex flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 flex flex-col gap-3 bg-[#F5F5F3] dark:bg-[#111111]">
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
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#F5F5F3] dark:bg-zinc-800/80 border-b border-zinc-100 dark:border-zinc-800">
                {TABLE_COLUMNS.map(({ label, align, w }) => (
                  <th
                    key={label}
                    className={`py-3 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-600 ${align} ${w}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/60">
              {initialProjects.length === 0 ? (
                <EmptyState colSpan={TABLE_COLUMNS.length} />
              ) : (
                initialProjects.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors duration-75"
                  >
                    <td className="py-4 px-4 text-center text-[12px] text-zinc-300 dark:text-zinc-700 tabular-nums">
                      {idx + 1}
                    </td>

                    <td className="py-4 px-4 text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
                      {item.name}
                    </td>

                    <td className="py-4 px-4 text-[12px] font-mono text-zinc-400 dark:text-zinc-500 tracking-tight">
                      {item.trackerCode}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-mono text-zinc-300 dark:text-zinc-700 tracking-tight">
                          ID: {item.projectManagerId.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-[12px] text-zinc-600 dark:text-zinc-300">
                          {item.projectManagerName}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[12px] font-medium text-zinc-700 dark:text-zinc-200 truncate max-w-[180px]">
                          {item.clientBusiness}
                        </span>
                        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate max-w-[180px]">
                          {item.clientName}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center text-[12px] text-zinc-400 dark:text-zinc-600 tabular-nums">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="py-4 px-4">
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
