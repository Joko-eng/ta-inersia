"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export const INPUT_CLS =
  "w-full h-9 px-3 text-[13px] rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 placeholder-zinc-300 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors";

export const LABEL_CLS =
  "block text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-600 mb-1.5";

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

export function ModalHeader({
  title,
  subtitle,
  onClose,
  closeDisabled,
}: {
  title:         string;
  subtitle?:     string;
  onClose:       () => void;
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
  cancelLabel  = "Batal",
  variant      = "danger",
  onConfirm,
  onCancel,
}: {
  open:           boolean;
  title:          string;
  description?:   string;
  confirmLabel?:  string;
  cancelLabel?:   string;
  variant?:       "danger" | "default";
  onConfirm:      () => void;
  onCancel:       () => void;
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

export function EmptyCell() {
  return <span className="text-zinc-200 dark:text-zinc-800">-</span>;
}

export function Dropdown<T extends string>({
  value,
  options,
  onChange,
  align = "left",
  renderLabel,
  renderOption,
  trigger,
}: {
  value:          T;
  options:        readonly T[];
  onChange:       (v: T) => void;
  align?:         "left" | "right";
  renderLabel?:   (v: T) => React.ReactNode;
  renderOption?:  (v: T) => React.ReactNode;
  trigger:        (open: boolean) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)}>
        {trigger(open)}
      </button>

      {open && (
        <div
          className={`absolute top-full mt-1 w-44 rounded-lg border border-zinc-100 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg z-50 overflow-hidden py-1 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full px-4 py-2 text-left text-[12px] transition-colors ${
                opt === value
                  ? "font-semibold text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-800"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
              }`}
            >
              {renderOption ? renderOption(opt) : opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}