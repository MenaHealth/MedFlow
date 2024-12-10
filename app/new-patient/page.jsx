"use client";

"use client";

import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { WorldMap } from "@/components/WorldMap";

const NewPatient = () => {
    const [language, setLanguage] = useState("english");

    const content = {
        english: {
            title: "New Patient Registration",
            subtitle: "Welcome to MENA Health! Please follow the steps below to register as a new patient.",
            steps: [
                {
                    title: "Fill Out the Registration Form",
                    description: "Provide your basic information and medical history.",
                },
                {
                    title: "Review and Submit",
                    description: "Double-check your information before submitting the form.",
                },
                {
                    title: "Await Confirmation",
                    description: "You'll receive a confirmation message once your registration is processed.",
                },
            ],
            getStarted: "Ready to Register?",
            buttonText: "Start Registration",
            helpText: "Need Assistance?",
            contactInfo: "Contact us at support@menahealth.org for any questions or concerns.",
        },
    };

    const { title, subtitle, steps, getStarted, buttonText, helpText, contactInfo } = content[language];

    return (
        <div className="relative min-h-screen bg-white bg-gradient-animation">
            <div className="relative z-10 max-w-5xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-center mb-4">{title}</h1>
                <p className="text-center text-gray-700 mb-6">{subtitle}</p>

                <WorldMap
                    dots={[
                        { start: { lat: 34.0522, lng: -118.2437 }, end: { lat: 40.7128, lng: -74.006 } }, // LA to NY
                        { start: { lat: 48.8566, lng: 2.3522 }, end: { lat: 55.7558, lng: 37.6173 } }, // Paris to Moscow
                        { start: { lat: 35.6895, lng: 139.6917 }, end: { lat: -33.8688, lng: 151.2093 } }, // Tokyo to Sydney
                    ]}
                />

                <div className="space-y-6 mt-12">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#056E73] text-white flex items-center justify-center font-bold">
                                {index + 1}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800">{step.title}</h3>
                                <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">{getStarted}</h2>
                    <button className="inline-flex items-center bg-[#056E73] text-white font-bold py-2 px-6 rounded hover:bg-[#056E73] transition">
                        <FiSend className="mr-2" />
                        <span>{buttonText}</span>
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">{helpText}</h3>
                    <p className="text-sm text-gray-600">{contactInfo}</p>
                </div>
            </div>
        </div>
    );
};

export default NewPatient;

