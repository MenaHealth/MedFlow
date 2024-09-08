// app/about/page.tsx
'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import './aboutPage.css'

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            <div className="max-w-6xl py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl md:text-6xl">
                        Accessible Patient Care
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-darkBlue sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        The mission of MedFlow is to provide a modern electronic medical record (EMR) system to hospitals in the Middle East.
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
                            <h3 className="text-lg font-medium text-black">Patient Information Submission</h3>
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
                            <h3 className="text-lg font-medium text-black">Triage Specialists</h3>
                            <div className="card-animation">
                                <div className="ball ball1"></div>
                                <div className="ball ball2"></div>
                                <div className="ball ball3"></div>
                                <div className="ball ball4"></div>
                                <div className="ball ball5"></div>
                            </div>
                            <div className="card-content">
                                <p className="mt-2 text-base text-darkBlue">
                                    The triage specialists manage patient information, direct it to appropriate doctors, and ensure language compatibility.
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
                            <h3 className="text-lg font-medium text-black">Doctors</h3>
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
                                    Doctors with various specializations are authorized and scheduled by triage specialists based on patient needs and location.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="mt-20">
                    <Card className="p-8 bg-white">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-black">How It Works</h2>
                                <p className="mt-4 text-lg text-darkBlue">
                                    blah blah blah
                                </p>
                                <Button className="mt-8 bg-orange text-white hover:bg-darkOrange">Learn More</Button>
                            </div>
                            <div className="flex-1 mt-8 md:mt-0 md:ml-8">
                                <div className="relative w-full h-64">
                                    {/*<img*/}
                                    {/*    src="/placeholder.svg?height=256&width=384"*/}
                                    {/*    alt="Heart rate monitor"*/}
                                    {/*    className="rounded-lg object-cover w-full h-full"*/}
                                    {/*/>*/}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}