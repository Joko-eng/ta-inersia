"use client";

import Image from "next/image";
import { useLang } from "./LanguageContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLang();

  const navLinks = [
    t("footer.nav.about"),
    t("footer.nav.services"),
    t("footer.nav.pricing"),
    t("footer.nav.portfolio"),
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
                  alt="logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                InersiaDev
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              {t("footer.desc")}
            </p>
            <p className="text-sm">
              <a
                href="mailto:inersiadevindonesia@gmail.com"
                className="hover:text-white transition-colors"
              >
                inersiadevindonesia@gmail.com
              </a>
            </p>
            <p className="text-sm">📍 Banyuwangi, Indonesia</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">
              {t("footer.nav")}
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="mailto:inersiadevindonesia@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  ✉ inersiadevindonesia@gmail.com
                </a>
              </li>
              <li>📍 Banyuwangi, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>
            © {year} InersiaDev. {t("footer.rights")}
          </p>
          <div className="flex gap-6">
            {[t("footer.privacy"), t("footer.terms"), t("footer.cookie")].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  {item}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
