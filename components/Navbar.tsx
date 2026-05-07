"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
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
  const FLAGS = { en: "🇺🇸", id: "🇮🇩" };
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");
  const toggleLang = () => setLang(lang === "en" ? "id" : "en");

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { label: t("nav.services"), href: "#services" },
    { label: t("nav.pricing"), href: "#pricing" },
    { label: t("nav.portfolio"), href: "#portfolio" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.monitoring"), href: "#monitoring" },
  ];

  const handleNavClick = () => setMenuOpen(false);

  return (
    <>
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
              {mounted ? (
                <Image
                  src={isDark ? "/logo-dark.png" : "/logo.png"}
                  alt="logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              )}
            </div>
            <span className="text-lg font-bold dark:text-white tracking-tight text-gray-900">
              InersiaDev
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {!mounted ? (
                <span className="h-5 w-5" />
              ) : isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="text-lg px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
              aria-label="Toggle language"
            >
              {lang === "en" ? FLAGS.id : FLAGS.en}
            </button>

            {/* Desktop Contact Button */}
            <div className="hidden md:block ml-1">
              <a
                href="#contact"
                className="bg-primary dark:bg-white text-white dark:text-black text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-blue-700 dark:hover:bg-zinc-100 transition-colors"
              >
                {t("nav.contact")}
              </a>
            </div>

            {/* Hamburger — kanan sendiri di mobile */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ml-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5 text-gray-700 dark:text-white" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700 dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" />
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 md:hidden bg-white dark:bg-primary shadow-2xl transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/10">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Menu
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-gray-700 dark:text-white" />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="px-6 py-6 space-y-1">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              style={{
                transitionDelay: menuOpen ? `${index * 50}ms` : "0ms",
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300 ${
                menuOpen
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-4"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Drawer Footer - Contact Button */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-6 border-t border-gray-100 dark:border-white/10">
          <a
            href="#contact"
            onClick={handleNavClick}
            className="block w-full text-center bg-primary dark:bg-white text-white dark:text-black text-sm font-semibold px-5 py-3 rounded-full hover:bg-blue-700 dark:hover:bg-zinc-100 transition-colors"
          >
            {t("nav.contact")}
          </a>
        </div>
      </div>
    </>
  );
}
