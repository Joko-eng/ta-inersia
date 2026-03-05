import {
  getTrackingByCode,
  getTrackingCodeFromCookie,
  submitTrackingCode,
} from "./action";
import TrackingResult from "./TrackingResult";

export const dynamic = "force-dynamic";

export default async function Page() {
  const code = await getTrackingCodeFromCookie();
  const result = code ? await getTrackingByCode(code) : null;

  return (
    <div className="max-w-5xl mx-auto p-10">
      <h1 className="text-xl font-bold">Dashboard Tracking</h1>
      <form action={submitTrackingCode} className="mt-6 flex gap-3">
        <input
          type="text"
          name="code"
          defaultValue={code ?? ""}
          required
          className="border px-3 py-2 rounded"
          placeholder="Masukkan kode tracking"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Cari
        </button>
      </form>

      {!code && (
        <div className="mt-10 text-sm text-gray-400">
          Masukkan kode tracking.
        </div>
      )}

      {code && !result && (
        <div className="mt-6 text-red-500 text-sm">Proyek tidak ditemukan.</div>
      )}

      {result && <TrackingResult result={result} />}
    </div>
  );
}
