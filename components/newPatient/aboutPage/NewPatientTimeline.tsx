// components/newPatient/aboutPage/NewPatientTimeline.tsx
"use client"

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, useTransform, useInView, useAnimation, useScroll } from "framer-motion";
import { FiSend } from "react-icons/fi";
import { ContainerScroll } from "./container-scroll-animation";
import Image from "next/image";
import { Spotlight } from "./Spotlight";
import StepItem from "./StepItem";
import { newPatientTranslations, TranslationContent } from "./NewPatientTranslations";
import LanguageDropdown from "@/components/newPatient/aboutPage/LanguageDropdown";

interface NewPatientWithTimelineProps {
    initialLanguage: 'english' | 'arabic' | 'pashto' | 'farsi';
}

export default function NewPatientTimeline({ initialLanguage }: NewPatientWithTimelineProps) {
    const [language, setLanguage] = useState<'english' | 'arabic' | 'pashto' | 'farsi'>(initialLanguage);
    const content: TranslationContent = newPatientTranslations[language];

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [containerHeight, setContainerHeight] = useState(0);
    const controls = useAnimation();
    const stepsRef = useRef(null);
    const isStepsInView = useInView(stepsRef, { once: true, amount: 0.3 });

    const getStartedRef = useRef(null);

    const lineHeight = useTransform(scrollYProgress, [0, 1], [0, containerHeight]);

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

    const renderedSteps = useMemo(() => {
        return content.steps.map((step, index) => (
            <StepItem key={index} step={step} index={index} controls={controls} />
        ));
    }, [content.steps, controls]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'english' ? 'arabic' : 'english');
    };

    return (
        <div ref={containerRef} className="relative max-w-5xl mx-auto p-6">
            {/* Translation Button */}
            <div className="absolute top-16 right-4 z-20">
                <LanguageDropdown
                    currentLanguage={language}
                    onLanguageChange={setLanguage}
                />
            </div>

            {/* Timeline Line */}
            {isStepsInView && (
                <div className="absolute left-4 top-0 bottom-0 w-0.5">
                    <motion.div
                        className="w-full h-full"
                        style={{
                            height: lineHeight,
                            background: "linear-gradient(to bottom, white, #056E73)",
                            transformOrigin: "top"
                        }}
                    />
                </div>
            )}

            {/* Title */}
            {/* Spotlight */}
            <div className="z-0 top-[-42%] right-[-30%] w-full h-full absolute">
                <Spotlight fill="#008387"/>
            </div>
            <motion.h1
                className="text-3xl text-darkBlue font-bold text-center mb-4 pt-36 pb-24"
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8, ease: "easeOut"}}
            >
                {content.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                className="text-center text-darkBlue pb-12"
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8, delay: 0.2, ease: "easeOut"}}
            >
                {content.subtitle}
            </motion.p>

            {/* Steps */}
            <div className="space-y-6 mt-12" ref={stepsRef}>
                {renderedSteps}
            </div>

            {/* Get Started Section with Spotlight */}
            <div className="my-16 relative overflow-hidden" ref={getStartedRef}>
                {/* Get Started Content */}
                <ContainerScroll
                    titleComponent={
                        <h2 className="text-2xl font-semibold relative z-10">{content.getStarted}</h2>
                    }
                >
                    <div className="relative z-10 bg-white bg-opacity-80 p-6 rounded-lg">
                        <Image
                            src="/assets/images/telegram-chat.svg"
                            alt="Telegram Chat"
                            width={600}
                            height={600}
                            className="mx-auto object-contain w-full h-auto"
                        />
                    </div>
                </ContainerScroll>
            </div>

            {/* Map Image Section */}
            <div className="relative mt-4">

                <motion.div
                    className="relative z-10 text-center"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8, delay: 1.2, ease: "easeOut"}}
                >
                    <a
                        href={content.telegramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-[#056E73] text-white font-bold py-2 px-6 rounded transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
                    >
                        <FiSend className="mr-2"/>
                        <span>{content.buttonText}</span>
                    </a>
                </motion.div>
                <div className="absolute inset-0 z-0 flex justify-center items-center translate-y-16 mt-24">
                    <Image
                        src="/assets/images/map.png"
                        alt="Map"
                        width={800}
                        height={600}
                        className="w-2/3 opacity-20"
                    />
                </div>
            </div>

            {/* Help Section */}
            <motion.div
                className="mt-8 text-center"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.8, delay: 1.6, ease: "easeOut"}}
            >
                <h3 className="text-lg font-semibold text-gray-800">{content.helpText}</h3>
                <p className="text-sm text-gray-600">{content.contactInfo}</p>
            </motion.div>
        </div>
    );
}

