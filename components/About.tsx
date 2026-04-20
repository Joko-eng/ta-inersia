"use client";

export default function About() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Where Strategy Meets
          </h2>
          <h2 className="text-4xl font-extrabold text-gray-400 tracking-tight">Technology.</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            {/* Image 1 — darker/indoor */}
            <div className="col-span-1 h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 relative shadow-lg">
              <div className="absolute inset-0 flex items-end p-4">
                <div className="w-8 h-8 bg-white/20 rounded-full blur-xl" />
              </div>
              {/* Simulated bokeh lights */}
              <div className="absolute top-6 left-8 w-12 h-12 rounded-full bg-amber-300/30 blur-lg" />
              <div className="absolute top-16 right-6 w-8 h-8 rounded-full bg-amber-400/20 blur-md" />
              <div className="absolute bottom-8 left-12 w-16 h-16 rounded-full bg-orange-300/20 blur-xl" />
            </div>

            {/* Image 2 — glass building */}
            <div className="col-span-1 h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-200 to-sky-100 relative shadow-lg">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 200 260"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <g key={i}>
                    <rect
                      x={10 + i * 36}
                      y={20}
                      width={28}
                      height={230}
                      rx={2}
                      fill={`rgba(37,99,235,${0.04 + i * 0.015})`}
                      stroke="rgba(37,99,235,0.15)"
                      strokeWidth={1}
                    />
                    {Array.from({ length: 7 }).map((_, j) => (
                      <rect
                        key={j}
                        x={12 + i * 36}
                        y={30 + j * 30}
                        width={24}
                        height={22}
                        rx={1}
                        fill={`rgba(37,99,235,${0.06 + Math.sin(i + j) * 0.04})`}
                      />
                    ))}
                  </g>
                ))}
                <rect x={0} y={0} width={200} height={260} fill="url(#buildGrad)" opacity={0.25} />
                <defs>
                  <linearGradient id="buildGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#BAE6FD" />
                    <stop offset="100%" stopColor="#EFF6FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed text-base">
              Founded in 2018, TechNova partners with growing companies to build scalable digital
              solutions. We combine strategic thinking, thoughtful design, and robust engineering to
              solve real business challenges.
            </p>

            <ul className="space-y-3">
              {[
                "End-to-end digital product development",
                "Cross-functional team of designers & engineers",
                "Agile delivery with measurable outcomes",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5l2 2 4-4"
                        stroke="#2563EB"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 text-sm mt-2"
            >
              Start a Project
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 7h9M8 3.5L11.5 7 8 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}