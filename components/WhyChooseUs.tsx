"use client";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 19V6l12-3v13"
          stroke="#2563EB"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="6" cy="19" r="3" stroke="#2563EB" strokeWidth="1.5" />
        <circle cx="18" cy="16" r="3" stroke="#2563EB" strokeWidth="1.5" />
      </svg>
    ),
    title: "Product Strategy",
    description:
      "Turning ideas into scalable digital products aligned with your business goals.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="3"
          width="8"
          height="8"
          rx="2"
          stroke="#2563EB"
          strokeWidth="1.5"
        />
        <rect
          x="13"
          y="3"
          width="8"
          height="8"
          rx="2"
          stroke="#2563EB"
          strokeWidth="1.5"
        />
        <rect
          x="3"
          y="13"
          width="8"
          height="8"
          rx="2"
          stroke="#2563EB"
          strokeWidth="1.5"
        />
        <rect
          x="13"
          y="13"
          width="8"
          height="8"
          rx="2"
          stroke="#2563EB"
          strokeWidth="1.5"
        />
      </svg>
    ),
    title: "UI/UX & Design Systems",
    description:
      "Designing consistent, user-focused interfaces and design systems across platforms.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <polyline
          points="16 18 22 12 16 6"
          stroke="#2563EB"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="8 6 2 12 8 18"
          stroke="#2563EB"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Dev-Ready Delivery",
    description:
      "Solutions developed efficiently and sustainably — from prototype to production.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="services" className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Why Companies Choose TechNova
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            We deliver technology solutions designed to scale with your business
            goals.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
