import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Tracking",
  description:
    "Track the progress of your project in real-time. Enter your tracking ID to see milestones, tasks, and current status.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/monitoring",
  },
};

export default function MonitoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}