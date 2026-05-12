import { Toaster } from "@/components/ui/sonner";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import "./globals.css";

const BASE_URL = "https://inersiadev.cloud";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Inersia Dev — Digital Solutions for Growing Businesses",
    template: "%s | Inersia Dev",
  },
  description:
    "We build scalable digital products and technology solutions tailored to your business needs — from strategy, design, to development.",
  keywords: [
    "Inersia Dev",
    "Inersia Development",
    "Inersia Developer",
    "software house Inersia",
    "jasa IT Inersia",
    "web development",
    "software development",
    "digital solutions",
    "business technology",
    "digital transformation",
    "technology solutions",
    "jasa pembuatan website",
    "jasa bikin website",
    "jasa website profesional",
    "jasa pembuatan website banyuwangi",
    "jasa bikin website banyuwangi",
    "jasa website profesional banyuwangi",
    "jasa web developer banyuwangi",
    "jasa programmer",
    "jasa software house",
    "jasa pengembangan aplikasi",
    "jasa pembuatan aplikasi",
    "jasa website company profile",
    "jasa landing page",
    "jasa pembuatan sistem",
    "jasa aplikasi bisnis",
    "jasa pembuatan dashboard",
    "jasa UI UX",
    "konsultan IT",
    "solusi digital bisnis",
    "transformasi digital",
    "pengembangan sistem informasi",
    "website bisnis modern",
    "website responsive",
    "website SEO friendly",
    "pengembang website Indonesia",
    "developer website Indonesia",
    "software house Indonesia",
    "startup teknologi Indonesia",
    "jasa website UMKM",
    "jasa website perusahaan",
    "jasa aplikasi custom",
    "Next.js",
    "React.js",
    "TypeScript",
    "Tailwind CSS",
    "frontend development",
    "backend development",
    "full stack developer",
    "API development",
    "teknologi bisnis Indonesia",
    "pengembang aplikasi Indonesia",
  ],
  authors: [{ name: "Inersia Dev", url: BASE_URL }],
  creator: "Inersia Dev",
  publisher: "Inersia Dev",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    url: BASE_URL,
    siteName: "Inersia Dev",
    title: "Inersia Dev — Digital Solutions for Growing Businesses",
    description:
      "We build scalable digital products and technology solutions tailored to your business needs — from strategy, design, to development.",
    images: [
      {
        url: "/Inersia.png",
        width: 1200,
        height: 630,
        alt: "Inersia Dev — Digital Solutions",
        type: "image/png",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "J78YbEApUjiGQj2e1VSjpTk1LHpQrMiq5HdPzU7EetY",
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },

  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
