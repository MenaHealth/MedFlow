'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import './teamPage.css'
import Link from "next/link";
import { ClipboardList, ClipboardPlus, Calendar, Image, Stethoscope, FileText } from 'lucide-react'

const features = [
    { icon: ClipboardList, title: "View Patient Info", description: "Access comprehensive patient information" },
    { icon: Calendar, title: "Schedule Lab Visits", description: "Easily manage and schedule laboratory appointments" },
    { icon: Stethoscope, title: "Take Patient Notes", description: "Record detailed medical notes for each patient" },
    { icon: Image, title: "Image Gallery", description: "Maintain a dedicated image gallery for each patient" },
    { icon: FileText, title: "Prescription Management", description: "Generate and manage drug prescription paperwork" },
]

const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://gaza-meds.vercel.app/';

export default function TeamPage() {
    useEffect(() => {
        const handleIntersection = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animateCountUp = (elementId, target, duration) => {
                        const element = document.getElementById(elementId);
                        if (!element) return;

                        const start = 0;
                        const increment = Math.ceil(target / (duration / 50));
                        let current = start;

                        const updateCounter = () => {
                            current += increment;
                            if (current > target) current = target;
                            element.innerText = current;

                            if (current < target) {
                                setTimeout(updateCounter, 50);
                            }
                        };

                        updateCounter();
                    };

                    animateCountUp('counter-physicians', 200, 2000);
                    animateCountUp('counter-countries', 10, 2000);

                    observer.disconnect();
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.3, 
        });

        const target = document.getElementById('statistics-section');
        if (target) {
            observer.observe(target);
        }
    }, []);
    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl md:text-6xl">
                        First Virtual Hospital
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-darkBlue sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        for the MENA Region 
                    </p>
                    <p className="text-center mt-3 max-w-md mx-auto text-base text-darkBlue sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        MedFlow connects a global network of volunteer doctors to support on-the-ground healthcare facilities under crisis. 
                        It empowers online triage management, telehealth, and prescription management to optimize urgent treatment, giving displaced civilians 
                        control over their medical histories and ensuring physicians have the autonomy to provide informed care — no matter where they are.
                    </p>
                    </div>
                                {/* Animation Section */}
                                <div className="card-animation">
                    <div className="ball-connection ball1-connection"></div>
                    <div className="ball-connection ball2-connection"></div>
                    <div className="ball-connection ball3-connection"></div>
                    <div className="ball-connection ball4-connection"></div>
                    <div className="ball-connection ball5-connection"></div>
                </div>
                       {/* Statistics Section */}
                       <div
                    id="statistics-section"
                    className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center"
                    style={{
                        columnGap: "0px", 
                        maxWidth: "60%", 
                        margin: "0 auto", 
                      }}
                >
                    {/* Column 1 */}
                    <div>
                        <h2 className="text-6xl font-bold text-[var(--orange)]">
                            <span id="counter-physicians">0</span>+
                        </h2>
                        <p className="mt-2 text-lg text-darkBlue">Onboarded Physicians</p>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h2 className="text-6xl font-bold text-[var(--orange)]">
                            <span id="counter-countries">0</span>
                        </h2>
                        <p className="mt-2 text-lg text-darkBlue">Countries of Interest</p>
                    </div>
                </div>


                {/* Team Section */}
                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-4">
                        {/* Michelle */}
                        <Card className="p-6 bg-white bg-opacity-30 card-container">
                            <div className="flex flex-col items-center text-center">
                            <div className="flex items-center justify-center w-20 h-20 mb-4">
                            <img
                                        src="assets/images/mn1_hdst.png"
                                        alt="Michelle"
                                        className="rounded-full object-cover w-30 h-20"
                                    />
                                </div>
                                <h3 className="text-lg font-medium text-black">Michelle</h3>
                                <h3 className="text-sm font-small text-[var(--orange)] italic">Founder / CEO MENA Health</h3>
                                <h3 className="text-xs font-small text-[var(--orange)] italic">Co-Founder / Project Lead Medflow </h3>
                                <p className="text-xs mt-2 text-base text-darkBlue">
                                </p>
                            </div>
                        </Card>

                        {/* Maya */}
                        <Card className="p-6 bg-white bg-opacity-30 card-container">
                            <div className="flex flex-col items-center text-center">
                            <div className="flex items-center justify-center w-20 h-20 mb-4">
                            <img
                                        src="assets/images/ma_hdst.jpeg"
                                        alt="Maya"
                                        className="rounded-full object-cover w-20 h-20"
                                    />
                                </div>
                                <h3 className="text-lg font-medium text-black">Maya</h3>
                                <h3 className="text-sm font-small text-[var(--orange)] italic">Chief Development Officer MENA Health</h3>
                                <h3 className="text-xs font-small text-[var(--orange)] italic">Co-Founder Medflow</h3>
                                <p className="text-xs mt-2 text-base text-darkBlue">
                                </p>
                            </div>
                        </Card>

                        {/* Kyle */}
                        <Card className="p-6 bg-white bg-opacity-30 card-container">
                            <div className="flex flex-col items-center text-center">
                            <div className="flex items-center justify-center w-20 h-20 mb-4">
                            <img
                                        src="assets/images/ke_hdst.jpg"
                                        alt="Kyle"
                                        className="rounded-full object-cover w-20 h-20"
                                    />
                                </div>
                                <h3 className="text-lg font-medium text-black">Kyle</h3>
                                <h3 className="text-sm font-small text-[var(--orange)] italic">Co-Founder Medflow</h3>
                                <p className="text-xs mt-2 text-base text-darkBlue">
                                </p>
                            </div>
                        </Card>

                        {/* Andy */}
                        <Card className="p-6 bg-white bg-opacity-30 card-container">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex items-center justify-center w-36 h-36 mb-4">
                                <img
                                        src="assets/images/ac_hdst.jpg"
                                        alt="Andy"
                                        className="rounded-full object-cover w-20 h-20"
                                    />
                                </div>
                                <h3 className="text-lg font-medium text-black">Andy</h3>
                                <h3 className="text-sm font-small text-[var(--orange)] italic">Co-Founder Medflow</h3>
                                <p className="mt-2 text-base text-darkBlue">
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

