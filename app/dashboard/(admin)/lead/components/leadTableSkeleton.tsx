export default function LeadTableSkeleton() {
  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
          <div className="hidden sm:block h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
          <div className="h-9 w-28 bg-zinc-300 dark:bg-zinc-700 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Mobile skeleton */}
      <div className="lg:hidden flex-1 min-h-0 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
        <div className="flex-1 p-3 sm:p-4 flex flex-col gap-3 bg-[#F5F5F3] dark:bg-[#111111] overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 p-4 flex flex-col gap-3"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex justify-between gap-3">
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-2 w-8 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                  <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
                </div>
                <div className="h-7 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex flex-col gap-1.5">
                    <div className="h-2 w-12 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-1 border-t border-zinc-50 dark:border-zinc-800">
                <div className="flex-1 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                <div className="flex-1 h-8 bg-rose-100 dark:bg-rose-950/30 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="shrink-0 border-t border-zinc-100 dark:border-zinc-800 px-4 py-3 flex items-center justify-between bg-white dark:bg-zinc-900">
          <div className="h-3 w-28 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop skeleton */}
      <div className="hidden lg:flex flex-1 min-h-0 flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
        <div className="flex-1 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-[#F5F5F3] dark:bg-zinc-800/80">
                {["No", "Nama", "Rating", "Ulasan", "Telepon", "Alamat", "Status", "Keterangan", "Aksi"].map((col) => (
                  <th
                    key={col}
                    className="py-3 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-600 text-center"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/60">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <td key={j} className="py-4 px-4">
                      <div
                        className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse mx-auto"
                        style={{ width: `${40 + (i * j * 11) % 45}%`, animationDelay: `${i * 55}ms` }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="shrink-0 border-t border-zinc-100 dark:border-zinc-800 px-5 py-3 flex items-center justify-between bg-white dark:bg-zinc-900">
          <div className="h-3 w-32 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}