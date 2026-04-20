"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white dark:bg-primary shadow-md py-3"
          : "bg-white/90 dark:bg-primary backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
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
          {["Services", "Pricing", "Portfolio", "About US"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium text-gray-600 dark:text-white hover:text-blue-600 transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <div className="hidden md:block">
            <a
              href="#contact"
              className="bg-primary dark:bg-white text-white dark:text-black text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-gray-700 mb-1.5" />
          <div className="w-5 h-0.5 bg-gray-700 mb-1.5" />
          <div className="w-5 h-0.5 bg-gray-700" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          {["About US", "Services", "Pricing", "Project"].map((link) => (
            <a
              key={link}
              href="#"
              className="block text-sm font-medium text-gray-700"
            >
              {link}
            </a>
          ))}
          <a
            href="#contact"
            className="block w-full text-center bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full"
          >
            Contact Us
          </a>
        </div>
      )}
    </nav>
  );
}
