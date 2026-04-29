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
import { Check, Infinity } from "lucide-react";

const packages = [
  {
    name: "Starter",
    tagline: "Untuk usaha & UMKM yang baru go digital",
    price: "3.500k",
    period: "estimasi mulai dari",
    highlight: false,
    badge: null,
    features: [
      "Website company profile (3–5 halaman)",
      "1 integrasi API sederhana",
      "Hosting 1 tahun",
      "Maintenance Basic 3 bulan",
      "Dokumentasi ringkas",
    ],
    cta: "Mulai Sekarang",
  },
  {
    name: "Growth",
    tagline: "Untuk startup & bisnis yang siap berkembang",
    price: "12.000k",
    period: "estimasi mulai dari",
    highlight: true,
    badge: "Paling Populer",
    features: [
      "Website / Mobile App (medium complexity)",
      "Hingga 5 fitur custom",
      "Integrasi API & keamanan dasar",
      "Hosting + Maintenance Pro 6 bulan",
      "Dokumentasi Teknis lengkap",
      "Konsultasi teknis bulanan",
    ],
    cta: "Pilih Growth",
  },
  {
    name: "Enterprise",
    tagline: "Untuk perusahaan dengan kebutuhan kompleks",
    price: "Custom",
    period: "hubungi kami untuk estimasi",
    highlight: false,
    badge: null,
    features: [
      "Full-stack Web + Mobile App",
      "Machine Learning / IoT integration",
      "Infrastruktur & deployment penuh",
      "Maintenance Pro ongoing",
      "Dokumentasi API & buku panduan",
      "Dedicated support & SLA",
    ],
    cta: "Hubungi Kami",
  },
];

const infraServices = [
  {
    name: "Inersia Hosting",
    price: "150k/bln",
    desc: "Hosting stabil dan cepat",
  },
  {
    name: "Maintenance Basic",
    price: "75k/bln",
    desc: "Bug fix & uptime monitoring",
  },
  {
    name: "Maintenance Pro",
    price: "150k/bln",
    desc: "Update konten, bug fix, konsultasi bulanan",
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="min-h-screen flex flex-col items-center py-20 px-4 gap-20 bg-white dark:bg-primary"
    >
      <div className="w-full max-w-4xl flex flex-col items-center gap-10">
        <div className="text-center">
          <p className="text-xs font-semibold text-primary dark:text-white uppercase tracking-widest mb-2">
            Paket Layanan
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-white tracking-tight mb-3">
            Plans that grow with you
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-5 w-full">
          {packages.map((pkg) => (
            <Card
              key={pkg.name}
              className={`flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative ${
                pkg.highlight
                  ? "bg-primary dark:bg-white text-primary-foreground border-primary shadow-xl shadow-primary/40"
                  : "bg-gray-100 dark:bg-white/5 backdrop-blur-md border-white/60 dark:border-zinc-700/60 shadow-md"
              }`}
            >
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-amber-400 text-amber-900 border-amber-300 font-semibold text-[11px] px-3 shadow-md">
                    {pkg.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="pt-5 pb-2 px-4">
                <CardTitle
                  className={`text-sm font-bold ${pkg.highlight ? "text-primary-foreground" : ""}`}
                >
                  {pkg.name}
                </CardTitle>
                <CardDescription
                  className={`text-xs leading-relaxed ${pkg.highlight ? "text-primary-foreground/65" : ""}`}
                >
                  {pkg.tagline}
                </CardDescription>
                <div className="pt-2">
                  <p
                    className={`text-[10px] font-medium uppercase tracking-wider ${pkg.highlight ? "text-primary-foreground/50" : "text-muted-foreground"}`}
                  >
                    {pkg.period}
                  </p>
                  <p
                    className={`text-2xl font-extrabold tracking-tight ${pkg.highlight ? "text-primary-foreground" : "text-foreground"}`}
                  >
                    {pkg.price === "Custom" ? "Custom" : `Rp ${pkg.price}`}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-2 flex-1 px-4">
                <Separator
                  className={pkg.highlight ? "bg-primary-foreground/20" : ""}
                />
                <ul className="flex flex-col gap-1.5">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check
                        size={12}
                        className={`mt-0.5 shrink-0 ${pkg.highlight ? "text-primary-foreground/80 dark:text-primary" : "text-primary dark:text-white"}`}
                      />
                      <span
                        className={`text-xs leading-relaxed ${pkg.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-2 px-4 pb-4">
                <Button
                  className={`w-full font-semibold ${
                    pkg.highlight
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/10 border-white/30 dark:bg-white dark:border-zinc-700/30 dark:hover:bg-white/80 dark:hover:text-primary"
                  }`}
                  variant={pkg.highlight ? "default" : "outline"}
                >
                  {pkg.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card className="bg-gray-100 backdrop-blur-md border-white/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-primary flex items-center gap-2">
              <Infinity /> Infrastruktur & Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {infraServices.map((s) => (
              <div
                key={s.name}
                className="flex flex-col gap-1 p-3 rounded-lg bg-primary border border-border/40"
              >
                <p className="text-xs font-semibold text-white">{s.name}</p>
                <p className="text-base font-extrabold text-white">
                  Rp {s.price}
                </p>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="w-full max-w-5xl bg-white/15 backdrop-blur-md border-white/30 text-center">
          <CardHeader>
            <CardTitle className="text-primary dark:text-white text-2xl font-bold tracking-tight">
              Belum yakin mana yang tepat?
            </CardTitle>
            <CardDescription className="text-primary/70 dark:text-white/70 max-w-sm mx-auto text-sm">
              Konsultasikan kebutuhan proyek Anda — kami bantu estimasi biaya
              secara gratis.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3 justify-center flex-wrap pt-0">
            <Button className="bg-white text-primary hover:bg-white/90 font-semibold">
              Hubungi Kami
            </Button>
            <Button className="border-white/30 text-white">
              Lihat Portfolio
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
