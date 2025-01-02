// pages/new-patient.tsx
import React from "react";
import NewPatientTimeline from "../../components/newPatient/aboutPage/NewPatientTimeline";

export default function NewPatientPage() {
    return (
        <div className={'mt-8'}>
            <NewPatientTimeline initialLanguage="english" />
        </div>
    );
}


