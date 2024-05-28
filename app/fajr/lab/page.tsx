import { LabForm } from "@/components/form/Fajr/LabsForm";

export default function Home() {
  return (
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Lab Form</h1>
        <div className="rounded-lg border border-gray-300 p-8">
          <LabForm />
        </div>
      </div>
  );
}

