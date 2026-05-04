"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";

import { LeadData, StatusFilter } from "@/types/ILead";
import { useClickOutside } from "@/components/ui/props";
import { EmptyCell } from "@/components/ui/props";
import DeleteModal from "./deleteModal";
import EditModal from "./editModal";
import ScrapingModal from "./scrapModal";

const PER_PAGE_OPTIONS = [5, 8, 10, 15];

const STATUS_OPTIONS = [
  "Semua",
  "Prospek",
  "Belum Prospek",
  "Tidak Prospek",
  "Belum Diproses",
] as const;

const COLUMNS = [
  { label: "No", align: "text-center", w: "w-10" },
  { label: "Nama", align: "text-left", w: "" },
  { label: "Rating", align: "text-center", w: "w-20" },
  { label: "Ulasan", align: "text-center", w: "w-20" },
  { label: "Telepon", align: "text-left", w: "w-38" },
  { label: "Alamat", align: "text-left", w: "w-48" },
  { label: "Status", align: "text-center", w: "w-36" },
  { label: "Keterangan", align: "text-left", w: "w-36" },
  { label: "Aksi", align: "text-center", w: "w-28" },
];

const STATUS_META: Record<string, { label: string; cls: string }> = {
  Prospek: {
    label: "Prospek",
    cls: "text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40",
  },
  "Belum Prospek": {
    label: "Belum Prospek",
    cls: "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/40",
  },
  "Tidak Prospek": {
    label: "Tidak Prospek",
    cls: "text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/40",
  },
  "Belum Diproses": {
    label: "Belum Diproses",
    cls: "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800",
  },
};

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META["Belum Diproses"];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap ${meta.cls}`}
    >
      {meta.label}
    </span>
  );
}

function LeadName({
  nama,
  mapsUrl,
  mobile,
}: {
  nama: string;
  mapsUrl: string;
  mobile?: boolean;
}) {
  const baseDesktop =
    "text-[13px] font-medium text-zinc-800 dark:text-zinc-100 underline underline-offset-2 decoration-zinc-200 dark:decoration-zinc-700 transition-colors";
  const baseMobile =
    "text-[14px] font-semibold text-zinc-900 dark:text-white leading-snug";

  if (mapsUrl) {
    return (
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={
          mobile
            ? `${baseMobile} underline underline-offset-2 decoration-zinc-200 dark:decoration-zinc-700`
            : `${baseDesktop} hover:text-zinc-500 dark:hover:text-zinc-400`
        }
      >
        {nama}
      </a>
    );
  }

  return <span className={mobile ? baseMobile : baseDesktop}>{nama}</span>;
}

function CardField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-0.5">
        {label}
      </p>
      {children}
    </div>
  );
}

function MobileLeadCard({
  item,
  index,
  onEdit,
  onDelete,
}: {
  item: LeadData;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-600 tabular-nums font-medium">
            #{index}
          </span>
          <LeadName nama={item.nama} mapsUrl={item.mapsUrl} mobile />
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {item.rating > 0 && (
          <CardField label="Rating">
            <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
              {item.rating}
            </p>
          </CardField>
        )}
        {item.jumlahUlasan > 0 && (
          <CardField label="Ulasan">
            <p className="text-[13px] text-zinc-600 dark:text-zinc-400">
              {item.jumlahUlasan.toLocaleString("id-ID")}
            </p>
          </CardField>
        )}
        {item.noTelp && (
          <div className="col-span-2">
            <CardField label="Telepon">
              <p className="text-[13px] font-mono text-zinc-600 dark:text-zinc-400">
                {item.noTelp}
              </p>
            </CardField>
          </div>
        )}
        {item.alamat && (
          <div className="col-span-2">
            <CardField label="Alamat">
              <p className="text-[12px] text-zinc-500 dark:text-zinc-500 line-clamp-2">
                {item.alamat}
              </p>
            </CardField>
          </div>
        )}
        {item.keterangan && (
          <div className="col-span-2">
            <CardField label="Keterangan">
              <p className="text-[12px] text-zinc-500 dark:text-zinc-500 line-clamp-2">
                {item.keterangan}
              </p>
            </CardField>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-1 border-t border-zinc-50 dark:border-zinc-800">
        <button
          onClick={onEdit}
          className="flex-1 h-8 flex items-center justify-center gap-1.5 text-[12px] font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <Pencil size={12} /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 h-8 flex items-center justify-center gap-1.5 text-[12px] font-medium rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-colors"
        >
          <Trash2 size={12} /> Hapus
        </button>
      </div>
    </div>
  );
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
        className="h-9 px-3.5 flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[12px] text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
      >
        <span className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-600">
          Tampilkan
        </span>
        <span className="font-semibold text-zinc-800 dark:text-zinc-100">
          {value}
        </span>
        <ChevronDown
          size={12}
          className={`text-zinc-300 dark:text-zinc-600 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-32 rounded-lg border border-zinc-100 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg z-50 overflow-hidden py-1">
          {PER_PAGE_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-[12px] transition-colors ${
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

function FilterDropdown({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (v: StatusFilter) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-9 px-3.5 flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[12px] text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
      >
        <SlidersHorizontal
          size={12}
          className="text-zinc-400 dark:text-zinc-600"
        />
        <span>{value}</span>
        <ChevronDown
          size={12}
          className={`text-zinc-300 dark:text-zinc-600 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-44 rounded-lg border border-zinc-100 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg z-50 overflow-hidden py-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-[12px] transition-colors ${
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
    <div className="shrink-0 border-t border-zinc-100 dark:border-zinc-800 px-4 sm:px-5 py-3 flex items-center justify-between gap-3 bg-white dark:bg-zinc-900">
      <span className="text-[12px] text-zinc-400 dark:text-zinc-600 shrink-0">
        {filteredCount === 0
          ? "Tidak ada data"
          : `${rangeStart}-${rangeEnd} dari ${filteredCount}`}
      </span>

      <div className="flex items-center gap-1 flex-wrap justify-end">
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => goTo(page)}
            className={`h-8 min-w-[32px] px-2 rounded-lg text-[12px] font-medium transition-colors ${
              page === currentPage
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                : "border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ mobile }: { mobile?: boolean }) {
  if (mobile) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 py-20">
        <p className="text-[14px] text-zinc-400 dark:text-zinc-600 font-light">
          Belum ada data
        </p>
        <p className="text-[12px] text-zinc-300 dark:text-zinc-700">
          Klik Tambah Data untuk memulai
        </p>
      </div>
    );
  }

  return (
    <tr>
      <td colSpan={9} className="py-28 text-center">
        <p className="text-[14px] text-zinc-400 dark:text-zinc-600 font-light">
          Belum ada data
        </p>
        <p className="text-[12px] text-zinc-300 dark:text-zinc-700 mt-1.5">
          Klik Tambah Data untuk memulai scraping
        </p>
      </td>
    </tr>
  );
}

export default function LeadTable({
  initialLeads,
}: {
  initialLeads: LeadData[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");
  const [showScrapModal, setShowScrapModal] = useState(false);
  const [editTarget, setEditTarget] = useState<LeadData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LeadData | null>(null);

  const refresh = useCallback(
    () => startTransition(() => router.refresh()),
    [router],
  );

  const filtered =
    statusFilter === "Semua"
      ? initialLeads
      : initialLeads.filter((l) => l.status === statusFilter);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice(
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

  const handleFilterChange = (val: StatusFilter) => {
    setStatusFilter(val);
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
          <table
            className="border-collapse w-full"
            style={{ minWidth: "860px" }}
          >
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
                      {item.jumlahUlasan > 0 ? (
                        item.jumlahUlasan.toLocaleString("id-ID")
                      ) : (
                        <EmptyCell />
                      )}
                    </td>

                    <td className="py-4 px-4 text-[12px] font-mono text-zinc-500 dark:text-zinc-500 tracking-tight">
                      {item.noTelp || (
                        <span className="font-sans">
                          <EmptyCell />
                        </span>
                      )}
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
                          <Pencil size={11} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="h-7 px-3 flex items-center gap-1.5 text-[11px] font-medium rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-colors"
                        >
                          <Trash2 size={11} /> Hapus
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
