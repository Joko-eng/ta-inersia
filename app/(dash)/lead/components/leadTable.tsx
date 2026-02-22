"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ListFilter, CirclePlus, Pencil, Trash2 } from "lucide-react";

import ScrapingModal from "../scrapModal";
import EditModal from "../editModal";
import DeleteModal from "../deleteModal";
import { LeadData } from "../leadAction";

const PER_PAGE = 5;

function statusColor(status: string): string {
  if (status === "Prospek")         return "bg-green-500";
  if (status === "Belum Diproses")  return "bg-gray-400";
  return "bg-pink-500";
}

interface LeadTableProps {
  initialLeads: LeadData[];
}

export default function LeadTable({ initialLeads }: LeadTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentPage,     setCurrentPage]     = useState(1);
  const [showScrapModal,  setShowScrapModal]   = useState(false);
  const [editTarget,      setEditTarget]       = useState<LeadData | null>(null);
  const [deleteTarget,    setDeleteTarget]     = useState<LeadData | null>(null);

  const refresh = useCallback(() => {
    startTransition(() => router.refresh());
  }, [router]);

  const totalPages = Math.max(1, Math.ceil(initialLeads.length / PER_PAGE));
  const paginated  = initialLeads.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const goTo = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      {showScrapModal && (
        <ScrapingModal
          onClose={() => setShowScrapModal(false)}
          onScrapingDone={() => {
            setShowScrapModal(false);
            refresh();
          }}
        />
      )}

      {editTarget && (
        <EditModal
          lead={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => {
            setEditTarget(null);
            refresh();
          }}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          lead={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => {
            setDeleteTarget(null);
            refresh();
          }}
        />
      )}

      <div className="flex justify-end gap-2">
        <button className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <ListFilter size={15} />
          Filter
        </button>
        <button
          onClick={() => setShowScrapModal(true)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <CirclePlus size={15} />
          Tambah
        </button>
      </div>

      <div
        className={`flex-1 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col min-h-0 transition-opacity duration-200 ${
          isPending ? "opacity-60 pointer-events-none" : "opacity-100"
        }`}
      >
        {isPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="text-xs text-gray-400 animate-pulse">Memperbarui data...</div>
          </div>
        )}

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {["No", "Nama", "Rating", "Jumlah Ulasan", "NoTelp", "Alamat", "Status", "Action"].map((col) => (
                <th
                  key={col}
                  className="text-center py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold text-xs"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {initialLeads.length === 0 && (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <span className="text-xs text-gray-400">
                    Belum ada data. Klik Tambah untuk mulai scraping.
                  </span>
                </td>
              </tr>
            )}

            {paginated.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400 text-xs">
                  {(currentPage - 1) * PER_PAGE + index + 1}
                </td>
                <td className="py-3 px-4 text-center text-gray-800 dark:text-gray-100 font-medium text-xs">
                  {item.nama}
                </td>
                <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400 text-xs">
                  {item.rating}
                </td>
                <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400 text-xs">
                  {item.jumlahUlasan}
                </td>
                <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400 text-xs">
                  {item.noTelp}
                </td>
                <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400 text-xs">
                  {item.alamat}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium ${statusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => setEditTarget(item)}
                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-500 transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900 text-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex-1 bg-white dark:bg-gray-900" />

        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-b-2xl">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Menampilkan{" "}
            {initialLeads.length === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1}–
            {Math.min(currentPage * PER_PAGE, initialLeads.length)} dari{" "}
            {initialLeads.length} data
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ‹
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => goTo(page)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                  page === currentPage
                    ? "bg-black dark:bg-white dark:text-black text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </>
  );
}