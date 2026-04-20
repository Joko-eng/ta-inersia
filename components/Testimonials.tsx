"use client";

const testimonials = [
  {
    stars: 5,
    quote:
      "Working with TechNova felt like partnering with an in-house team. Their technical expertise and attention to detail were exceptional.",
    name: "Michael T.",
    role: "Head of Engineering",
    color: "#4F46E5",
  },
  {
    stars: 5,
    quote:
      "The team understood our business goal and delivered a product that was both scalable and easy-to-use. Communication was clear throughout the process.",
    name: "Sarah L.",
    role: "Startup Founder",
    color: "#7C3AED",
  },
  {
    stars: 5,
    quote:
      "From discovery to launch, TechNova guided us through every step. Our platform's performance improved dramatically after their work.",
    name: "Arya M.",
    role: "CTO, FinTech Co.",
    color: "#0891B2",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="#FBBF24">
          <path d="M8 1l1.85 3.75 4.15.6-3 2.92.7 4.1L8 10.35l-3.7 1.02.7-4.1-3-2.92 4.15-.6L8 1z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-gray-500 text-lg">
            Real stories from businesses we've helped grow.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <StarRating count={t.stars} />
                <p className="text-gray-600 leading-relaxed text-sm">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: t.color }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}