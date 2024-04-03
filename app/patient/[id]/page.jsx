"use client"

import PatientChart from "@/components/PatientChart";

export default function Home({ params }) {

    return (
        <PatientChart id={params.id} />
    );
}
