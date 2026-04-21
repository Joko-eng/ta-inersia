"use client";

import { useRouter } from "next/navigation";

export default function TrackingCTA() {
  const router = useRouter();

  return (
    <section
      id="tracking"
      className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-neutral-900"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Track Your Project
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Monitor your project progress, updates, and development status in one
          place.
        </p>

        <button
          onClick={() => router.push("/tracking")}
          className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          Go to Tracking Page
        </button>
      </div>
    </section>
  );
}
