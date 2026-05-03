"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";

import { LeadData } from "@/types/ILead";

export const PER_PAGE_OPTIONS = [5, 8, 10, 15];

export const STATUS_OPTIONS = [
  "Semua",
  "Prospek",
  "Belum Prospek",
  "Tidak Prospek",
  "Belum Diproses",
] as const;

export type StatusFilter = (typeof STATUS_OPTIONS)[number];

export const COLUMNS = [
  { label: "No",         align: "text-center", w: "w-10"  },
  { label: "Nama",       align: "text-left",   w: ""      },
  { label: "Rating",     align: "text-center", w: "w-20"  },
  { label: "Ulasan",     align: "text-center", w: "w-20"  },
  { label: "Telepon",    align: "text-left",   w: "w-38"  },
  { label: "Alamat",     align: "text-left",   w: "w-48"  },
  { label: "Status",     align: "text-center", w: "w-36"  },
  { label: "Keterangan", align: "text-left",   w: "w-36"  },
  { label: "Aksi",       align: "text-center", w: "w-28"  },
];

export const INPUT_CLS =
  "w-full h-9 px-3 text-[13px] rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 placeholder-zinc-300 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors";

export const LABEL_CLS =
  "block text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-600 mb-1.5";

export const STATUS_META: Record<string, { label: string; cls: string }> = {
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

export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onClose]);
}

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META["Belum Diproses"];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap ${meta.cls}`}
    >
      {meta.label}
    </span>
  );
}

export function EmptyCell() {
  return <span className="text-zinc-200 dark:text-zinc-800">-</span>;
}

export function ModalHeader({
  title,
  subtitle,
  onClose,
  closeDisabled,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  closeDisabled?: boolean;
}) {
  return (
    <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-4 shrink-0">
      <div>
        <h2 className="text-[15px] font-semibold text-zinc-900 dark:text-white tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[12px] text-zinc-400 dark:text-zinc-600 mt-0.5 truncate max-w-[220px]">
            {subtitle}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        disabled={closeDisabled}
        className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-zinc-400 dark:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ModalOverlay({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[3px]"
      onClick={onClick}
    />
  );
}

export function BottomSheetHandle() {
  return (
    <div className="sm:hidden flex justify-center pt-3 pb-0">
      <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Lanjutkan",
  cancelLabel = "Batal",
  variant = "danger",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  const confirmCls =
    variant === "danger"
      ? "bg-rose-500 hover:bg-rose-600 text-white"
      : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[3px]"
        onClick={onCancel}
      />
      <div className="relative z-10 w-full max-w-sm rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[15px] font-semibold text-zinc-900 dark:text-white tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="h-9 px-4 text-[13px] font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`h-9 px-4 text-[13px] font-medium rounded-lg transition-colors ${confirmCls}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PerPageDropdown({
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
        aria-label="Atur jumlah baris per halaman"
        onClick={() => setOpen((o) => !o)}
        className="h-9 px-3.5 flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[12px] text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
      >
        <span className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-600">
          Tampilkan
        </span>
        <span className="font-semibold text-zinc-800 dark:text-zinc-100">{value}</span>
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
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full px-4 py-2 text-left text-[12px] transition-colors ${
                opt === value
                  ? "font-semibold text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-800"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
              }`}
            >
              {opt} baris
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FilterDropdown({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (v: StatusFilter) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = value !== "Semua";

  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        aria-label="Filter berdasarkan status"
        onClick={() => setOpen((o) => !o)}
        className={`h-9 px-4 flex items-center gap-2 text-[12px] font-medium rounded-lg border transition-colors ${
          isActive
            ? "border-zinc-400 dark:border-zinc-500 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
            : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"
        }`}
      >
        <SlidersHorizontal size={13} />
        Filter
        {isActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 dark:bg-zinc-400" />
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-44 rounded-lg border border-zinc-100 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg z-50 overflow-hidden py-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
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

export function LeadName({
  nama,
  mapsUrl,
  mobile,
}: {
  nama: string;
  mapsUrl: string;
  mobile?: boolean;
}) {
  if (mapsUrl) {
    return (
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={
          mobile
            ? "text-[14px] font-semibold text-zinc-900 dark:text-white underline underline-offset-2 decoration-zinc-200 dark:decoration-zinc-700 leading-snug"
            : "text-[13px] font-medium text-zinc-800 dark:text-zinc-100 hover:text-zinc-500 dark:hover:text-zinc-400 underline underline-offset-2 decoration-zinc-200 dark:decoration-zinc-700 transition-colors"
        }
      >
        {nama}
      </a>
    );
  }

  return (
    <span
      className={
        mobile
          ? "text-[14px] font-semibold text-zinc-900 dark:text-white leading-snug"
          : "text-[13px] font-medium text-zinc-800 dark:text-zinc-100"
      }
    >
      {nama}
    </span>
  );
}

export function CardField({
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

export function MobileLeadCard({
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
            <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">{item.rating}</p>
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
              <p className="text-[13px] font-mono text-zinc-600 dark:text-zinc-400">{item.noTelp}</p>
            </CardField>
          </div>
        )}
        {item.alamat && (
          <div className="col-span-2">
            <CardField label="Alamat">
              <p className="text-[12px] text-zinc-500 dark:text-zinc-500 line-clamp-2">{item.alamat}</p>
            </CardField>
          </div>
        )}
        {item.keterangan && (
          <div className="col-span-2">
            <CardField label="Keterangan">
              <p className="text-[12px] text-zinc-500 dark:text-zinc-500 line-clamp-2">{item.keterangan}</p>
            </CardField>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-1 border-t border-zinc-50 dark:border-zinc-800">
        <button
          onClick={onEdit}
          className="flex-1 h-8 flex items-center justify-center gap-1.5 text-[12px] font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <Pencil size={12} />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 h-8 flex items-center justify-center gap-1.5 text-[12px] font-medium rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-colors"
        >
          <Trash2 size={12} />
          Hapus
        </button>
      </div>
    </div>
  );
}

export function PaginationBar({
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
  const rangeEnd   = Math.min(currentPage * perPage, filteredCount);

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
          aria-label="Halaman sebelumnya"
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
          aria-label="Halaman berikutnya"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export function EmptyState({ mobile }: { mobile?: boolean }) {
  if (mobile) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 py-20">
        <p className="text-[14px] text-zinc-400 dark:text-zinc-600 font-light">Belum ada data</p>
        <p className="text-[12px] text-zinc-300 dark:text-zinc-700">Klik Tambah Data untuk memulai</p>
      </div>
    );
  }

  return (
    <tr>
      <td colSpan={9} className="py-28 text-center">
        <p className="text-[14px] text-zinc-400 dark:text-zinc-600 font-light">Belum ada data</p>
        <p className="text-[12px] text-zinc-300 dark:text-zinc-700 mt-1.5">
          Klik Tambah Data untuk memulai scraping
        </p>
      </td>
    </tr>
  );
}