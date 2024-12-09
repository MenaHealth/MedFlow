// components/patientViewModels/telegram-messages/AudioNotePlayer.tsx
import React, { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Loader } from "lucide-react";

interface AudioNotePlayerProps {
    mediaUrl: string;
}

export const LoadingModal = ({ isVisible }: { isVisible: boolean }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-md">
                <p className="text-sm text-gray-700">Converting audio, please wait...</p>
                <Loader className="h-6 w-6 animate-spin text-primary mt-2" />
            </div>
        </div>
    );
};

export function AudioNotePlayer({ mediaUrl }: AudioNotePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const ffmpeg = useRef(new FFmpeg());

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

            // Load FFmpeg if not already loaded
            if (!ffmpeg.current.loaded) {
                await ffmpeg.current.load();
            }

            const inputFileName = "input.ogg";
            const outputFileName = "output.mp4";

            await ffmpeg.current.writeFile(inputFileName, await fetchFile(oggFile));
            await ffmpeg.current.exec([
                "-i",
                inputFileName,
                "-c:a",
                "aac",
                "-b:a",
                "192k",
                outputFileName,
            ]);

            const data = await ffmpeg.current.readFile(outputFileName);
            const mp4Blob = new Blob([data], { type: "video/mp4" });
            const mp4Url = URL.createObjectURL(mp4Blob);

            setConvertedUrl(mp4Url);
            setIsConverting(false);

            // Automatically play the converted audio
            playConvertedAudio(mp4Url);
        } catch (err) {
            console.error("Error during conversion:", err);
            setError("Failed to convert audio.");
            setIsConverting(false);
        }
    };

    const togglePlayPause = async () => {
        if (isConverting) return;

        if (!convertedUrl) {
            await convertToMp4();
            return;
        }

        if (isPlaying) {
            pauseAudio();
        } else {
            playConvertedAudio(convertedUrl);
        }
    };

    const playConvertedAudio = (url: string) => {
        if (!audioRef.current) {
            audioRef.current = new Audio(url);
            audioRef.current.onended = handleAudioEnd;
            audioRef.current.ontimeupdate = () => {
                if (audioRef.current) {
                    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
                }
            };
        }

        // Set audio device routing to headphones if available
        audioRef.current.play().then(() => {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                const headphones = devices.find((device) =>
                    device.label.toLowerCase().includes("headphone")
                );
                if (headphones) {
                    console.log("Routing audio to headphones:", headphones.label);
                    // Browser handles this automatically, but manual routing APIs are limited.
                }
            });
        });

        setIsPlaying(true);
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

            // Reset audio to system default (e.g., background music)
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                console.log("Returning control to default audio route.");
                // Browser handles this automatically
            });
        }
    };

    return (
        <div className="flex flex-col items-center space-y-2 w-full max-w-[300px]">
            {isConverting && <LoadingModal isVisible />}
            <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayPause}
                disabled={isConverting}
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                {isConverting ? (
                    <Loader className="h-4 w-4 animate-spin" />
                ) : isPlaying ? (
                    <Pause className="h-4 w-4" />
                ) : (
                    <Play className="h-4 w-4" />
                )}
            </Button>
            <Slider
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={() => {}}
                className="flex-grow"
                aria-label="Audio progress"
            />
            <span className="text-sm">{`${Math.round(progress)}%`}</span>
        </div>
    );
}