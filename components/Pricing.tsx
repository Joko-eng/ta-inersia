"use client";

import { useLang } from "@/components/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";

const packages = [
  {
    nameKey: "pricing.starter.name",
    taglineKey: "pricing.starter.tagline",
    price: "999.000",
    originalPrice: "1.199.000",
    priceLabel: null,
    periodKey: "pricing.period.from",
    highlight: false,
    badge: null,
    features: [
      "pricing.starter.f1",
      // "pricing.starter.f2",
      "pricing.starter.f3",
      "pricing.starter.f4",
      "pricing.starter.f5",
      "pricing.starter.f6",
    ],
    ctaKey: "pricing.starter.cta",
  },
  {
    nameKey: "pricing.growth.name",
    taglineKey: "pricing.growth.tagline",
    price: "1.299.000",
    originalPrice: "1.599.000",
    priceLabel: null,
    periodKey: "pricing.period.from",
    highlight: true,
    badge: "pricing.badge.popular",
    features: [
      "pricing.growth.f1",
      "pricing.growth.f2",
      "pricing.growth.f3",
      "pricing.growth.f4",
      "pricing.growth.f5",
      "pricing.growth.f6",
      "pricing.growth.f7",
      "pricing.growth.f8",
    ],
    ctaKey: "pricing.growth.cta",
  },
  {
    nameKey: "pricing.enterprise.name",
    taglineKey: "pricing.enterprise.tagline",
    price: null,
    originalPrice: null,
    priceLabel: "pricing.enterprise.price",
    periodKey: "pricing.period.contact",
    highlight: false,
    badge: null,
    features: [
      "pricing.enterprise.f1",
      "pricing.enterprise.f2",
      "pricing.enterprise.f3",
      "pricing.enterprise.f4",
      "pricing.enterprise.f5",
      "pricing.enterprise.f6",
      "pricing.enterprise.f7",
      "pricing.enterprise.f8",
    ],
    ctaKey: "pricing.enterprise.cta",
  },
];

function PriceText({
  value,
  sizeRem = 1.6,
}: {
  value: string;
  sizeRem?: number;
}) {
  const lastDot = value.lastIndexOf(".");
  const mainPart = lastDot !== -1 ? value.slice(0, lastDot) : value;
  const trailingZeros = lastDot !== -1 ? value.slice(lastDot) : "";

  return (
    <span
      style={{
        fontSize: `${sizeRem}rem`,
        fontWeight: 800,
        letterSpacing: "-0.01em",
      }}
    >
      <sup
        style={{
          fontSize: "0.6em",
          fontWeight: 700,
          verticalAlign: "0.35em",
          letterSpacing: "0.02em",
          marginRight: "0.2em",
        }}
      >
        Rp
      </sup>
      {mainPart}
      {trailingZeros && (
        <span style={{ fontSize: "0.65em", verticalAlign: "0.05em" }}>
          {trailingZeros}
        </span>
      )}
    </span>
  );
}

/**
 * If `label` is provided → render plain text (Enterprise).
 * Otherwise → render strikethrough originalPrice + discounted price.
 */
function RupiahPrice({
  value,
  originalPrice,
  highlight,
  label,
}: {
  value?: string | null;
  originalPrice?: string | null;
  highlight: boolean;
  label?: string | null;
}) {
  const priceClass = highlight
    ? "text-white dark:text-primary"
    : "text-gray-900 dark:text-white";

  if (label) {
    return (
      <p
        className={`text-2xl font-extrabold tracking-tight ${priceClass}`}
        style={{ marginTop: "4px" }}
      >
        {label}
      </p>
    );
  }

  if (!value) return null;

  return (
    <div className="flex flex-col gap-0.5" style={{ marginTop: "4px" }}>
      {originalPrice && (
        <p
          className="leading-none text-yellow-400 dark:text-red-400"
          style={{
            fontSize: "0.8rem",
            fontWeight: 500,
            textDecoration: "line-through",
            textDecorationThickness: "1.5px",
            textDecorationColor: "currentColor",
          }}
        >
          <PriceText value={originalPrice} sizeRem={0.8} />
        </p>
      )}
      <p className={`leading-none ${priceClass}`}>
        <PriceText value={value} sizeRem={1.6} />
      </p>
    </div>
  );
}

