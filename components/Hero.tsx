"use client";
import { ArrowUpRight, Circle } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useLang } from "./LanguageContext";

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const DARK_BG = hexToRgb("#031745");
const LIGHT_BG = hexToRgb("#ffffff");
const DARK_LINE: [number, number, number] = [255, 255, 255];
const LIGHT_LINE: [number, number, number] = [3, 23, 69];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const rectRef = useRef({ left: 0, top: 0 });
  const { t } = useLang();

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let isVisible = true;

    const GRID = 70;
    const RADIUS = 160;
    const MAX_BULGE = 22;
    const THEME_SPEED = 0.06;

    let mx = -999,
      my = -999;
    let lastMx = -9999,
      lastMy = -9999;
    let ripples: { x: number; y: number; t: number }[] = [];
    let cols = 0,
      rows = 0;
    let basePoints: Float32Array;
    let points: Float32Array;

    const isDark = () => document.documentElement.classList.contains("dark");

    let currentBg = isDark() ? [...DARK_BG] : [...LIGHT_BG];
    let targetBg = [...currentBg];
    let currentAlpha = isDark() ? 0.08 : 0.1;
    let targetAlpha = currentAlpha;
    let currentLine: number[] = isDark() ? [...DARK_LINE] : [...LIGHT_LINE];
    let targetLine: number[] = [...currentLine];
    let themeProgress = 1;

    const updateRect = () => {
      const r = section.getBoundingClientRect();
      rectRef.current = { left: r.left, top: r.top };
    };

    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect, { passive: true });

    const themeObserver = new MutationObserver(() => {
      const dark = isDark();
      targetBg = dark ? [...DARK_BG] : [...LIGHT_BG];
      targetAlpha = dark ? 0.08 : 0.1;
      targetLine = dark ? [...DARK_LINE] : [...LIGHT_LINE];
      themeProgress = 0;
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.01 },
    );
    intersectionObserver.observe(section);

    const resize = () => {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;

      ctx.fillStyle = `rgb(${Math.round(currentBg[0])},${Math.round(currentBg[1])},${Math.round(currentBg[2])})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      updateRect();

      cols = Math.ceil(canvas.width / GRID) + 2;
      rows = Math.ceil(canvas.height / GRID) + 2;

      const total = cols * rows * 2;
      basePoints = new Float32Array(total);
      points = new Float32Array(total);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = (r * cols + c) * 2;
          basePoints[i] = c * GRID - GRID;
          basePoints[i + 1] = r * GRID - GRID;
        }
      }
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 50);
    };

    const resizeObserver = new ResizeObserver(debouncedResize);
    resizeObserver.observe(section);
    resize();

    let mouseDirty = false;
    let pendingMx = -999,
      pendingMy = -999;

    const onMove = (e: MouseEvent) => {
      pendingMx = e.clientX - rectRef.current.left;
      pendingMy = e.clientY - rectRef.current.top;
      mouseDirty = true;
    };

    const onLeave = () => {
      pendingMx = -999;
      pendingMy = -999;
      mouseDirty = true;
    };

    const onClick = (e: MouseEvent) => {
      if (ripples.length > 5) ripples.shift();
      ripples.push({
        x: e.clientX - rectRef.current.left,
        y: e.clientY - rectRef.current.top,
        t: 0,
      });
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    section.addEventListener("click", onClick);

    function getDisplace(bx: number, by: number) {
      let ox = 0,
        oy = 0;

      const dx = bx - mx;
      const dy = by - my;
      const distSq = dx * dx + dy * dy;

      if (distSq < RADIUS * RADIUS) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / RADIUS) * MAX_BULGE;
        const a = Math.atan2(dy, dx);
        ox += Math.cos(a) * force;
        oy += Math.sin(a) * force;
      }

      for (let i = 0; i < ripples.length; i++) {
        const rp = ripples[i];
        const rdx = bx - rp.x;
        const rdy = by - rp.y;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        const wave = rp.t * 380;
        const diff = Math.abs(rdist - wave);

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
      if (!isVisible) {
        animId = requestAnimationFrame(draw);
        return;
      }

      if (mouseDirty) {
        mx = pendingMx;
        my = pendingMy;
        mouseDirty = false;
      }

      const transitioning = themeProgress < 1;
      const mouseMoved = mx !== lastMx || my !== lastMy;
      const hasRipples = ripples.length > 0;

      if (!transitioning && !mouseMoved && !hasRipples) {
        animId = requestAnimationFrame(draw);
        return;
      }

      if (transitioning) {
        themeProgress = Math.min(1, themeProgress + THEME_SPEED);
        const ease = 1 - Math.pow(1 - themeProgress, 3);

        currentBg[0] = lerp(currentBg[0], targetBg[0], ease);
        currentBg[1] = lerp(currentBg[1], targetBg[1], ease);
        currentBg[2] = lerp(currentBg[2], targetBg[2], ease);
        currentAlpha = lerp(currentAlpha, targetAlpha, ease);
        currentLine[0] = lerp(currentLine[0], targetLine[0], ease);
        currentLine[1] = lerp(currentLine[1], targetLine[1], ease);
        currentLine[2] = lerp(currentLine[2], targetLine[2], ease);
      }

      lastMx = mx;
      lastMy = my;

      ctx.fillStyle = `rgb(${Math.round(currentBg[0])},${Math.round(currentBg[1])},${Math.round(currentBg[2])})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ripples = ripples.filter((r) => r.t < 1);
      for (let i = 0; i < ripples.length; i++) ripples[i].t += 0.018;

      for (let i = 0; i < basePoints.length; i += 2) {
        const bx = basePoints[i];
        const by = basePoints[i + 1];
        const { ox, oy } = getDisplace(bx, by);
        points[i] = bx + ox;
        points[i + 1] = by + oy;
      }

      ctx.strokeStyle = `rgba(${Math.round(currentLine[0])},${Math.round(currentLine[1])},${Math.round(currentLine[2])},${currentAlpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let r = 0; r < rows; r++) {
        let i = r * cols * 2;
        ctx.moveTo(points[i], points[i + 1]);
        for (let c = 1; c < cols; c++) {
          i = (r * cols + c) * 2;
          ctx.lineTo(points[i], points[i + 1]);
        }
      }

      for (let c = 0; c < cols; c++) {
        let i = c * 2;
        ctx.moveTo(points[i], points[i + 1]);
        for (let r = 1; r < rows; r++) {
          i = (r * cols + c) * 2;
          ctx.lineTo(points[i], points[i + 1]);
        }
      }

      ctx.stroke();
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      section.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center overflow-hidden bg-white dark:bg-primary pt-20 pb-16 md:pt-24 md:pb-20"
      aria-label="Hero section"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ willChange: "transform" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center w-full">
        <div className="space-y-6">
          <div
            className="inline-flex items-center gap-2 text-primary dark:text-white text-xs sm:text-sm font-semibold"
            aria-label="Badge tagline"
          >
            <span
              className="w-2 h-2 ring-2 rounded-full bg-primary dark:bg-white dark:ring-white/60"
              aria-hidden="true"
            />
            {t("hero.badge")}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-6xl dark:text-white font-bold leading-[1.1] text-gray-900 tracking-tight">
            {t("hero.title1")}
            <br />
            <span className="text-gray-400 font-bold">{t("hero.title2")}</span>
          </h1>

          <p className="text-gray-500 dark:text-gray-300 text-base sm:text-lg leading-snug max-w-md">
            {t("hero.desc")}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-primary dark:bg-white text-white dark:text-black font-semibold px-6 py-3 rounded-full hover:bg-blue-800 transition-all hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label={t("hero.cta1") as string}
            >
              {t("hero.cta1")}
            </a>

            <a
              href="#services"
              className="text-gray-700 font-semibold hover:text-blue-600 dark:text-white dark:hover:text-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
              aria-label={t("hero.cta2") as string}
            >
              {t("hero.cta2")}
            </a>
          </div>
        </div>
        <div className="relative w-full max-w-[340px] mx-auto lg:ml-auto mt-4 lg:mt-0">
          <div className="pt-8 pb-8 lg:pt-10 lg:pb-10">
            <div className="relative w-full h-[240px] sm:h-[300px] lg:h-[420px] rounded-3xl overflow-hidden ring-1 ring-blue-800/20 shadow-lg shadow-blue-200">
              <Image
                src="/bg.webp"
                alt="InersiaDev — tampilan proyek web yang telah dikerjakan"
                fill
                sizes="(max-width: 640px) 320px, (max-width: 1024px) 340px, 420px"
                className="object-cover"
                priority
                loading="eager"
                quality={75}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/20"
                aria-hidden="true"
              />
            </div>

            <div
              className="flex absolute top-0 left-0 lg:-top-2 lg:-left-10 z-20 bg-white rounded-xl px-4 py-3 items-center gap-3 shadow-md"
              aria-label={`${t("hero.card1.title")} — ${t("hero.card1.sub")}`}
            >
              <div
                className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm shrink-0"
                aria-hidden="true"
              >
                <Circle size={10} fill="currentColor" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-800 whitespace-nowrap">
                  {t("hero.card1.title")}
                </p>
                <p className="text-gray-500 text-xs">{t("hero.card1.sub")}</p>
              </div>
            </div>

            <div
              className="flex absolute bottom-0 right-0 lg:-bottom-2 lg:-right-10 z-20 bg-white rounded-xl px-4 py-3 items-center gap-3 shadow-md"
              aria-label={t("hero.card2.title") as string}
            >
              <div
                className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm shrink-0"
                aria-hidden="true"
              >
                <ArrowUpRight size={16} />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-800 whitespace-nowrap">
                  {t("hero.card2.title")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
