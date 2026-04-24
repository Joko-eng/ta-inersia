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
      <p className="mb-3 text-xl font-semibold text-slate-400">Cari Proyek</p>

      <form action={formAction} className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/30">
          <Search className="h-4 w-4 text-slate-400" />
          <Input
            name="code"
            required
            autoComplete="off"
            placeholder="Masukkan kode tracking proyek Anda…"
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="gap-2 rounded-xl bg-gradient-to-br from-[#1a3fa8] to-[#2563eb] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          {isPending ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Mencari…
            </>
          ) : (
            <>
              <Search className="h-3.5 w-3.5" />
              Cari Proyek
            </>
          )}
        </Button>
      </form>

      {!state.searched && (
        <div className="mt-10 flex flex-col items-center gap-3 py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
            <Search className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-sm text-slate-400">
            Masukkan kode tracking untuk melihat status proyek Anda.
          </p>
        </div>
      )}

      {state.searched && state.error && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm text-red-600">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-red-700">Proyek tidak ditemukan</p>
            <p className="text-xs text-red-500">
              Periksa kembali kode tracking Anda.
            </p>
          </div>
        </div>
      )}

      {state.result && <TrackingResult result={state.result} />}
    </div>
  );
}
