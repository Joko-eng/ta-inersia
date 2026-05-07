"use client";

import { useClickOutside } from "@/components/ui/props";
import { ProjectManagerData } from "@/types/IProjectManager";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PencilLine,
  Plus,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";
import CreateProjectManagerModal from "./createModal";
import DeleteProjectManagerModal from "./deleteModal";
import EditProjectManagerModal from "./editModal";

const PER_PAGE_OPTIONS = [5, 8, 10, 15];

const TABLE_COLUMNS = [
  { label: "No", align: "text-center", w: "w-12" },
  { label: "Nama", align: "text-left", w: "w-auto" },
  { label: "Email", align: "text-left", w: "w-56" },
  { label: "Username", align: "text-left", w: "w-40" },
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
        className={`${compact ? "h-8 px-4" : "flex-1 h-9"} flex items-center justify-center gap-1.5 text-sm font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors`}
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
  item: ProjectManagerData;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-3">
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-xs text-zinc-400 dark:text-zinc-600 tabular-nums">
          #{index}
        </span>
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
          {item.name}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          @{item.username}
        </p>
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
        {item.email}
      </p>

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
      Belum ada project manager.
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

function PerPageDropdown({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-9 px-3.5 flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
      >
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
          Tampilkan
        </span>
        <span className="font-semibold text-zinc-800 dark:text-zinc-100">
          {value}
        </span>
        <ChevronDown
          size={12}
          className={`text-zinc-400 dark:text-zinc-600 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-32 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg z-50 overflow-hidden py-1">
          {PER_PAGE_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                opt === value
                  ? "font-semibold text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-800"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PaginationBar({
  currentPage,
  totalPages,
  pageNumbers,
  filteredCount,
  perPage,
  goTo,
}: {
  currentPage: number;
  totalPages: number;
  pageNumbers: number[];
  filteredCount: number;
  perPage: number;
  goTo: (p: number) => void;
}) {
  const rangeStart = (currentPage - 1) * perPage + 1;
  const rangeEnd = Math.min(currentPage * perPage, filteredCount);

  return (
    <div className="shrink-0 border-t border-zinc-200 dark:border-zinc-800 px-4 sm:px-5 py-3 flex items-center justify-between gap-3 bg-white dark:bg-zinc-900">
      <span className="text-sm text-zinc-500 dark:text-zinc-500 shrink-0">
        {filteredCount === 0
          ? "Tidak ada data"
          : `${rangeStart}–${rangeEnd} dari ${filteredCount}`}
      </span>

      <div className="flex items-center gap-1 flex-wrap justify-end">
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => goTo(page)}
            className={`h-8 min-w-[32px] px-2 rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-primary text-white dark:bg-white dark:text-black border-transparent"
                : "border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function ProjectManagerTable({
  initialManagers,
}: {
  initialManagers: ProjectManagerData[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<ProjectManagerData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectManagerData | null>(
    null,
  );

  const refresh = useCallback(
    () => startTransition(() => router.refresh()),
    [router],
  );

  const totalPages = Math.max(1, Math.ceil(initialManagers.length / perPage));
  const paginated = initialManagers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const goTo = (p: number) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  const handlePerPageChange = (val: number) => {
    setPerPage(val);
    setCurrentPage(1);
  };

  const pageNumbers = (() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  })();

  const paginationProps = {
    currentPage,
    totalPages,
    pageNumbers,
    filteredCount: initialManagers.length,
    perPage,
    goTo,
  };

  return (
    <div
      className={`flex flex-col h-full min-h-0 gap-4 transition-opacity duration-200 ${
        isPending ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      {showCreate && (
        <CreateProjectManagerModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            refresh();
          }}
        />
      )}

      {editTarget && (
        <EditProjectManagerModal
          manager={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => {
            setEditTarget(null);
            refresh();
          }}
        />
      )}

      {deleteTarget && (
        <DeleteProjectManagerModal
          manager={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSaved={() => {
            setDeleteTarget(null);
            refresh();
          }}
        />
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <PerPageDropdown value={perPage} onChange={handlePerPageChange} />
          <span className="hidden sm:inline text-sm text-zinc-500 dark:text-zinc-400">
            {initialManagers.length} Project Manager
          </span>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center justify-center gap-2 h-9 px-5 text-sm font-semibold rounded-lg bg-primary hover:bg-blue-700 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
        >
          <Plus size={16} />
          <span>Project Manager</span>
        </button>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden flex-1 min-h-0 flex flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 flex flex-col gap-3 bg-zinc-50 dark:bg-zinc-950">
          {paginated.length === 0 ? (
            <EmptyState />
          ) : (
            paginated.map((item, idx) => (
              <MobileCard
                key={item.id}
                item={item}
                index={(currentPage - 1) * perPage + idx + 1}
                onEdit={() => setEditTarget(item)}
                onDelete={() => setDeleteTarget(item)}
              />
            ))
          )}
        </div>
        <PaginationBar {...paginationProps} />
      </div>

      {/* Desktop table */}
      <div className="hidden lg:flex flex-1 min-h-0 flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
        <div className="flex-1 min-h-0 overflow-auto">
          <table
            className="border-collapse w-full"
            style={{ minWidth: "700px" }}
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
              {paginated.length === 0 ? (
                <EmptyState colSpan={TABLE_COLUMNS.length} />
              ) : (
                paginated.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors duration-75"
                  >
                    <td className="py-4 px-5 text-center text-sm text-zinc-500 dark:text-zinc-500 tabular-nums">
                      {(currentPage - 1) * perPage + idx + 1}
                    </td>

                    <td className="py-4 px-5 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                      {item.name}
                    </td>

                    <td className="py-4 px-5 text-sm text-zinc-600 dark:text-zinc-400">
                      {item.email}
                    </td>

                    <td className="py-4 px-5 text-sm text-zinc-600 dark:text-zinc-400">
                      @{item.username}
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
        <PaginationBar {...paginationProps} />
      </div>
    </div>
  );
}
