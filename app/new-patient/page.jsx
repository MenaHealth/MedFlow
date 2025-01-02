// app/new-patient/page.jsx
// app/new-patient/page.jsx
"use client";

import NewPatientWithTimeline from "../../components/ui/NewPatientWithTimeline";

export default function NewPatient() {
    // Example content
    const content = {
        english: {
            title: "New Patient Registration",
            subtitle: "If you are a patient ... please follow the steps below:",
            steps: [
                {
                    title: "Click the Button Below to Chat...",
                    description: "Connect with our team on Telegram.",
                },
                {
                    title: "Send Us a Message",
                    description: "You'll be redirected to our Telegram chat...",
                },
                {
                    title: "Complete Your Registration",
                    description: "Once you've submitted your registration form...",
                },
            ],
            getStarted: "Ready to Get Started?",
            buttonText: "Chat with Our Team on Telegram",
            helpText: "Need Help?",
            contactInfo:
                "If you have any issues or need further assistance...",
            telegramLink: "https://t.me/menahealth_bot",
        },
    };

    const { title, subtitle, steps, getStarted, buttonText, helpText, contactInfo, telegramLink } =
        content.english;

    return (
        <NewPatientWithTimeline
            title={title}
            subtitle={subtitle}
            steps={steps}
            getStarted={getStarted}
            buttonText={buttonText}
            helpText={helpText}
            contactInfo={contactInfo}
            telegramLink={telegramLink}
        />
    );
}