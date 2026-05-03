"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

import { LeadData } from "@/types/ILead";
import DeleteModal from "./deleteModal";
import EditModal from "./editModal";
import ScrapingModal from "./scrapModal";
import {
  COLUMNS,
  EmptyCell,
  EmptyState,
  FilterDropdown,
  LeadName,
  MobileLeadCard,
  PaginationBar,
  PerPageDropdown,
  StatusBadge,
  StatusFilter,
} from "./components/props";

export default function LeadTable({ initialLeads }: { initialLeads: LeadData[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage]       = useState(1);
  const [perPage, setPerPage]               = useState(5);
  const [statusFilter, setStatusFilter]     = useState<StatusFilter>("Semua");
  const [showScrapModal, setShowScrapModal] = useState(false);
  const [editTarget, setEditTarget]         = useState<LeadData | null>(null);
  const [deleteTarget, setDeleteTarget]     = useState<LeadData | null>(null);

  const refresh = useCallback(
    () => startTransition(() => router.refresh()),
    [router],
  );

  const filtered = statusFilter === "Semua"
    ? initialLeads
    : initialLeads.filter((l) => l.status === statusFilter);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated  = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const goTo = (p: number) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  const handlePerPageChange = (val: number) => {
    setPerPage(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (val: StatusFilter) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const pageNumbers = (() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  })();

  const paginationProps = {
    currentPage,
    totalPages,
    pageNumbers,
    filteredCount: filtered.length,
    perPage,
    goTo,
  };

  return (
    <div
      className={`flex flex-col h-full min-h-0 gap-4 transition-opacity duration-200 ${
        isPending ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      {showScrapModal && (
        <ScrapingModal
          onClose={() => setShowScrapModal(false)}
          onScrapingDone={() => { setShowScrapModal(false); refresh(); }}
        />
      )}

      {editTarget && (
        <EditModal
          lead={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => { setEditTarget(null); refresh(); }}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          lead={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => { setDeleteTarget(null); refresh(); }}
        />
      )}

      <div className="flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <PerPageDropdown value={perPage} onChange={handlePerPageChange} />
          <span className="hidden sm:inline text-[12px] text-zinc-400 dark:text-zinc-600">
            {initialLeads.length} total data
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FilterDropdown value={statusFilter} onChange={handleFilterChange} />
          <button
            onClick={() => setShowScrapModal(true)}
            className="h-9 px-5 text-[12px] font-semibold rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors"
          >
            Tambah Data
          </button>
        </div>
      </div>

      <div className="lg:hidden flex-1 min-h-0 flex flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 flex flex-col gap-3 bg-[#F5F5F3] dark:bg-[#111111]">
          {paginated.length === 0 ? (
            <EmptyState mobile />
          ) : (
            paginated.map((item, idx) => (
              <MobileLeadCard
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

      <div className="hidden lg:flex flex-1 min-h-0 flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
        <div className="flex-1 min-h-0 overflow-auto">
          <table className="border-collapse w-full" style={{ minWidth: "860px" }}>
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#F5F5F3] dark:bg-zinc-800/80 border-b border-zinc-100 dark:border-zinc-800">
                {COLUMNS.map(({ label, align, w }) => (
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
              {paginated.length === 0 ? (
                <EmptyState />
              ) : (
                paginated.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors duration-75"
                  >
                    <td className="py-4 px-4 text-center text-[12px] text-zinc-300 dark:text-zinc-700 tabular-nums">
                      {(currentPage - 1) * perPage + idx + 1}
                    </td>

                    <td className="py-4 px-4">
                      <LeadName nama={item.nama} mapsUrl={item.mapsUrl} />
                    </td>

                    <td className="py-4 px-4 text-center tabular-nums text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                      {item.rating > 0 ? item.rating : <EmptyCell />}
                    </td>

                    <td className="py-4 px-4 text-center tabular-nums text-[13px] text-zinc-500 dark:text-zinc-500">
                      {item.jumlahUlasan > 0
                        ? item.jumlahUlasan.toLocaleString("id-ID")
                        : <EmptyCell />}
                    </td>

                    <td className="py-4 px-4 text-[12px] font-mono text-zinc-500 dark:text-zinc-500 tracking-tight">
                      {item.noTelp || <span className="font-sans"><EmptyCell /></span>}
                    </td>

                    <td className="py-4 px-4 max-w-[180px]">
                      <span
                        className="block text-[13px] text-zinc-500 dark:text-zinc-500 truncate"
                        title={item.alamat}
                      >
                        {item.alamat || <EmptyCell />}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="py-4 px-4 max-w-[140px]">
                      <span
                        className="block text-[13px] text-zinc-400 dark:text-zinc-600 truncate"
                        title={item.keterangan}
                      >
                        {item.keterangan || <EmptyCell />}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditTarget(item)}
                          className="h-7 px-3 flex items-center gap-1.5 text-[11px] font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
                        >
                          <Pencil size={11} />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="h-7 px-3 flex items-center gap-1.5 text-[11px] font-medium rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-colors"
                        >
                          <Trash2 size={11} />
                          Hapus
                        </button>
                      </div>
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