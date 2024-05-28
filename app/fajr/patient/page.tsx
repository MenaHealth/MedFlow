import { PatientForm } from "@/components/form/Fajr/PatientForm"

export default function Home() {
  return (
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Patient Form</h1>
        <div className="rounded-lg border border-gray-300 p-8">
          <PatientForm />
        </div>
      </div>
  );
}

