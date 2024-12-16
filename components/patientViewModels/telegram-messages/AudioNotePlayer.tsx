// components/patientViewModels/telegram-messages/AudioNotePlayer.tsx
import React, { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface AudioNotePlayerProps {
    mediaUrl: string;
    format?: string; // Add this so we know if it's mp4 or not
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
);

export function AudioNotePlayer({ mediaUrl, format }: AudioNotePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const ffmpeg = useRef(new FFmpeg());
    const [bars, setBars] = useState<number[]>([]);
    const [duration, setDuration] = useState<number | null>(null);

    // Only decode and show waveform if format is mp4
    useEffect(() => {
        // Reset state for new mediaUrl
        setIsPlaying(false);
        setProgress(0);
        setIsConverting(false);
        setError(null);
        setConvertedUrl(null);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        if (format === "mp4") {
            // The file is already converted, so we can decode and display waveform.
            (async () => {
                try {
                    const response = await fetch(mediaUrl);
                    const data = await response.arrayBuffer();
                    const audioContext = new AudioContext();
                    const audioBuffer = await audioContext.decodeAudioData(data);

                    // File is playable
                    setConvertedUrl(mediaUrl);

                    // Generate waveform after decoding
                    const pcmData = audioBuffer.getChannelData(0);
                    const waveform = generateWaveform(pcmData, 50);
                    setBars(waveform);
                } catch (err) {
                    console.error("Error decoding MP4 audio:", err);
                    setError("Failed to decode audio.");
                }
            })();
        } else {
            // Not MP4 yet, show a placeholder message
            setError("Audio note not converted. Please click 'Convert All' to convert.");
        }

    }, [mediaUrl, format]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    const convertToMp4 = async () => {
        setIsConverting(true);
        try {
            const response = await fetch(mediaUrl);
            const oggFile = await response.blob();

            if (!ffmpeg.current.loaded) {
                await ffmpeg.current.load();
            }

            const inputFileName = "input.ogg";
            const outputFileName = "output.mp4";

            await ffmpeg.current.writeFile(inputFileName, await fetchFile(oggFile));
            await ffmpeg.current.exec(["-i", inputFileName, "-c:a", "aac", "-b:a", "192k", outputFileName]);

            const data = await ffmpeg.current.readFile(outputFileName);
            const mp4Blob = new Blob([data], { type: "video/mp4" });
            const mp4Url = URL.createObjectURL(mp4Blob);

            setConvertedUrl(mp4Url);
            setIsConverting(false);
            playConvertedAudio(mp4Url);
            setError(null); // Clear error
        } catch (err) {
            console.error("Error during conversion:", err);
            setError("Failed to convert audio.");
            setIsConverting(false);
        }
    };

    const togglePlayPause = async () => {
        if (isConverting) return;

        // If we don't have a convertedUrl and the format isn't mp4,
        // we need to convert it first. This scenario might occur if user
        // tries to play before converting all.
        if (!convertedUrl && format !== "mp4") {
            await convertToMp4();
            return;
        }

        if (isPlaying) {
            pauseAudio();
        } else {
            if (audioRef.current) {
                audioRef.current.play();
                setIsPlaying(true);
            } else if (convertedUrl) {
                playConvertedAudio(convertedUrl);
            }
        }
    };

    const playConvertedAudio = (url: string) => {
        if (!audioRef.current) {
            audioRef.current = new Audio(url);
        }

        audioRef.current.onloadedmetadata = () => {
            if (audioRef.current) {
                setDuration(audioRef.current.duration);
            }
        };

        audioRef.current.onended = handleAudioEnd;
        audioRef.current.ontimeupdate = () => {
            if (audioRef.current) {
                setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
            }
        };

        audioRef.current.play();
        setIsPlaying(true);
    };

    const handleSliderChange = (newValue: number[]) => {
        const [newProgress] = newValue;
        if (audioRef.current) {
            const newTime = (newProgress / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(newProgress);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const pauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleAudioEnd = () => {
        setIsPlaying(false);
        setProgress(0);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    };

    const generateWaveform = (pcmData: Float32Array, numBars: number = 50): number[] => {
        if (!pcmData || pcmData.length === 0) return new Array(numBars).fill(0);

        const chunkSize = Math.floor(pcmData.length / numBars);
        const bars: number[] = [];

        for (let i = 0; i < numBars; i++) {
            const chunk = pcmData.slice(i * chunkSize, (i + 1) * chunkSize);
            const chunkAmplitude = chunk.reduce((sum, val) => sum + Math.abs(val), 0) / chunk.length;
            bars.push(Math.min(Math.max(chunkAmplitude * 10, 0.1), 1));
        }

        return bars;
    };

    const WaveformBars = ({
                              bars,
                              progress
                          }: {
        bars: number[],
        progress: number
    }) => {
        return (
            <div className="flex justify-center items-center space-x-1 h-10 w-full">
                {bars.map((height, index) => (
                    <motion.div
                        key={index}
                        className={`w-1 rounded-full z-10 ${
                            (index / bars.length) * 100 <= progress
                                ? 'bg-grey-500'
                                : 'bg-orange-500'
                        }`}
                        style={{
                            height: `${height * 30}px`,
                            transition: 'height 0.1s ease-in-out'
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="relative flex flex-col items-center space-y-4 w-full max-w-[200px] overflow-hidden">
            <LoadingModal isVisible={isConverting} />
            <motion.div
                initial={false}
                animate={{
                    background: isPlaying ? "" : "transparent",
                }}
                transition={{ duration: 0.5 }}
                className="w-[300px] h-[150px] p-4 rounded-lg shadow-md relative overflow-hidden"
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex justify-center mb-4"
                >
                    <Button
                        variant="orangeOutline"
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
                {format === "mp4" && bars.length > 0 ? (
                    <>
                        <WaveformBars bars={bars} progress={progress} />
                        <Slider
                            value={[progress]}
                            max={100}
                            step={0.1}
                            onValueChange={handleSliderChange}
                            className="w-full bg-orange-500"
                            aria-label="Audio progress"
                        />
                    </>
                ) : (
                    <p className="text-xs text-center text-gray-500">
                        {error ?? "Waiting for conversion..."}
                    </p>
                )}
            </motion.div>
            {error && format === "mp4" && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-2"
                >
                    {error}
                </motion.p>
            )}
            {duration !== null && format === "mp4" && (
                <motion.div className="z-50 absolute bottom-0.5 text-center text-sm text-orange-400">
                    {formatTime(duration)}
                </motion.div>
            )}
        </div>
    );
}