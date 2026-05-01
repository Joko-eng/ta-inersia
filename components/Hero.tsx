"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useLang } from "./LanguageContext";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // Ref untuk menyimpan posisi agar tidak memicu Reflow
  const rectRef = useRef({ left: 0, top: 0 });
  const { t } = useLang();

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d", { alpha: false }); // Optimasi render
    if (!ctx) return;

    let mx = -999,
      my = -999;
    let ripples: { x: number; y: number; t: number }[] = [];
    let animId: number;

    const GRID = 60,
      RADIUS = 160,
      MAX_BULGE = 22;

    const resize = () => {
      const r = section.getBoundingClientRect();
      rectRef.current = { left: r.left, top: r.top };
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // OPTIMASI: Mouse events tidak lagi memanggil getBoundingClientRect()
    const onMove = (e: MouseEvent) => {
      mx = e.clientX - rectRef.current.left;
      my = e.clientY - rectRef.current.top;
    };
    const onLeave = () => {
      mx = -999;
      my = -999;
    };
    const onClick = (e: MouseEvent) => {
      // Batasi jumlah ripple agar tidak membebani CPU
      if (ripples.length > 8) ripples.shift();
      ripples.push({
        x: e.clientX - rectRef.current.left,
        y: e.clientY - rectRef.current.top,
        t: 0,
      });
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    section.addEventListener("click", onClick);

    // Fungsi kalkulasi yang lebih efisien
    function getDisplace(baseX: number, baseY: number) {
      let ox = 0,
        oy = 0;
      const dx = baseX - mx,
        dy = baseY - my;
      const distSq = dx * dx + dy * dy;

      if (distSq < RADIUS * RADIUS) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / RADIUS) * MAX_BULGE;
        const angle = Math.atan2(dy, dx);
        ox += Math.cos(angle) * force;
        oy += Math.sin(angle) * force;
      }

      for (let i = 0; i < ripples.length; i++) {
        const rp = ripples[i];
        const rdx = baseX - rp.x,
          rdy = baseY - rp.y;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        const waveFront = rp.t * 380;
        const diff = Math.abs(rdist - waveFront);
        if (diff < 60 && rdist > 0) {
          const strength = (1 - diff / 60) * 12 * (1 - rp.t);
          const a = Math.atan2(rdy, rdx);
          ox += Math.cos(a) * strength;
          oy += Math.sin(a) * strength;
        }
      }
      return { ox, oy };
    }

    const draw = () => {
      // Menggunakan fillRect putih lebih cepat daripada clearRect transparan
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ripples = ripples.filter((rp) => rp.t < 1);
      ripples.forEach((rp) => (rp.t += 0.018));

      const cols = Math.ceil(canvas.width / GRID) + 2;
      const rows = Math.ceil(canvas.height / GRID) + 2;

      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.lineWidth = 1;

      // OPTIMASI: Pre-calculating points agar tidak hitung ulang saat gambar garis vertikal
      const gridPoints: { x: number; y: number }[][] = [];
      for (let r = 0; r < rows; r++) {
        gridPoints[r] = [];
        for (let c = 0; c < cols; c++) {
          const bx = c * GRID - GRID,
            by = r * GRID - GRID;
          const { ox, oy } = getDisplace(bx, by);
          gridPoints[r][c] = { x: bx + ox, y: by + oy };
        }
      }

      // Gambar Horizontal
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        ctx.moveTo(gridPoints[r][0].x, gridPoints[r][0].y);
        for (let c = 1; c < cols; c++) {
          ctx.lineTo(gridPoints[r][c].x, gridPoints[r][c].y);
        }
      }
      // Gambar Vertikal
      for (let c = 0; c < cols; c++) {
        ctx.moveTo(gridPoints[0][c].x, gridPoints[0][c].y);
        for (let r = 1; r < rows; r++) {
          ctx.lineTo(gridPoints[r][c].x, gridPoints[r][c].y);
        }
      }
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      section.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85vh] flex items-center overflow-hidden bg-white dark:bg-primary pt-12"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full py-10">
        <div className="space-y-6 pt-6 lg:pt-8">
          <div className="inline-flex items-center gap-2 text-blue-600 text-xs dark:text-white sm:text-sm font-semibold">
            <span className="w-2 h-2 ring-2 rounded-full bg-blue-600 dark:bg-white dark:ring-white/60" />
            {t("hero.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl dark:text-white font-bold leading-[1.1] text-gray-900 tracking-tight">
            {t("hero.title1")}
            <br />
            <span className="text-gray-400 font-bold">{t("hero.title2")}</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg leading-snug max-w-md">
            {t("hero.desc")}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-primary dark:bg-white text-white dark:text-black font-semibold px-6 py-3 rounded-full hover:bg-blue-800 transition-all hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
            >
              {t("hero.cta1")}
            </a>
            <a
              href="#services"
              className="text-gray-700 font-semibold hover:text-blue-600 dark:text-white dark:hover:text-gray-400 transition-colors"
            >
              {t("hero.cta2")}
            </a>
          </div>
        </div>

        <div className="relative w-full max-w-[320px] mx-auto lg:ml-auto h-[280px] lg:h-[460px] mt-8 lg:mt-0">
          <div className="relative w-full h-full rounded-3xl overflow-hidden ring-1 ring-blue-800/20 shadow-lg shadow-blue-200">
            <Image
              src="/bg.webp" // ganti ke webp
              alt="InersiaDev Work"
              fill
              sizes="(max-width: 1024px) 320px, 460px"
              className="object-cover"
              priority
              quality={75}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/20" />
          </div>
          <div className="flex absolute top-2 left-2 lg:-top-6 lg:-left-8 z-20 bg-white rounded-xl px-4 py-3 items-center gap-3 shadow-[0_8px_25px_rgba(0,0,0,0.12),0_4px_10px_rgba(59,130,246,0.15)]">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
              ●
            </div>
            <div className="text-sm leading-tight">
              <p className="font-semibold text-gray-800">
                {t("hero.card1.title")}
              </p>
              <p className="text-gray-500 text-xs">{t("hero.card1.sub")}</p>
            </div>
          </div>
          <div className="flex absolute bottom-2 right-2 lg:-bottom-6 lg:-right-8 z-20 bg-white rounded-xl px-4 py-3 items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.15),0_6px_15px_rgba(59,130,246,0.18)]">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
              ↗
            </div>
            <div className="text-sm leading-tight">
              <p className="font-semibold text-gray-800">
                {t("hero.card2.title")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
