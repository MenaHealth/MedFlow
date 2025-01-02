// components/ui/NewPatientWithTimeline.tsx
// components/ui/NewPatientWithTimeline.tsx
"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, useAnimation } from "framer-motion";
import { FiSend } from "react-icons/fi";
import { ContainerScroll } from "./container-scroll-animation";
import Image from "next/image";
import { Spotlight } from "./Spotlight";

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

export default function NewPatientWithTimeline() {
    const {
        title,
        subtitle,
        steps,
        getStarted,
        buttonText,
        helpText,
        contactInfo,
        telegramLink,
    } = content.english;

    const containerRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState(0);
    const controls = useAnimation();
    const stepsRef = useRef(null);
    const isStepsInView = useInView(stepsRef, { once: true, amount: 0.3 });

    const getStartedRef = useRef(null);
    const spotlightRef = useRef(null);

    // Animation controls for Spotlight
    const spotlightControls = useAnimation();

    // Scroll progress for the entire container (for the timeline line)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], [0, containerHeight]);

    // Scroll progress for the getStarted section
    const { scrollYProgress: getStartedScroll } = useScroll({
        target: getStartedRef,
        offset: ["start end", "end start"],
    });

    // Map scroll progress to opacity: fade in and out
    const spotlightOpacity = useTransform(getStartedScroll, [0, 0.5, 1], [0, 1, 0]);

    useEffect(() => {
        if (containerRef.current) {
            setContainerHeight(containerRef.current.offsetHeight);
        }
    }, []);

    useEffect(() => {
        if (isStepsInView) {
            controls.start("visible");
        }
    }, [isStepsInView, controls]);

    return (
        <div ref={containerRef} className="relative max-w-5xl mx-auto p-6 overflow-x-hidden">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200">
                <motion.div className="w-full bg-[#056E73]" style={{ height: lineHeight }} />
            </div>

            {/* Title */}
            <motion.h1
                className="text-3xl text-darkBlue font-bold text-center mb-4 pt-36 pb-24"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                className="text-center text-darkBlue pb-12"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
                {subtitle}
            </motion.p>

            {/* Steps */}
            <div className="space-y-6 mt-12" ref={stepsRef}>
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        className="relative flex items-start pl-10"
                        initial="hidden"
                        animate={controls}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                        <motion.div
                            className="absolute left-0 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-[#056E73] text-white font-bold"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                duration: 0.4,
                                delay: 0.6 + index * 0.2,
                                ease: "easeOut",
                            }}
                        >
                            {index + 1}
                        </motion.div>
                        <div>
                            <h3 className="font-semibold text-lg text-gray-800 pb-1">
                                {step.title}
                            </h3>
                            <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Get Started Section with Spotlight */}
            <div className="my-16 relative" ref={getStartedRef}>
                {/* Spotlight */}
                <div className="z-0 top-[-50%] right-[-10%] w-full h-full absolute">
                    <Spotlight fill="#008387"/>
                </div>

                {/* Get Started Content */}
                <ContainerScroll
                    titleComponent={
                        <h2 className="text-2xl font-semibold relative z-10">{getStarted}</h2>
                    }
                >
                    <Image
                        src="/assets/images/telegram-chat.svg"
                        alt="Telegram Chat"
                        width={600}
                        height={400}
                        className="mx-auto object-contain"
                    />
                </ContainerScroll>
            </div>

            {/* Map Image Section */}
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

            {/* Help Section */}
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
    );
}