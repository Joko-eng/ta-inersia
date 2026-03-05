import TrackingForm from "./TrackingForm";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-800 tracking-tight">
            Dashboard Pemantauan Proyek
          </h1>
          <p className="text-sm text-blue-600 mt-1">
            Pantau perkembangan proyek Anda dengan mudah
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-8 py-8">
          <TrackingForm />
        </div>
      </div>
    </div>
  );
}
