"use client";

const legend = [
  { color: "bg-amber-400", label: "Menunggu" },
  { color: "bg-green-500", label: "Sedang dikerjakan" },
  { color: "bg-red-400", label: "Selesai" },
];

export default function ProjectDonut() {
  const circumference = 2 * Math.PI * 54;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm dark:shadow-zinc-800/40 border border-transparent dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">
          Proyek
        </p>
        <button className="text-xs text-blue-500 dark:text-blue-400 hover:underline">
          Januari
        </button>
      </div>

      <div className="flex items-center justify-center my-4">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={54}
            fill="none"
            stroke="#f3f4f6"
            className="dark:[stroke:#27272a]"
            strokeWidth="14"
          />
          <circle
            cx="70"
            cy="70"
            r={54}
            fill="none"
            stroke="#22c55e"
            strokeWidth="14"
            strokeDasharray={`${circumference * 0.45} ${circumference}`}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "70px 70px",
            }}
          />
          <circle
            cx="70"
            cy="70"
            r={54}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="14"
            strokeDasharray={`${circumference * 0.2} ${circumference}`}
            strokeDashoffset={circumference * 0.2}
            strokeLinecap="round"
            style={{ transform: "rotate(72deg)", transformOrigin: "70px 70px" }}
          />
          <circle
            cx="70"
            cy="70"
            r={54}
            fill="none"
            stroke="#ef4444"
            strokeWidth="14"
            strokeDasharray={`${circumference * 0.15} ${circumference}`}
            strokeDashoffset={circumference * 0.05}
            strokeLinecap="round"
            style={{
              transform: "rotate(162deg)",
              transformOrigin: "70px 70px",
            }}
          />
          <text
            x="70"
            y="75"
            textAnchor="middle"
            fontSize="22"
            fontWeight="600"
            fill="#22c55e"
          >
            60%
          </text>
        </svg>
      </div>

      <div className="space-y-2 mt-2">
        {legend.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 text-xs text-gray-600 dark:text-zinc-400"
          >
            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
