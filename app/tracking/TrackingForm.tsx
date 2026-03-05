"use client";

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
          <svg
            className="w-4 h-4 text-gray-400 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z"
            />
          </svg>
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
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
            />
          </svg>
          {state.error}
        </div>
      )}

      {state.result && <TrackingResult result={state.result} />}
    </div>
  );
}
