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
    id: "InersiaDev — Solusi Digital untuk Bisnis yang Berkembang",
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
  "tracking.feature1": { en: "Progress updates", id: "Pembaruan progres" },
  "tracking.feature2": { en: "Delivery timeline", id: "Jadwal pengiriman" },
  "tracking.feature3": { en: "Development status", id: "Status pengembangan" },


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
