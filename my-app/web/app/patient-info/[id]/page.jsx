// app/patient-info/[id]/page.tsx
"use client"

import PatientChart from "@/components/PatientChart";
import SurgeryChartForm from "@/components/SurgeryChartForm";

export default function Home({ params }) {

    return (
        <SurgeryChartForm id={params.id} />
    );
}
