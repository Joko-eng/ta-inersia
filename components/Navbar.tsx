"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLang } from "./LanguageContext";
import { Button } from "./ui/button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const { lang, setLang, t } = useLang();
  const FLAGS = {
    en: "🇺🇸",
    id: "🇮🇩",
  };
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");
  const toggleLang = () => setLang(lang === "en" ? "id" : "en");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t("nav.services"), href: "#services" },
    { label: t("nav.pricing"), href: "#pricing" },
    { label: t("nav.portfolio"), href: "#portfolio" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.tracking"), href: "#tracking" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white dark:bg-primary shadow-xl py-3"
          : "bg-white/80 dark:bg-primary backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
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
          <span className="text-lg font-bold dark:text-white tracking-tight text-gray-900">
            InersiaDev
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 dark:text-white hover:text-blue-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {!mounted ? (
              <span className="h-5 w-5" /> // placeholder, ukuran sama
            ) : isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <div className="hidden md:block ml-1">
            <a
              href="#contact"
              className="bg-primary dark:bg-white text-white dark:text-black text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors"
            >
              {t("nav.contact")}
            </a>
          </div>
          <button
            onClick={toggleLang}
            className="text-lg px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            aria-label="Toggle language"
          >
            {lang === "en" ? FLAGS.id : FLAGS.en}
          </button>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-gray-700 dark:bg-white mb-1.5" />
          <div className="w-5 h-0.5 bg-gray-700 dark:bg-white mb-1.5" />
          <div className="w-5 h-0.5 bg-gray-700 dark:bg-white" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-primary border-t border-gray-100 dark:border-white/10 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="block w-full text-center bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full"
          >
            {t("nav.contact")}
          </a>
        </div>
      )}
    </nav>
  );
}
