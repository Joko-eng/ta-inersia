"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLang } from "./LanguageContext";

export default function TrackingCTA() {
  const router = useRouter();
  const { t } = useLang();

  return (
    <section
      id="monitoring"
      className="relative overflow-hidden py-20 bg-primary/5 dark:bg-primary scroll-mt-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.08]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-white/10 border border-primary/20 dark:border-white/20 rounded-full px-4 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-white" />
          <span className="text-primary dark:text-white text-xs font-semibold">
            {t("tracking.badge")}
          </span>
        </div>

        <h2 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
          {t("tracking.title1")}{" "}
          <span className="text-primary dark:text-white/80">
            {t("tracking.title2")}
          </span>
        </h2>

        <p className="text-gray-500 dark:text-white/60 text-[15px] leading-relaxed max-w-md mx-auto mb-10">
          {t("tracking.desc")}
        </p>

        <button
          onClick={() => router.push("/monitoring")}
          className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 dark:bg-white dark:text-primary dark:hover:bg-white/90 text-white font-semibold text-[15px] px-8 py-4 rounded-2xl transition-all hover:-translate-y-0.5"
        >
          {t("tracking.btn")}
          <span className="w-7 h-7 bg-white/20 dark:bg-primary/10 rounded-lg flex items-center justify-center">
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>

        <div className="flex items-center justify-center gap-8 mt-10">
          {[
            t("tracking.feature1"),
            t("tracking.feature2"),
            t("tracking.feature3"),
          ].map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/50 font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 dark:bg-white/40" />
              {f}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
