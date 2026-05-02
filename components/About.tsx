"use client";

import { Check } from "lucide-react";
import { useLang } from "./LanguageContext";

export default function About() {
  const { t } = useLang();

  return (
    <section id="about" className="bg-white dark:bg-primary pt-8 py-25">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {t("about.title1")}
          </h2>
          <h2 className="text-4xl font-extrabold text-primary dark:text-blue-400 tracking-tight">
            {t("about.title2")}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* <div className="relative w-full h-[300px] rounded-3xl overflow-hidden shadow-lg">
            <Image
              src="/"
              alt="InersiaDev Team"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div> */}

          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
              {t("about.desc")}
            </p>

            <ul className="space-y-3">
              {[
                t("about.li1"),
                t("about.li2"),
                t("about.li3"),
                t("about.li4"),
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-blue-600 dark:text-white" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-primary dark:bg-white dark:text-black text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 text-sm mt-2"
            >
              {t("about.cta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
