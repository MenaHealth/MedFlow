'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, SendHorizonal } from 'lucide-react'

export default function SignupSuccessPage() {
    const [visible, setVisible] = useState(false)
    const [animateFlyOff, setAnimateFlyOff] = useState(false)
    const [showTextAndCheck, setShowTextAndCheck] = useState(false)
    const [showCard, setShowCard] = useState(false)

    useEffect(() => {
        // Start the send-text icon animation immediately
        setAnimateFlyOff(true)

        // Set a delay to show the card after SendHorizonal animation (2s) ends
        const showCardTimer = setTimeout(() => {
            setShowCard(true) // Show the card after 2 seconds (SendHorizonal ends)
        }, 2000)

        // Set a delay for the check mark and text animations (after SendHorizonal ends)
        const timer = setTimeout(() => {
            setVisible(true)
            setShowTextAndCheck(true) // Show the text and check after the card moves in
        }, 2500) // Adjust this timing to match the card's entrance

        return () => {
            clearTimeout(showCardTimer)
            clearTimeout(timer)
        }
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            {/* SendHorizontal Animation */}
            <div className={`fixed z-50 ${animateFlyOff ? 'fly-right' : ''}`} style={{ top: '50%', left: 0 }}>
                <SendHorizonal className="h-10 w-10 text-orange-500" />
            </div>

            {/* Card (Initially hidden and slides up after send-text animation) */}
            <div
                className={`max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg transition-transform duration-700 ${
                    showCard ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
            >
                <div className="relative text-center">
                    {/* Check Circle and Text Animation (Appears after delay) */}
                    {showTextAndCheck && (
                        <div className="success-animation mx-auto">
                            <div className="circle-border"></div>
                            <div className="circle">
                                <CheckCircle className="text-orange-500" size={40} />
                            </div>
                        </div>
                    )}

                    {showTextAndCheck && (
                        <>
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Thanks for signing up!</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Please check-in with your admin for next steps.
                            </p>
                            <p className="mt-5 text-sm text-gray-500">
                                If you want to learn more about medFlow, visit our{' '}
                                <a href="/about" className="text-orange-500 underline">About Page</a>.
                            </p>
                        </>
                    )}
                </div>
            </div>

            <style jsx>{`
              .fly-right {
                animation: flyRight 2s ease-in-out forwards;
              }

              @keyframes flyRight {
                0% {
                  transform: translateX(0);
                  opacity: 1;
                }
                90% {
                  transform: translateX(calc(100vw - 50px)); 
                  opacity: 1;
                }
                100% {
                  transform: translateX(calc(100vw + 50px));
                  opacity: 0; 
                }
              }

              .success-animation {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
              }

              .success-animation .circle-border {
                position: absolute;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: var(--orange);
                transform: scale(1.1);
                animation: circle-anim 400ms ease;
              }

              .success-animation .circle {
                position: relative;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                transform: scale(1);
                animation: success-anim 700ms ease;
              }

              .success-animation .circle svg {
                opacity: 0;
                animation: check-anim 700ms ease;
              }

              @keyframes success-anim {
                0% {
                  transform: scale(0);
                }
                30% {
                  transform: scale(0);
                }
                100% {
                  transform: scale(1);
                }
              }

              @keyframes circle-anim {
                from {
                  transform: scale(0);
                }
                to {
                  transform: scale(1.1);
                }
              }

              @keyframes check-anim {
                0% {
                  opacity: 0;
                }
                100% {
                  opacity: 1;
                }
              }
            `}</style>
        </div>
    )
}