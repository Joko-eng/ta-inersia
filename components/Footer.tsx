"use client";

import Image from "next/image";
import { useLang } from "./LanguageContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLang();

  const navLinks = [
    { id: "about", label: t("footer.nav.about") },
    { id: "services", label: t("footer.nav.services") },
    { id: "pricing", label: t("footer.nav.pricing") },
    { id: "portfolio", label: t("footer.nav.portfolio") },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-primary text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="InersiaDev logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                InersiaDev
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-gray-300">
              {t("footer.desc")}
            </p>
            <p className="text-sm">
              <a
                href="mailto:inersiadevindonesia@gmail.com"
                className="text-gray-300 hover:text-white transition-colors"
              >
                inersiadevindonesia@gmail.com
              </a>
            </p>
            <p className="text-sm text-gray-300">
              <span aria-hidden="true">📍</span>
              <span className="sr-only">Lokasi:</span> Banyuwangi, Indonesia
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">
              {t("footer.nav")}
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">
              {t("footer.contact")}
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <a
                  href="mailto:inersiadevindonesia@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  <span aria-hidden="true">✉ </span>
                  inersiadevindonesia@gmail.com
                </a>
              </li>
              <li>
                <span aria-hidden="true">📍 </span>
                <span className="sr-only">Lokasi: </span>
                Banyuwangi, Indonesia
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            © {year} InersiaDev. {t("footer.rights")}
          </p>
          <div className="flex gap-6">
            {[
              { id: "privacy", label: t("footer.privacy") },
              { id: "terms", label: t("footer.terms") },
              { id: "cookie", label: t("footer.cookie") },
            ].map(({ id, label }) => (
              <a
                key={id}
                href="#"
                className="hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
