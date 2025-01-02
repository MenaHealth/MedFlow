// app/new-patient/page.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { AuroraBackground } from "../../components/ui/aurora-background";
import { motion, useInView, useAnimation } from "framer-motion";

const NewPatient = () => {
    const [language, setLanguage] = useState("english");
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    const content = {
        english: {
            title: "New Patient Registration",
            subtitle: "If you are a patient who needs a medical consultation and would like to register for our free telehealth app, MedFlow, please follow the steps below:",
            steps: [
                {
                    title: "Click the Button Below to Chat with Our MENA Health Telegram chat bot",
                    description:
                        "Connect with our team on Telegram. This ensures flexible, quick, and easy communication.",
                },
                {
                    title: "Send Us a Message",
                    description:
                        "Once you click the button, you'll be redirected to our Telegram chat. Send us a text to start, and you will receive a link to our patient registration form.",
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
            contactInfo: "If you have any issues or need further assistance, send us an email at Contactus@menahealth.org or send us a message on Instagram @themenahealth.",
            telegramLink: "https://t.me/menahealth_bot",
        },
    };

    const { title, subtitle, steps, getStarted, buttonText, helpText, contactInfo, telegramLink } = content[language];

    return (
        <AuroraBackground auroraStyle="green">
            <div className="relative max-w-5xl mx-auto p-6">
                <motion.h1
                    className="text-3xl text-darkBlue font-bold text-center mb-4 pt-36 pb-24"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {title}
                </motion.h1>
                <motion.p
                    className="text-center text-darkBlue pb-12"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    {subtitle}
                </motion.p>

                <div className="space-y-6 mt-12" ref={ref}>
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="flex items-start space-x-4"
                            initial="hidden"
                            animate={controls}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <motion.div
                                className="flex-shrink-0 w-8 h-8 rounded-full bg-[#056E73] text-white flex items-center justify-center font-bold"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.6 + index * 0.2, ease: "easeOut" }}
                            >
                                {index + 1}
                            </motion.div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800 pb-6">{step.title}</h3>
                                <p className="text-sm text-gray-600 pb-3">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="relative mt-8">
                    <div className="absolute inset-0 z-0 flex justify-center items-center translate-y-16">
                        <img
                            src="assets/images/map.png"
                            alt="Map"
                            className="w-2/3 opacity-20"
                        />
                    </div>
                    <motion.div
                        className="relative z-10 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">{getStarted}</h2>
                        <motion.a
                            href={telegramLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-[#056E73] text-white font-bold py-2 px-6 rounded hover:bg-[#045256] transition"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiSend className="mr-2" />
                            <span>{buttonText}</span>
                        </motion.a>
                    </motion.div>
                </div>

                <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
                >
                    <h3 className="text-lg font-semibold text-gray-800">{helpText}</h3>
                    <p className="text-sm text-gray-600">{contactInfo}</p>
                </motion.div>
            </div>
        </AuroraBackground>
    );
};

export default NewPatient;


