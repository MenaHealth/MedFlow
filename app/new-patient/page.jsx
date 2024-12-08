"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiSend } from "react-icons/fi";

const CreatePatient = () => {
    const [language, setLanguage] = useState("english");

    const content = {
        english: {
            title: "Welcome to MENA Health!",
            subtitle:
                "We are happy to help you get started. If you are a patient who needs a medical consultation and would like to register for our free telehealth services, please follow the simple steps below:",
            steps: [
                {
                    title: "Click the Button Below to Chat with Our Team via Our MENA Health Telegram Chat",
                    description:
                        "Connect with our team via Telegram. This allows us to ensure we're providing you flexible, quick, and easy communication.",
                },
                {
                    title: "Send Us a Message on Telegram",
                    description:
                        "Once you click the button below, you'll be redirected to our Telegram chat. Simply send-text us a message to start, and you will receive a link to our patient registration form.",
                },
                {
                    title: "Complete Your Registration",
                    description:
                        "Once you've submitted your registration form, you will receive a confirmation text and a member of our medical team will reach out to you!",
                },
            ],
            getStarted: "Ready to Get Started?",
            buttonText: "Chat with Our Team on Telegram",
            helpText: "Need Help?",
            contactInfo:
                "If you have any issues or need further assistance, feel free to reach out by sending us an email at Contactus@menahealth.org or send-text us a message on Instagram @themenahealth.",
        },
    };

    const { title, subtitle, steps, getStarted, buttonText, helpText, contactInfo } = content[language];

    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-gradient-animation"></div>
            <div className="relative z-10 max-w-3xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-center mb-4">{title}</h1>
                <p className="text-center text-gray-700 mb-6">{subtitle}</p>

                <div className="space-y-6">
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
                    <a
                        href="https://t.me/menahealth_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-[#056E73] text-white font-bold py-2 px-6 rounded hover:bg-[#056E73] transition"
                    >
                        <FiSend className="mr-2" />
                        <span>{buttonText}</span>
                    </a>
                </div>

                <div className="mt-8 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">{helpText}</h3>
                    <p className="text-sm text-gray-600">{contactInfo}</p>
                </div>
            </div>
        </div>
    );
};

export default CreatePatient;


