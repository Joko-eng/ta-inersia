export default function page() {
  return (
    <div className="w-full bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold text-blue-600">
          Dashboard Pemantauan Proyek
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Pantau perkembangan proyek Anda dengan mudah
        </p>

        <div className="mt-8 bg-white rounded-xl shadow-sm p-4 flex gap-3">
          <input
            type="text"
            placeholder="Masukkan kode tracking proyek Anda..."
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="
    bg-primary text-white px-6 py-2 rounded-lg text-sm border-2 border-border
    shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]
    transition-all duration-150

    hover:-translate-x-[1px] hover:-translate-y-[1px]
    hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.8)]

    active:translate-x-[4px] active:translate-y-[4px]
    active:shadow-none
    active:scale-[0.97]
  "
          >
            Cari Proyek
          </button>
        </div>
      </div>
    </div>
  );
}
