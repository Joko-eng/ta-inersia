import About from "@/components/About";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Provider";
import WhyChooseUs from "@/components/WhyChooseUs";

export const metadata = {
  title: "Inersia Dev — Digital Solutions for Growing Businesses.",
  description:
    "We build scalable digital products and technology solutions tailored to your business needs — from strategy, design, to development.",
};

export default function Home() {
  return (
    <Providers>
      <main className="min-h-screen font-sans antialiased">
        <Navbar />
        <Hero />
        <WhyChooseUs />
        {/* <Testimonials /> */}
        <About />
        <ContactCTA />
        <Footer />
      </main>
    </Providers>
  );
}
