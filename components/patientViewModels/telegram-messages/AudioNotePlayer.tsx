// components/patientViewModels/telegram-messages/AudioNotePlayer.tsx
"use client"

import React, { useState, useRef, useEffect } from "react"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile } from "@ffmpeg/util"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

interface AudioNotePlayerProps {
    mediaUrl: string
}

const LoadingModal = ({ isVisible }: { isVisible: boolean }) => (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white p-6 rounded-lg shadow-xl"
                >
                    <p className="text-sm text-gray-700 mb-3">Converting audio, please wait...</p>
                    <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
)

export function AudioNotePlayer({ mediaUrl }: AudioNotePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [isConverting, setIsConverting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [convertedUrl, setConvertedUrl] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const ffmpeg = useRef(new FFmpeg())

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
            }
        }
    }, [])

    const convertToMp4 = async () => {
        setIsConverting(true)
        try {
            const response = await fetch(mediaUrl)
            const oggFile = await response.blob()

            if (!ffmpeg.current.loaded) {
                await ffmpeg.current.load()
            }

            const inputFileName = "input.ogg"
            const outputFileName = "output.mp4"

            await ffmpeg.current.writeFile(inputFileName, await fetchFile(oggFile))
            await ffmpeg.current.exec(["-i", inputFileName, "-c:a", "aac", "-b:a", "192k", outputFileName])

            const data = await ffmpeg.current.readFile(outputFileName)
            const mp4Blob = new Blob([data], { type: "video/mp4" })
            const mp4Url = URL.createObjectURL(mp4Blob)

            setConvertedUrl(mp4Url)
            setIsConverting(false)

            playConvertedAudio(mp4Url)
        } catch (err) {
            console.error("Error during conversion:", err)
            setError("Failed to convert audio.")
            setIsConverting(false)
        }
    }

    const handleSliderChange = (newValue: number[]) => {
        const [newProgress] = newValue;
        if (audioRef.current) {
            const newTime = (newProgress / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(newProgress);
        }
    };

    const togglePlayPause = async () => {
        if (isConverting) return

        if (!convertedUrl) {
            await convertToMp4()
            return
        }

        if (isPlaying) {
            pauseAudio()
        } else {
            if (audioRef.current) {
                audioRef.current.play();
                setIsPlaying(true);
            } else {
                playConvertedAudio(convertedUrl);
            }
        }
    }

    const playConvertedAudio = (url: string) => {
        if (!audioRef.current) {
            audioRef.current = new Audio(url);
        }

        audioRef.current.onended = handleAudioEnd;
        audioRef.current.ontimeupdate = () => {
            if (audioRef.current) {
                setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
            }
        };

        audioRef.current.play().then(() => {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                const headphones = devices.find((device) => device.label.toLowerCase().includes("headphone"));
                if (headphones) {
                    console.log("Routing audio to headphones:", headphones.label);
                }
            });
        });

        setIsPlaying(true);
    }

    const pauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause()
            setIsPlaying(false)
        }
    }

    const handleAudioEnd = () => {
        setIsPlaying(false)
        setProgress(0)
        if (audioRef.current) {
            audioRef.current.currentTime = 0
            console.log("Returning control to default audio route.")
        }
    }

    return (
        <div className="relative flex flex-col items-center space-y-4 w-full max-w-[300px]">
            <LoadingModal isVisible={isConverting} />
            <motion.div
                initial={false}
                animate={{
                    background: isPlaying
                        ? ""
                        : "transparent",
                }}
                transition={{ duration: 0.5 }}
                className="w-full p-4 rounded-lg shadow-md relative overflow-hidden"
                style={{ clipPath: 'inset(0 0 0 0)' }}
            >
                <motion.div
                    className="absolute top-0 left-0 h-full bg-orange-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1, ease: "linear" }}
                />
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex justify-center mb-4"
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePlayPause}
                        disabled={isConverting}
                        aria-label={isPlaying ? "Pause" : "Play"}
                        className="z-50"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isConverting ? (
                                <motion.div
                                    key="converting"
                                    initial={{ opacity: 0, rotate: 180 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: -180 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </motion.div>
                            ) : isPlaying ? (
                                <motion.div
                                    key="pause"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Pause className="h-6 w-6" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="play"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Play className="h-6 w-6" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>
                </motion.div>
                <Slider
                    value={[progress]}
                    max={100}
                    step={0.1}
                    onValueChange={handleSliderChange}
                    className="w-full bg-orange-200"
                    aria-label="Audio progress"
                />
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-center mt-2"
                >
                    <span className="text-sm font-medium text-darkBlue">{`${Math.round(progress)}%`}</span>
                </motion.div>
            </motion.div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-2"
                >
                    {error}
                </motion.p>
            )}
        </div>
    )
}

