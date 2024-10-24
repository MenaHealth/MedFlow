// app/about/page.tsx
'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import './aboutPage.css'
import Link from "next/link";
import { ClipboardList, Calendar, Image, Stethoscope, FileText } from 'lucide-react'

const features = [
    { icon: ClipboardList, title: "View Patient Info", description: "Access comprehensive patient information" },
    { icon: Calendar, title: "Schedule Lab Visits", description: "Easily manage and schedule laboratory appointments" },
    { icon: Stethoscope, title: "Take PatientNotes", description: "Record detailed medical notes2 for each patient" },
    { icon: Image, title: "Image Gallery", description: "Maintain a dedicated image gallery for each patient" },
    { icon: FileText, title: "Prescription Management", description: "Generate and manage drug prescription paperwork" },
]

const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://gaza-meds.vercel.app/';

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl md:text-6xl">
                        First Virtual Hospital in the MENA Region
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-darkBlue sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        The mission of MedFlow is to provide a modern electronic medical record (EMR) system to hospitals in the Middle East and North Africa. The user-types of the app are:
                    </p>
                </div>

                <div className="mt-20">
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 bg-white bg-opacity-30 card-container">
            <div className="card-header">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-orange text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="var(--darkOrange)" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                </div>
            </div>
            <h3 className="text-lg font-medium text-black text-center">Patients</h3> {/* Added text-center */}
            <div className="card-animation">
                <div className="ball-first ball1-first"></div>
                <div className="ball-first ball2-first"></div>
                <div className="ball-first ball3-first"></div>
                <div className="ball-first ball4-first"></div>
                <div className="ball-first ball5-first"></div>
            </div>
            <div className="card-content">
                <p className="mt-2 text-base text-darkBlue">
                    Patients do not create profiles. Instead, they fill out a comprehensive survey, providing essential information for their care.
                </p>
            </div>
        </Card>

        <Card className="p-6 bg-white bg-opacity-60 card-container">
            <div className="card-header">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-yellow text-darkBlue">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="var(--orange)" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                </div>
            </div>
            <h3 className="text-lg font-medium text-black text-center">Triage Specialists</h3> {/* Added text-center */}
            <div className="card-animation">
                <div className="ball ball1"></div>
                <div className="ball ball2"></div>
                <div className="ball ball3"></div>
                <div className="ball ball4"></div>
                <div className="ball ball5"></div>
            </div>
            <div className="card-content">
                <p className="mt-2 text-base text-darkBlue">
                    The triage coordinators manage patient information, direct it to appropriate doctors, and ensure language compatibility.
                </p>
            </div>
        </Card>
        <Card className="p-6 bg-white bg-opacity-100 card-container">
            <div className="card-header">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-orange text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="var(--lightOrange)" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
            <h3 className="text-lg font-medium text-black text-center">Doctors</h3> {/* Added text-center */}
            <div className="card-animation">
                <div className="heart-rate">
                    <svg viewBox="0 9 498.778 54.805" className="w-full h-full">
                        <polyline fill="none" stroke="var(--lightOrange)" strokeWidth="2" strokeMiterlimit="10" points="0 45.486 64.133 45.486 74.259 33.324 84.385 45.486 96.2 45.486 104.637 55.622 119.825 9 133.327 63.729 140.079 45.486 162.018 45.486 172.146 40.419 183.958 45.486 249.778 45.486" />
                        <polyline fill="none" stroke="var(--lightOrange)" strokeWidth="2" strokeMiterlimit="10" points="249 45.562 313.133 45.562 323.259 33.4 333.385 45.562 345.2 45.562 353.637 55.698 368.825 9.076 382.327 63.805 389.079 45.562 411.018 45.562 421.146 40.495 432.958 45.562 498.778 45.562" />
                    </svg>
                                    <div className="fade-in"></div>
                                    <div className="fade-out"></div>
                                </div>
                            </div>
                            <div className="card-content">
                                <p className="mt-2 text-base text-darkBlue">
                                    Doctors with various specializations are authorized and scheduled by triage coordinators based on patient needs and location.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="mt-20">
                    <Card className="w-full max-w-3xl mx-auto p-10">
                        <h2 className="text-2xl font-bold mb-4">Patient Submission Process</h2>
                        <p className="text-gray-600 mb-8">How patients interact with MedFlow for remote health consultations</p>

                        <div className="space-y-8">
                            <div className="space-y-6">
                                {[
                                    {
                                        title: "Access the Intake Form",
                                        description: "Patients visit our secure online platform to access the multilingual intake form."
                                    },
                                    {
                                        title: "Provide Essential Information",
                                        description: "Patients submit key details including personal information, medical concerns, and preferences."
                                    },
                                    {
                                        title: "Language Selection",
                                        description: "The form is available in multiple languages including English, Arabic, Farsi, and Pashto."
                                    },
                                    {
                                        title: "Triage Process",
                                        description: "Our specialists review submissions to direct patients to appropriate care."
                                    },
                                    {
                                        title: "Doctor Assignment",
                                        description: "Based on the patient's needs, a suitable doctor is assigned for the consultation."
                                    }
                                ].map((step, index) => (
                                    <div key={index} className="flex items-start space-x-6">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--orange)] flex items-center justify-center text-white font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">{step.title}</h3>
                                            <p className="text-sm text-gray-600">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-orange-50 p-4 rounded-md">
                                <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    <li>Multilingual support for broader accessibility</li>
                                    <li>Secure handling of patient information</li>
                                    <li>Efficient triage system for prompt care</li>
                                    <li>Remote consultations with qualified doctors</li>
                                </ul>
                            </div>

                            <p className="text-sm text-gray-600 italic">
                                Our streamlined process ensures that patients receive appropriate care efficiently,
                                bridging geographical gaps in healthcare access.
                            </p>
                        </div>
                    </Card>
                </div>

                <div className="mt-20">
                    <Card className="p-8 bg-white shadow-lg">
                        <div className="flex flex-col space-y-8">
                            <h2 className="text-3xl font-bold text-black">Doctor and Triage Coordinator Sign-up Process</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-semibold text-black mb-4">For Doctors</h3>
                                    <ul className="list-disc list-inside space-y-2 text-darkBlue">
                                        <li>
                                            Sign up at <Link href={`${baseURL}/auth`} className="text-[var(--orange)] hover:underline">our registration page</Link>
                                        </li>
                                        <li>Provide the following information:
                                            <ul className="list-disc list-inside ml-4 mt-2">
                                                <li>Full Name</li>
                                                <li>Doctor Specialty</li>
                                                <li>Date of Birth</li>
                                                <li>Email Address</li>
                                                <li>Languages Spoken</li>
                                                <li>Countries Seeing Patients</li>
                                            </ul>
                                        </li>
                                        <li><b>Await approval from a <u>site administrator</u></b></li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-black mb-4">For Triage Coordinators</h3>
                                    <ul className="list-disc list-inside space-y-2 text-darkBlue">
                                        <li>
                                            Sign up at <Link href={`${baseURL}/auth`} className="text-[var(--orange)] hover:underline">our registration page</Link>
                                        </li>
                                        <li>Provide the following information:
                                            <ul className="list-disc list-inside ml-4 mt-2">
                                                <li>Full Name</li>
                                                <li>Date of Birth</li>
                                                <li>Email Address</li>
                                            </ul>
                                        </li>
                                        <li><b>Await approval from the <u>site administrator</u></b></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-md">
                                <h3 className="text-lg font-semibold text-black mb-2">Post-Registration Process</h3>
                                <ol className="list-decimal list-inside space-y-2 text-darkBlue">
                                    <li>An email confirmation is sent upon account creation</li>
                                    <li>Triage Coordinators are approved by the <i>site administrator</i></li>
                                    <li>Doctors are approved by <i>Triage Coordinators</i></li>
                                    <li>Approved doctors can access the Physician Dashboard</li>
                                    <li>Triage Coordinators direct patient information to appropriate doctors based on specialization</li>
                                </ol>
                            </div>
                        </div>
                    </Card>
                </div>


                <div className="mt-20">
                    <Card className="p-8 bg-white">
                        <div className="flex flex-col items-start">
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-black mb-4">Patient Care</h2>
                                <p className="text-lg text-darkBlue mb-6">
                                    MedFlow empowers doctors with a comprehensive suite of tools to provide efficient and effective patient care. Once a patient is directed to a doctors specialization, our platform offers:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <feature.icon className="w-6 h-6 text-[var(--orange)] flex-shrink-0 mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-black">{feature.title}</h3>
                                                <p className="text-sm text-darkBlue">{feature.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 mt-8 md:mt-0 md:ml-8">
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
