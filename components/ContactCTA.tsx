"use client";

import { Mail, MessageCircle } from "lucide-react";
import { useLang } from "./LanguageContext";
import { Card, CardContent } from "./ui/card";

export default function ContactCTA() {
  const { t } = useLang();

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-white py-24 dark:bg-primary scroll-mt-20"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-400 opacity-30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-800 opacity-30 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-5xl">
          {t("cta.title1")}
          <br />
          <span className="text-gray-400 dark:text-blue-400">
            {t("cta.title2")}
          </span>
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-blue-100">
          {t("cta.desc")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:inersiadevindonesia@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-72"
          >
            <Card className="border border-gray-200 dark:border-blue-800 hover:border-primary dark:hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer bg-white dark:bg-blue-950/40 h-full">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 dark:bg-blue-600/20 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary dark:text-blue-400" />
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    Email
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-blue-200 mb-3 leading-relaxed text-left">
                  {t("cta.email.desc")}
                </p>
                <p className="text-sm font-medium text-primary dark:text-blue-400 underline underline-offset-2 text-left">
                  inersiadevindonesia@gmail.com
                </p>
              </CardContent>
            </Card>
          </a>
          <a
            href="https://wa.me/6285185115917?text=Halo%20tim%20Inersia%20Dev%21%20Saya%20ingin%20konsultasi%20mengenai%20pengembangan%20digital%20untuk%20bisnis%20saya."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-72"
          >
            <Card className="border border-gray-200 dark:border-blue-800 hover:border-green-500 dark:hover:border-green-400 hover:shadow-lg transition-all duration-200 cursor-pointer bg-white dark:bg-blue-950/40 h-full">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-600/20 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    WhatsApp
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-blue-200 mb-3 leading-relaxed text-left">
                  {t("cta.whatsapp.desc")}
                </p>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 underline underline-offset-2 text-left">
                  +62 851-8511-5917
                </p>
              </CardContent>
            </Card>
          </a>
        </div>
      </div>
    </section>
  );
}
