export default function ProjectManagerTableSkeleton() {
  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div className="h-3 w-32 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="h-9 w-44 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
      </div>

      <div className="hidden lg:flex flex-1 min-h-0 flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
        <div className="flex-1 overflow-hidden">
          <table
            className="border-collapse w-full"
            style={{ minWidth: "700px" }}
          >
            <thead>
              <tr className="bg-[#F5F5F3] dark:bg-zinc-800/80 border-b border-zinc-100 dark:border-zinc-800">
                {["No", "Nama", "Email", "Username", "Dibuat", "Aksi"].map(
                  (col) => (
                    <th
                      key={col}
                      className="py-3 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-600 text-center"
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/60">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr
                  key={i}
                  className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30"
                >
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="py-4 px-4">
                      <div
                        className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse mx-auto"
                        style={{
                          width: `${40 + ((i * j * 13) % 45)}%`,
                          animationDelay: `${i * 55}ms`,
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:hidden flex-1 min-h-0 flex flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 flex flex-col gap-3 bg-[#F5F5F3] dark:bg-[#111111]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 p-4 flex flex-col gap-3"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex flex-col gap-2">
                <div className="h-2.5 w-8 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-3.5 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
              <div className="h-3 w-1/2 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
              <div className="h-3 w-1/4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
              <div className="flex gap-2 pt-1 border-t border-zinc-50 dark:border-zinc-800">
                <div className="flex-1 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                <div className="flex-1 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