export default function Pricing() {
  const { t } = useLang();

  return (
    <section
      id="pricing"
      className="flex flex-col items-center py-12 md:py-20 px-4 gap-10 md:gap-20 bg-white dark:bg-primary"
    >
      <div className="w-full max-w-4xl flex flex-col items-center gap-10">
        <div className="text-center">
          <p className="text-xs font-semibold text-primary dark:text-blue-300 uppercase tracking-widest mb-2">
            {t("pricing.section.label")}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white tracking-tight mb-3">
            {t("pricing.section.title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          {packages.map((pkg) => (
            <Card
              key={pkg.nameKey}
              className={`flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative ${
                pkg.highlight
                  ? "bg-primary dark:bg-white text-primary-foreground border-primary shadow-xl shadow-primary/40"
                  : "bg-gray-100 dark:bg-white/5 backdrop-blur-md border-white/60 dark:border-zinc-700/60 shadow-md"
              }`}
            >
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-amber-400 text-amber-900 border-amber-300 font-semibold text-[11px] px-3 shadow-md">
                    {t(pkg.badge)}
                  </Badge>
                </div>
              )}

              <CardHeader className="pt-5 pb-2 px-4">
                <CardTitle
                  className={`text-sm font-bold ${
                    pkg.highlight
                      ? "text-white dark:text-primary"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {t(pkg.nameKey)}
                </CardTitle>
                <CardDescription
                  className={`text-xs leading-relaxed ${
                    pkg.highlight
                      ? "text-blue-100 dark:text-gray-700"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {t(pkg.taglineKey)}
                </CardDescription>
                <div className="pt-2">
                  <p
                    className={`text-xs font-medium uppercase tracking-wider ${
                      pkg.highlight
                        ? "text-blue-200 dark:text-gray-500"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {t(pkg.periodKey)}
                  </p>
                  <RupiahPrice
                    value={pkg.price}
                    originalPrice={pkg.originalPrice}
                    highlight={pkg.highlight}
                    label={pkg.priceLabel ? String(t(pkg.priceLabel)) : null}
                  />
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-2 flex-1 px-4">
                <Separator
                  className={
                    pkg.highlight ? "bg-white/30 dark:bg-primary/20" : ""
                  }
                />
                <ul className="flex flex-col gap-1.5">
                  {pkg.features.map((fKey) => (
                    <li key={fKey} className="flex items-start gap-2">
                      <Check
                        size={12}
                        aria-hidden="true"
                        className={`mt-0.5 shrink-0 ${
                          pkg.highlight
                            ? "text-blue-200 dark:text-primary"
                            : "text-primary dark:text-blue-400"
                        }`}
                      />
                      <span
                        className={`text-xs leading-relaxed ${
                          pkg.highlight
                            ? "text-blue-100 dark:text-gray-700"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {t(fKey)}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-2 px-4 pb-4">
                <Button
                  className={`w-full font-semibold ${
                    pkg.highlight
                      ? "bg-white text-primary dark:bg-primary dark:text-white hover:bg-white/90"
                      : "bg-primary text-white hover:bg-primary/90 hover:text-white border-white/30 dark:bg-white dark:text-primary dark:border-zinc-700/30 dark:hover:bg-white/80"
                  }`}
                  variant={pkg.highlight ? "default" : "outline"}
                  aria-label={`${String(t(pkg.ctaKey))} - Paket ${String(t(pkg.nameKey))}`}
                >
                  {t(pkg.ctaKey)}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <Card className="w-full max-w-5xl bg-white/15 backdrop-blur-md border-white/30 text-center">
          <CardHeader>
            <CardTitle className="text-primary dark:text-white text-2xl font-bold tracking-tight">
              {t("pricing.cta.title")}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto text-sm">
              {t("pricing.cta.desc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3 justify-center flex-wrap pt-0">
            <Button
              className="bg-primary text-white hover:bg-primary/90 font-semibold dark:bg-white dark:text-primary dark:hover:bg-white/90"
              aria-label={String(t("pricing.cta.contact.aria"))}
            >
              {t("pricing.cta.contact")}
            </Button>
            <Button
              variant="ghost"
              className="border border-primary/40 text-primary hover:bg-primary/5 hover:text-primary dark:border-white/40 dark:text-white dark:hover:bg-white/10 dark:hover:text-white font-semibold"
              aria-label={String(t("pricing.cta.portfolio.aria"))}
            >
              {t("pricing.cta.portfolio")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
