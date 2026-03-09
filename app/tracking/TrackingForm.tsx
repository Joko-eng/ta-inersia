"use client";

import { AlertTriangle, Search } from "lucide-react";
import { useActionState } from "react";
import { searchTracking, TrackingState } from "./action";
import TrackingResult from "./TrackingResult";

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
      <form action={formAction} className="flex gap-3 items-center">
        <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#3B7DD8] focus-within:border-[#3B7DD8] transition-all">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            name="code"
            required
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            placeholder="Masukkan kode tracking proyek Anda.."
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-primary hover:bg-[#163F84] active:bg-[#112F63] text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-sm transition-colors duration-150 disabled:opacity-60 whitespace-nowrap"
        >
          {isPending ? "Mencari..." : "Cari Proyek"}
        </button>
      </form>

      {!state.searched && (
        <div className="mt-10 text-sm text-gray-400 text-center py-6">
          Masukkan kode tracking untuk melihat status proyek Anda.
        </div>
      )}

      {state.searched && state.error && (
        <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm">
          <AlertTriangle className="w-4 h-4" />
          {state.error}
        </div>
      )}

      {state.result && <TrackingResult result={state.result} />}
    </div>
  );
}
