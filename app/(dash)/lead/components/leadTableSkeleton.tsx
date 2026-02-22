export default function LeadTableSkeleton() {
  return (
    <>
      <div className="flex justify-end gap-2">
        <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>

      <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col min-h-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {["No", "Nama", "Rating", "Jumlah Ulasan", "NoTelp", "Alamat", "Status", "Action"].map((col) => (
                <th key={col} className="text-center py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold text-xs">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-50 dark:border-gray-800">
                {Array.from({ length: 8 }).map((_, j) => (
                  <td key={j} className="py-3 px-4">
                    <div
                      className="h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mx-auto"
                      style={{ width: `${60 + (i * j * 7) % 30}%`, animationDelay: `${i * 50}ms` }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex-1 bg-white dark:bg-gray-900" />

        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
          <div className="h-3 w-40 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          <div className="flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}