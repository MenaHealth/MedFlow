// components/patientViewModels/telegram-messages/AudioNotePlayer.tsx
import React, { useState, useRef, useEffect } from "react";
import { OggOpusDecoder } from "ogg-opus-decoder";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause } from "lucide-react";

interface AudioNotePlayerProps {
    mediaUrl: string;
    audioBuffer?: AudioBuffer | null; // Make this optional if it's not always passed
    format?: string; // Make this optional if it's not always passed
}

export function AudioNotePlayer({ mediaUrl }: AudioNotePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [audioDuration, setAudioDuration] = useState<number>(0);

    const audioContext = useRef<AudioContext | null>(null);
    const sourceNode = useRef<AudioBufferSourceNode | null>(null);
    const decodedBuffer = useRef<AudioBuffer | null>(null);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        fetchAndDecodeAudio();

        return () => {
            if (sourceNode.current) {
                sourceNode.current.stop();
            }
            audioContext.current?.close();
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, [mediaUrl]);

    const fetchAndDecodeAudio = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(mediaUrl, { mode: "cors" });
            if (!response.ok) {
                throw new Error(`Failed to fetch audio file: ${response.statusText}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            if (arrayBuffer.byteLength === 0) {
                throw new Error("Empty audio file.");
            }

            const buffer = new Uint8Array(arrayBuffer);

            // Debugging logs
            console.log("Fetched buffer:", buffer);

            const oggDecoder = new OggOpusDecoder();
            await oggDecoder.ready;

            const decodedOgg = await oggDecoder.decode(buffer);

            if (!decodedOgg || !decodedOgg.channelData) {
                throw new Error("No valid channel data found.");
            }

            console.log("Decoded Ogg:", decodedOgg);

            if (!audioContext.current) {
                throw new Error("Audio context not initialized.");
            }

            const audioBuffer = audioContext.current.createBuffer(
                decodedOgg.channelData.length,
                decodedOgg.channelData[0].length,
                decodedOgg.sampleRate
            );

            for (let i = 0; i < decodedOgg.channelData.length; i++) {
                audioBuffer.getChannelData(i).set(decodedOgg.channelData[i]);
            }

            decodedBuffer.current = audioBuffer;
            setAudioDuration(audioBuffer.duration);
            setIsLoading(false);
        } catch (err) {
            console.error("Error decoding audio:", err);
            setError(err instanceof Error ? err.message : "Failed to decode the audio file");
            setIsLoading(false);
        }
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    };

    const playAudio = async () => {
        if (!decodedBuffer.current && !isLoading) {
            setIsLoading(true);
            await fetchAndDecodeAudio();
        }

        if (decodedBuffer.current && audioContext.current) {
            if (sourceNode.current) {
                sourceNode.current.stop();
            }

            sourceNode.current = audioContext.current.createBufferSource();
            sourceNode.current.buffer = decodedBuffer.current;
            sourceNode.current.connect(audioContext.current.destination);
            sourceNode.current.start(0);
            setIsPlaying(true);

            sourceNode.current.onended = () => {
                setIsPlaying(false);
                setProgress(0);
            };
        }
    };

    const pauseAudio = () => {
        if (sourceNode.current) {
            sourceNode.current.stop();
            setIsPlaying(false);
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        }
    };

    if (isLoading) {
        return <div>Loading audio...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="flex items-center space-x-2 w-full max-w-[300px]">
            <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayPause}
                disabled={isLoading || !decodedBuffer.current}
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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