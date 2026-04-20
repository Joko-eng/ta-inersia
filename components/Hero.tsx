"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let mx = -999,
      my = -999;
    let ripples: { x: number; y: number; t: number }[] = [];
    let animId: number;

    const GRID = 60,
      RADIUS = 160,
      MAX_BULGE = 22;

    const resize = () => {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => {
      mx = -999;
      my = -999;
    };
    const onClick = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: 0 });
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    section.addEventListener("click", onClick);

    function getDisplace(baseX: number, baseY: number) {
      let ox = 0,
        oy = 0;

      const dx = baseX - mx,
        dy = baseY - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < RADIUS && dist > 0) {
        const force = (1 - dist / RADIUS) * MAX_BULGE;
        const angle = Math.atan2(dy, dx);
        ox += Math.cos(angle) * force;
        oy += Math.sin(angle) * force;
      }

      ripples.forEach((rp) => {
        const rdx = baseX - rp.x,
          rdy = baseY - rp.y;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        const waveFront = rp.t * 380;
        const waveWidth = 60;
        const diff = Math.abs(rdist - waveFront);
        if (diff < waveWidth && rdist > 0) {
          const strength = (1 - diff / waveWidth) * 12 * (1 - rp.t);
          const a = Math.atan2(rdy, rdx);
          ox += Math.cos(a) * strength;
          oy += Math.sin(a) * strength;
        }
      });

      return { ox, oy };
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ripples = ripples.filter((rp) => rp.t < 1);
      ripples.forEach((rp) => (rp.t += 0.018));

      const cols = Math.ceil(canvas.width / GRID) + 2;
      const rows = Math.ceil(canvas.height / GRID) + 2;

      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.lineWidth = 1;

      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const bx = c * GRID - GRID,
            by = r * GRID - GRID;
          const { ox, oy } = getDisplace(bx, by);
          if (c === 0) ctx.moveTo(bx + ox, by + oy);
          else ctx.lineTo(bx + ox, by + oy);
        }
        ctx.stroke();
      }

      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const bx = c * GRID - GRID,
            by = r * GRID - GRID;
          const { ox, oy } = getDisplace(bx, by);
          if (r === 0) ctx.moveTo(bx + ox, by + oy);
          else ctx.lineTo(bx + ox, by + oy);
        }
        ctx.stroke();
      }

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
          <div className="inline-flex items-center gap-2 text-blue-600 text-xs dark:ring-blue dark:text-white sm:text-sm font-semibold">
            <span className="w-2 h-2 ring-2 rounded-full bg-blue-600 dark:bg-white dark:ring-2 dark:ring-white/60" />
            InersiaDev — Digital Solutions for Growing Businesses
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl dark:text-white font-bold leading-[1.1] text-gray-900 tracking-tight">
            Build Strong Digital Presence
            <br />
            <span className="text-gray-400 font-bold">
              That Drives Real Business Growth
            </span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg leading-snug max-w-md">
            We develop websites, design, and digital systems that enhance
            credibility, attract customers, and drive business growth.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-primary dark:bg-white text-white dark:text-black font-semibold px-6 py-3 rounded-full hover:bg-blue-800 transition-all hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
            >
              Start Your Project
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <a
              href="#services"
              className="text-gray-700 font-semibold dark:text-white dark:hover:text-blue-400 transition-colors"
            >
              Explore Our Services
            </a>
          </div>
        </div>

        <div className="relative w-full max-w-[320px] mx-auto lg:ml-auto h-[280px] lg:h-[460px] mt-8 lg:mt-0">
          <div className="relative w-full h-full rounded-3xl overflow-hidden ring-1 ring-blue-800/20 shadow-lg shadow-blue-200">
            <Image
              src="/bg.jpg"
              alt="InersiaDev Work"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/20" />
          </div>

          {/* FLOATING CARD - TOP LEFT */}
          <div className="flex absolute top-2 left-2 lg:-top-6 lg:-left-8 z-20 bg-white rounded-xl px-4 py-3 items-center gap-3 shadow-[0_8px_25px_rgba(0,0,0,0.12),0_4px_10px_rgba(59,130,246,0.15)]">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
              ●
            </div>
            <div className="text-sm leading-tight">
              <p className="font-semibold text-gray-800">Web Developer</p>
              <p className="text-gray-500 text-xs">Consistent & scalable</p>
            </div>
          </div>

          {/* FLOATING CARD - BOTTOM RIGHT */}
          <div className="flex absolute bottom-2 right-2 lg:-bottom-6 lg:-right-8 z-20 bg-white rounded-xl px-4 py-3 items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.15),0_6px_15px_rgba(59,130,246,0.18)]">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
              ↗
            </div>
            <div className="text-sm leading-tight">
              <p className="font-semibold text-gray-800">Product Strategy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
