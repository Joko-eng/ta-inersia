import TrackingForm from "./TrackingForm";

export default function Page() {
  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-8 py-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-8 py-8">
            <TrackingForm />
          </div>
        </div>
      </div>
    </>
  );
}
