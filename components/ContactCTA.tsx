"use client";

export default function ContactCTA() {
  return (
    <section id="contact" className="bg-primary py-24 relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Glow orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-800 rounded-full blur-3xl opacity-30" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Ready to Build Something
          <br />
          <span className="text-blue-200">Extraordinary?</span>
        </h2>
        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Let's talk about your project. Our team is ready to help you design,
          build, and launch your next digital product.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:hello@technova.id"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-full hover:bg-blue-50 transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Your Project
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href="#services"
            className="text-white font-semibold hover:text-blue-200 transition-colors"
          >
            View Our Services →
          </a>
        </div>
      </div>
    </section>
  );
}
