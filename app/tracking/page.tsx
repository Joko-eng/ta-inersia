export default function tracking() {
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold text-blue-600">
          Dashboard Pemantauan Proyek
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Pantau perkembangan proyek Anda dengan mudah
        </p>

        <div className="mt-8 p-4 flex gap-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm dark:shadow-none">
          <input
            type="text"
            placeholder="Masukkan kode tracking proyek Anda..."
            className="
    flex-1 min-w-0
    px-4 py-2 text-sm rounded-lg
    border border-slate-200 dark:border-slate-700
    bg-white dark:bg-slate-900
    text-slate-900 dark:text-slate-100
    placeholder-slate-400 dark:placeholder-slate-500

    outline-none
    focus:ring-2
    focus:ring-blue-500 dark:focus:ring-blue-400
  "
          />
          <button
            className="
    shrink-0
    px-4 sm:px-6 py-2 text-sm rounded-lg
    bg-primary dark:bg-blue-500
    text-white

    border-2
    border-border dark:border-blue-400

    shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]
    dark:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)]

    transition-all duration-150

    hover:-translate-x-[1px] hover:-translate-y-[1px]
    hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]
    dark:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)]

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
