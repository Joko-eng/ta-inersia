export default function ProjectTableSkeleton() {
  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-7 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
        </div>
        <div className="h-9 w-28 bg-zinc-300 dark:bg-zinc-700 rounded-lg animate-pulse" />
      </div>

      <div className="hidden lg:flex flex-1 min-h-0 flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
        <div className="flex-1 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-[#F5F5F3] dark:bg-zinc-800/80">
                {["No", "Nama Project", "Tracker Code", "Status", "Dibuat", "Aksi"].map((col) => (
                  <th key={col} className="py-3 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-600 text-center">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/60">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="py-4 px-4">
                      <div
                        className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse mx-auto"
                        style={{ width: `${40 + (i * j * 13) % 45}%`, animationDelay: `${i * 55}ms` }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}