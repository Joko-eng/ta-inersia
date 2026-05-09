"use client";

import { useEffect, useRef } from "react";

const visitorData = [
  120, 80, 140, 90, 160, 110, 130, 70, 150, 120, 180, 140, 100, 160, 130, 110,
  170, 90, 150, 130,
];

const months = ["Des", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"];

export default function VisitorChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
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

      const isDark = document.documentElement.classList.contains("dark");
      const prevLineColor = isDark ? "#3f3f46" : "#d1d5db";
      const fillStart = isDark
        ? "rgba(20,184,166,0.2)"
        : "rgba(20,184,166,0.15)";

      // Previous line
      ctx.beginPath();
      ctx.strokeStyle = prevLineColor;
      ctx.lineWidth = 1.5;
      data.forEach((v, i) => {
        const x = padX + i * stepX;
        const y = getY(v) + 10;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Current line (teal)
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
      gradient.addColorStop(0, fillStart);
      gradient.addColorStop(1, "rgba(20,184,166,0)");
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    draw();

    const observer = new MutationObserver(draw);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm dark:shadow-zinc-800/40 border border-transparent dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">
            Visitor statistics
          </p>
          <p className="text-xs text-gray-400 dark:text-zinc-500">Nov – Jul</p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-400" />
              Last 6 months
            </div>
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">
              475.273
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-zinc-600" />
              Previously
            </div>
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">
              782.396
            </p>
          </div>
        </div>
      </div>
      <div className="relative w-full h-44">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      <div className="flex justify-between mt-1 px-1">
        {months.map((m) => (
          <span key={m} className="text-xs text-gray-400 dark:text-zinc-600">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}