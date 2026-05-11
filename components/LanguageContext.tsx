"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type Lang = "en" | "id";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string | string[];
}

const translations: Record<string, Record<Lang, string>> = {
  "nav.services": { en: "Services", id: "Layanan" },
  "nav.pricing": { en: "Pricing", id: "Harga" },
  "nav.portfolio": { en: "Portfolio", id: "Portofolio" },
  "nav.about": { en: "About Us", id: "Tentang Kami" },
  "nav.contact": { en: "Contact Us", id: "Hubungi Kami" },
  "nav.monitoring": { en: "Monitoring", id: "Pemantauan" },

  // Hero
  "hero.badge": {
    en: "InersiaDev — Digital Solutions for Growing Businesses",
    id: "InersiaDev — Solusi Digital Untuk Pertumbuhan Bisnis",
  },
  "hero.title1": {
    en: "Build Strong Digital Presence",
    id: "Bangun Kehadiran Digital yang Kuat",
  },
  "hero.title2": {
    en: "That Drives Real Business Growth",
    id: "Mendorong Pertumbuhan Bisnis",
  },
  "hero.desc": {
    en: "We develop websites, design, and digital systems that enhance credibility, attract customers, and drive business growth.",
    id: "Kami mengembangkan website, desain, dan sistem digital yang meningkatkan kredibilitas, menarik pelanggan, dan mendorong pertumbuhan bisnis.",
  },
  "hero.cta1": { en: "Start Your Project", id: "Mulai Proyek Anda" },
  "hero.cta2": { en: "Explore Our Services", id: "Lihat Layanan Kami" },
  "hero.card1.title": { en: "Web Developer", id: "Pengembang Web" },
  "hero.card1.sub": { en: "Consistent & scalable", id: "Konsisten & skalabel" },
  "hero.card2.title": { en: "Product Strategy", id: "Strategi Produk" },

  "why.title": {
    en: "Why Businesses Choose InersiaDev",
    id: "Mengapa Bisnis Memilih InersiaDev",
  },
  "why.sub": {
    en: "We deliver technology solutions designed to scale with your business goals.",
    id: "Kami menghadirkan solusi teknologi yang dirancang untuk berkembang bersama tujuan bisnis Anda.",
  },
  "why.f1.title": { en: "Website Development", id: "Pengembangan Website" },
  "why.f1.desc": {
    en: "From company profiles and landing pages to complex systems with API integration and security.",
    id: "Dari profil perusahaan dan halaman beranda hingga sistem kompleks dengan integrasi API dan keamanan.",
  },
  "why.f2.title": { en: "Mobile Development", id: "Pengembangan Mobile" },
  "why.f2.desc": {
    en: "Android and iOS applications built from UI layers to full deployment with optimized performance.",
    id: "Aplikasi Android dan iOS yang dibangun dari layer UI hingga produksi penuh dengan performa optimal.",
  },
  "why.f3.title": { en: "Machine Learning", id: "Machine Learning" },
  "why.f3.desc": {
    en: "End-to-end AI solutions covering data collection, preprocessing, model research, and inference APIs.",
    id: "Solusi AI end-to-end mencakup pengumpulan data, preprocessing, riset model, dan inference API.",
  },
  "why.f4.title": { en: "IoT Solutions", id: "Solusi IoT" },
  "why.f4.desc": {
    en: "Firmware development, hardware integration, and internet-based monitoring dashboards.",
    id: "Pengembangan firmware, integrasi hardware, dan dashboard monitoring berbasis internet.",
  },

  "testi.title": { en: "What Our Clients Say", id: "Apa Kata Klien Kami" },
  "testi.sub": {
    en: "Real stories from businesses we've helped grow.",
    id: "Kisah nyata dari bisnis yang telah kami bantu berkembang.",
  },
  "testi.q1": {
    en: "Working with InersiaDev felt like partnering with an in-house team. Their technical expertise and attention to detail were exceptional.",
    id: "Bekerja dengan InersiaDev terasa seperti bermitra dengan tim internal. Keahlian teknis dan perhatian mereka terhadap detail sangat luar biasa.",
  },
  "testi.q2": {
    en: "The team understood our business goals and delivered a product that was both scalable and easy-to-use. Communication was clear throughout.",
    id: "Tim memahami tujuan bisnis kami dan menghadirkan produk yang skalabel sekaligus mudah digunakan. Komunikasi berjalan lancar dari awal hingga akhir.",
  },
  "testi.q3": {
    en: "From discovery to launch, InersiaDev guided us through every step. Our platform's performance improved dramatically.",
    id: "Dari discovery hingga peluncuran, InersiaDev membimbing kami di setiap langkah. Performa platform kami meningkat secara signifikan.",
  },
  "testi.r1": { en: "Head of Engineering", id: "Kepala Engineering" },
  "testi.r2": { en: "Startup Founder", id: "Pendiri Startup" },
  "testi.r3": { en: "CTO, FinTech Co.", id: "CTO, Perusahaan FinTech" },

  "about.title1": {
    en: "Where Strategy Meets",
    id: "Di Mana Strategi Bertemu",
  },
  "about.title2": { en: "Technology.", id: "Teknologi." },
  "about.desc": {
    en: "Founded in 2025, InersiaDev is a digital technology company focused on building scalable, high-impact solutions for modern businesses. We specialize in website development, mobile applications, machine learning, and IoT systems—designed to solve real operational challenges and drive measurable growth.",
    id: "Didirikan pada 2025, InersiaDev adalah perusahaan teknologi digital yang berfokus pada pembangunan solusi skalabel dan berdampak tinggi untuk bisnis modern. Kami mengkhususkan diri dalam pengembangan website, aplikasi mobile, machine learning, dan sistem IoT—dirancang untuk menyelesaikan tantangan operasional nyata dan mendorong pertumbuhan terukur.",
  },
  "about.li1": {
    en: "End-to-end digital product development",
    id: "Pengembangan produk digital end-to-end",
  },
  "about.li2": {
    en: "Performance, scalability, and reliability focused",
    id: "Fokus pada performa, skalabilitas, dan keandalan",
  },
  "about.li3": {
    en: "Solutions aligned with business goals",
    id: "Solusi yang selaras dengan tujuan bisnis",
  },
  "about.li4": {
    en: "Agile execution with measurable outcomes",
    id: "Eksekusi agile dengan hasil yang terukur",
  },
  "about.cta": { en: "Start a Project", id: "Mulai Proyek" },

  "cta.title1": {
    en: "Turn Ideas Into Scalable",
    id: "Ubah Ide Menjadi Skalabilitas",
  },
  "cta.title2": { en: "Digital Solutions", id: "Solusi Digital" },
  "cta.desc": {
    en: "Let's talk about your project. Our team is ready to help you design, build, and launch your next digital product.",
    id: "Mari diskusikan proyek Anda. Tim kami siap membantu Anda merancang, membangun, dan meluncurkan produk digital berikutnya.",
  },
  "cta.email.desc": {
    en: "Let's build something great together — send us your ideas.",
    id: "Mari bangun sesuatu yang luar biasa bersama — kirimkan ide Anda.",
  },
  "cta.whatsapp.desc": {
    en: "Need a quick answer? We're always here to help.",
    id: "Butuh jawaban cepat? Kami selalu siap membantu.",
  },

  "tracking.badge": { en: "Project Monitoring", id: "Pemantauan Proyek" },
  "tracking.title1": { en: "Stay on top of every", id: "Pantau setiap" },
  "tracking.title2": { en: "project milestone", id: "pencapaian proyek" },
  "tracking.desc": {
    en: "Get a clear view of your project's progress, updates, and delivery timeline — all in one dedicated page.",
    id: "Dapatkan gambaran jelas tentang progres, pembaruan, dan jadwal pengiriman proyek Anda — semua dalam satu halaman.",
  },
  "tracking.btn": { en: "Open Monitoring Page", id: "Buka Halaman Pemantauan" },
  "tracking.feature1": { en: "Progress updates", id: "Pembaruan Progres" },
  "tracking.feature2": { en: "Project timeline", id: "Jadwal Proyek" },
  "tracking.feature3": { en: "Development status", id: "Status Pengembangan" },

  "footer.desc": {
    en: "We develop websites, design, and digital systems that enhance credibility, attract customers, and drive business growth.",
    id: "Kami mengembangkan website, desain, dan sistem digital yang meningkatkan kredibilitas, menarik pelanggan, dan mendorong pertumbuhan bisnis.",
  },
  "footer.nav": { en: "Navigation", id: "Navigasi" },
  "footer.nav.about": { en: "About Us", id: "Tentang Kami" },
  "footer.nav.services": { en: "Services", id: "Layanan" },
  "footer.nav.pricing": { en: "Pricing", id: "Harga" },
  "footer.nav.portfolio": { en: "Portfolio", id: "Portofolio" },
  "footer.contact": { en: "Contact & Location", id: "Kontak & Lokasi" },
  "footer.rights": { en: "All rights reserved.", id: "Hak cipta dilindungi." },
  "footer.privacy": { en: "Privacy Policy", id: "Kebijakan Privasi" },
  "footer.terms": { en: "Terms of Service", id: "Syarat Layanan" },
  "footer.cookie": { en: "Cookie Settings", id: "Pengaturan Cookie" },

  "pricing.section.label": { en: "Service Packages", id: "Paket Layanan" },
  "pricing.section.title": {
    en: "Plans that grow with you",
    id: "Paket yang tumbuh bersama Anda",
  },

  // Badge
  "pricing.badge.popular": { en: "Most Popular", id: "Paling Populer" },

  // Period labels
  "pricing.period.from": { en: "starting from", id: "estimasi mulai dari" },
  "pricing.period.contact": {
    en: "contact us for estimate",
    id: "hubungi kami untuk estimasi",
  },

  // Starter
  "pricing.starter.name": { en: "Starter Website", id: "Starter Website" },
  "pricing.starter.tagline": {
    en: "For new businesses going digital",
    id: "Untuk usaha & UMKM yang baru go digital",
  },
  "pricing.starter.f1": {
    en: "Website 3 pages",
    id: "Website 3 halaman",
  },
  "pricing.starter.f2": {
    en: "1 simple API integration",
    id: "1 integrasi API sederhana",
  },
  "pricing.starter.f3": { en: "3-month hosting", id: "Hosting 3 Bulan" },
  "pricing.starter.f4": {
    en: "Basic maintenance 3 months",
    id: "Pemeliharaan Dasar 3 bulan",
  },
  "pricing.starter.f5": {
    en: "Media Social integration",
    id: "Integrasi Media Sosial",
  },
  "pricing.starter.f6": {
    en: "Free Revision 2 times",
    id: "Bebas Revisi 2 kali",
  },
  "pricing.starter.cta": { en: "Get Started", id: "Mulai Sekarang" },

  // Growth
  "pricing.growth.name": { en: "Growth Website", id: "Growth Website" },
  "pricing.growth.tagline": {
    en: "For startups ready to scale",
    id: "Untuk startup & bisnis yang siap berkembang",
  },
  "pricing.growth.f1": {
    en: "Website  5 page",
    id: "Website  5 halaman",
  },

  "pricing.growth.f2": {
    en: "Integration & Dokumentation API",
    id: "Integrasi & Dokumentasi API",
  },
  "pricing.growth.f3": {
    en: "Hosting 3 months",
    id: "Hosting 3 bulan",
  },
  "pricing.growth.f4": {
    en: "Basic maintenance 3 months",
    id: "Pemeliharaan Dasar 3 bulan",
  },
  "pricing.growth.f6": {
    en: "Brief documentation",
    id: "Dokumentasi ringkas",
  },
  "pricing.growth.f8": {
    en: "Free Revision 3 times",
    id: "Bebas Revisi 3 kali",
  },
  "pricing.growth.f7": {
    en: "Basic Security",
    id: "Keamanan Dasar",
  },
  "pricing.growth.f5": {
    en: "Media Social integration",
    id: "Integrasi Media Sosial",
  },
  "pricing.growth.cta": { en: "Choose Growth", id: "Pilih Growth" },

  // Enterprise
  "pricing.enterprise.name": { en: "Customization", id: "Kustomisasi" },
  "pricing.enterprise.tagline": {
    en: "For companies with complex needs",
    id: "Untuk perusahaan dengan kebutuhan kompleks",
  },
  "pricing.enterprise.f1": { en: "Full-stack Web", id: "Full-stack Web" },
  "pricing.enterprise.f2": { en: "Mobile App", id: "Aplikasi Mobile" },
  "pricing.enterprise.f3": { en: "Machine Learning", id: "Machine Learning" },
  "pricing.enterprise.f4": { en: "Jokey Services", id: "Jasa Joki" },
  "pricing.enterprise.f5": {
    en: "Full infrastructure & Deployment",
    id: "Infrastruktur & Pengembangan ",
  },
  "pricing.enterprise.f6": {
    en: "Pro Maintenance",
    id: "Pemeliharaan Lanjutan ",
  },
  "pricing.enterprise.f7": {
    en: "API docs & user manual",
    id: "Dokumentasi API & buku panduan",
  },
  "pricing.enterprise.price": {
    en: "Price on request",
    id: "Harga sesuai kebutuhan",
  },
  "pricing.enterprise.f8": {
    en: "Full technical documentation",
    id: "Dokumentasi Teknis lengkap",
  },

  "pricing.enterprise.cta": { en: "Contact Us", id: "Hubungi Kami" },

  // Bottom CTA
  "pricing.cta.title": {
    en: "Not sure which plan fits?",
    id: "Belum yakin mana yang tepat?",
  },
  "pricing.cta.desc": {
    en: "Tell us about your project — we'll give you a free estimate.",
    id: "Konsultasikan kebutuhan proyek Anda — kami bantu estimasi biaya secara gratis.",
  },
  "pricing.cta.contact": { en: "Contact Us", id: "Hubungi Kami" },
  "pricing.cta.portfolio": { en: "View Portfolio", id: "Lihat Portfolio" },
  "pricing.cta.contact.aria": {
    en: "Contact us for consultation",
    id: "Hubungi kami untuk konsultasi",
  },
  "pricing.cta.portfolio.aria": {
    en: "View our portfolio",
    id: "Lihat portfolio kami",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
