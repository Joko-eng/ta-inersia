"use client";

import { AlertTriangle, Search } from "lucide-react";
import { useActionState } from "react";
import { searchTracking, TrackingState } from "./action";
import TrackingResult from "./TrackingResult";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: TrackingState = {
  result: null,
  error: null,
  searched: false,
};

export default function TrackingForm() {
  const [state, formAction, isPending] = useActionState(
    searchTracking,
    initialState,
  );

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
        Cari Proyek
      </p>

      <form action={formAction} className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 px-5 py-4 transition-all focus-within:border-primary focus-within:bg-white dark:focus-within:bg-neutral-900 focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          <Input
            name="code"
            required
            autoComplete="off"
            placeholder="Masukkan kode tracking proyek Anda…"
            className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="gap-2 rounded-xl bg-primary hover:bg-primary/90 px-8 py-4 h-auto text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
        >
          {isPending ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Mencari…
            </>
          ) : (
            <>
              <Search className="h-3.5 w-3.5" />
              Cari
            </>
          )}
        </Button>
      </form>

      {!state.searched && (
        <div className="mt-10 flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8 dark:bg-primary/10 border border-primary/15 dark:border-primary/20">
            <Search className="h-7 w-7 text-primary/60 dark:text-primary/50" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Belum ada pencarian
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              Masukkan kode tracking untuk melihat status proyek Anda.
            </p>
          </div>
        </div>
      )}

      {state.searched && state.error && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 px-5 py-5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/40">
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              Proyek tidak ditemukan
            </p>
            <p className="text-xs text-red-500 dark:text-red-500/70 mt-0.5">
              Periksa kembali kode tracking Anda dan coba lagi.
            </p>
          </div>
        </div>
      )}

      {state.result && <TrackingResult result={state.result} />}
    </div>
  );
}
