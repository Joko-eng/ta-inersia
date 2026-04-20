"use client";

import { useLang } from "./LanguageContext";

export default function ContactCTA() {
  const { t } = useLang();

  return (
    <section
      id="contact"
      className="bg-white dark:bg-primary py-24 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-800 rounded-full blur-3xl opacity-30" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight text-gray-900 dark:text-white">
          {t("cta.title1")}
          <br />
          <span className="text-gray-400 dark:text-blue-400">
            {t("cta.title2")}
          </span>
        </h2>
        <p className=" text-gray-600 dark:text-blue-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          {t("cta.desc")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:inersiadevindonesia@gmail.com"
            className="inline-flex items-center gap-2 bg-primary dark:bg-blue-600 text-primary text-white dark:text-white font-bold px-8 py-4 rounded-full hover:bg-primary dark:hover:bg-blue-500 transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            {t("cta.btn1")}
          </a>
          <a
            href="#services"
            className="text-gray dark:text-white font-semibold hover:text-blue-200 transition-colors"
          >
            {t("cta.btn2")}
          </a>
        </div>
      </div>
    </section>
  );
}
