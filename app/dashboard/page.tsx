"use client";

import { useEffect, useRef } from "react";

const stats = [
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
    label: "Total Proyek",
    value: "22",
    color: "amber",
    gradient: "from-amber-500/10 to-amber-500/0",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    label: "Total Klien",
    value: "13",
    color: "pink",
    gradient: "from-pink-500/10 to-pink-500/0",
    iconBg: "bg-pink-100",
    iconText: "text-pink-500",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    label: "Total Tim Pengembang",
    value: "5",
    color: "purple",
    gradient: "from-purple-500/10 to-purple-500/0",
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
  },
];

const visitorData = [
  120, 80, 140, 90, 160, 110, 130, 70, 150, 120, 180, 140, 100, 160, 130, 110,
  170, 90, 150, 130,
];

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const data = visitorData;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const padX = 16;
    const padY = 20;
    const stepX = (w - padX * 2) / (data.length - 1);

    const getY = (v: number) =>
      padY + ((max - v) / (max - min)) * (h - padY * 2);

    ctx.beginPath();
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 1.5;
    data.forEach((v, i) => {
      const x = padX + i * stepX;
      const y = getY(v) + 10;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw current line (teal)
    ctx.beginPath();
    ctx.strokeStyle = "#14b8a6";
    ctx.lineWidth = 2;
    data.forEach((v, i) => {
      const x = padX + i * stepX;
      const y = getY(v);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.lineTo(padX + (data.length - 1) * stepX, h - padY);
    ctx.lineTo(padX, h - padY);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, padY, 0, h);
    gradient.addColorStop(0, "rgba(20,184,166,0.15)");
    gradient.addColorStop(1, "rgba(20,184,166,0)");
    ctx.fillStyle = gradient;
    ctx.fill();
  }, []);

  // Donut chart via SVG
  const donutRadius = 54;
  const circumference = 2 * Math.PI * donutRadius;
  const percentage = 60;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const months = ["Des", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"];

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen dark:bg-black">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Selamat datang kembali, </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-5 bg-gradient-to-br ${s.gradient} backdrop-blur-sm border border-white/40 shadow-sm hover:shadow-md transition`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${s.iconBg} ${s.iconText}`}>
                  {s.icon}
                </div>

                <div>
                  <p className={`text-3xl font-semibold ${s.iconText}`}>
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content: Chart + Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Visitor Statistics */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Visitor statistics
                </p>
                <p className="text-xs text-gray-400">Nov – Jul</p>
              </div>
              <div className="flex gap-6 text-right">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="inline-block w-2 h-2 rounded-full bg-teal-400" />
                    Last 6 months
                  </div>
                  <p className="text-sm font-semibold text-gray-800">475.273</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="inline-block w-2 h-2 rounded-full bg-gray-300" />
                    Previously
                  </div>
                  <p className="text-sm font-semibold text-gray-800">782.396</p>
                </div>
              </div>
            </div>
            <div className="relative w-full h-44">
              <canvas ref={canvasRef} className="w-full h-full" />
            </div>
            {/* X axis labels */}
            <div className="flex justify-between mt-1 px-1">
              {months.map((m) => (
                <span key={m} className="text-xs text-gray-400">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Proyek Donut */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-800">Proyek</p>
              <button className="text-xs text-blue-500 hover:underline">
                Januari
              </button>
            </div>

            {/* Donut */}
            <div className="flex items-center justify-center my-4">
              <svg width="140" height="140" viewBox="0 0 140 140">
                {/* Background circle */}
                <circle
                  cx="70"
                  cy="70"
                  r={donutRadius}
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="14"
                />
                {/* Green arc */}
                <circle
                  cx="70"
                  cy="70"
                  r={donutRadius}
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
                {/* Amber arc */}
                <circle
                  cx="70"
                  cy="70"
                  r={donutRadius}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="14"
                  strokeDasharray={`${circumference * 0.2} ${circumference}`}
                  strokeDashoffset={circumference * 0.2}
                  strokeLinecap="round"
                  style={{
                    transform: "rotate(72deg)",
                    transformOrigin: "70px 70px",
                  }}
                />
                {/* Red arc */}
                <circle
                  cx="70"
                  cy="70"
                  r={donutRadius}
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

            {/* Legend */}
            <div className="space-y-2 mt-2">
              {[
                { color: "bg-amber-400", label: "Menunggu" },
                { color: "bg-green-500", label: "Sedang dikerjakan" },
                { color: "bg-red-400", label: "Selesai" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-xs text-gray-600"
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
