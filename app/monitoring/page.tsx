import NavbarMonitoring from "@/components/Navbar-Monitoring";
import TrackingForm from "./TrackingForm";

export default function Page() {
  return (
    <>
      <NavbarMonitoring />

      <div className="min-h-screen bg-white dark:bg-neutral-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1" />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0000000a 1px, transparent 1px), linear-gradient(to bottom, #0000000a 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 hidden dark:block"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff08 1px, transparent 1px), linear-gradient(to bottom, #ffffff08 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-white/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-white" />
              <span className="text-primary dark:text-white text-xs font-semibold tracking-wide">
                Pemantauan Proyek
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Cek Status{" "}
              <span className="text-primary dark:text-blue-400">
                Proyek Anda
              </span>
            </h1>

            <p className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed">
              Masukkan kode tracking untuk melihat progres dan pembaruan terbaru
              proyek anda.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm px-8 py-10">
            <TrackingForm />
          </div>
        </div>
      </div>
    </>
  );
}
