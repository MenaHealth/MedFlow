import { DoctorForm } from "@/components/form/doctor-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-10">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Medical Order Form</h1>
        <div className="rounded-lg border border-gray-300 p-8">
          <DoctorForm />
        </div>
      </div>
    </main>
  );
}
