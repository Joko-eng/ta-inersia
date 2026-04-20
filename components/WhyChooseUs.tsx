"use client";

import { Brain, Cpu, Globe, Smartphone } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Website Development",
    description:
      "From company profiles and landing pages to complex systems with API integration and security.",
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description:
      "Android and iOS applications built from UI layers to full deployment with optimized performance.",
  },
  {
    icon: Brain,
    title: "Machine Learning",
    description:
      "End-to-end AI solutions covering data collection, preprocessing, model research, and inference APIs.",
  },
  {
    icon: Cpu,
    title: "IoT Solutions",
    description:
      "Firmware development, hardware integration, and internet-based monitoring dashboards.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="services" className="bg-gray-50 dark:bg-primary py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            Why Bussines Choose InersiaDev
          </h2>
          <p className="text-gray-500 dark:text-gray-300 text-lg max-w-xl mx-auto">
            We deliver technology solutions designed to scale with your business
            goals.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;

            return (
              <div
                key={i}
                className="bg-white dark:bg-white/5 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-white/10 group"
              >
                <div className="w-14 h-14 bg-blue-50 dark:bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-100 dark:group-hover:bg-white/20 transition-colors">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-white" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-500 dark:text-gray-300 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
