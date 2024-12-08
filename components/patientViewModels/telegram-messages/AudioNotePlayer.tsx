// components/patientViewModels/telegram-messages/AudioNotePlayer.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause } from 'lucide-react';
import { createWebAssemblyDecoder } from 'opus-stream-decoder';

interface AudioNotePlayerProps {
    mediaUrl: string;
    audioBuffer: AudioBuffer | null;
    format: string;
}

export function AudioNotePlayer({ mediaUrl }: AudioNotePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [audioDuration, setAudioDuration] = useState<number>(0);

    const audioContext = useRef<AudioContext | null>(null);
    const sourceNode = useRef<AudioBufferSourceNode | null>(null);
    const decodedBuffer = useRef<AudioBuffer | null>(null); // Renamed to avoid confusion
    const animationFrameId = useRef<number | null>(null);

    const playbackState = useRef({
        startTime: 0,
        pausedAt: 0,
        totalPausedTime: 0,
    });

    useEffect(() => {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        fetchAndLoadAudio();

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            audioContext.current?.close();
        };
    }, [mediaUrl]);

    const fetchAndLoadAudio = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(mediaUrl, { mode: 'cors' });
            if (!response.ok) {
                throw new Error(`Failed to fetch audio file: ${response.statusText}`);
            }

            const arrayBuffer = await response.arrayBuffer();

            // Check format or try decoding with opus-stream-decoder if ogg
            // You could also do something like:
            // const canPlayOgg = (new Audio()).canPlayType('audio/ogg; codecs="opus"');
            // if (!canPlayOgg) { ... use opus-stream-decoder } else { ... decodeAudioData }

            // For now, let's attempt to decode with opus-stream-decoder if it's likely .ogg
            if (mediaUrl.endsWith('.ogg') || mediaUrl.includes('.ogg')) {
                // Decode using opus-stream-decoder
                await decodeWithOpusStreamDecoder(arrayBuffer);
            } else {
                // Fallback to native decodeAudioData for formats that are commonly supported (like mp3, wav)
                await decodeNative(arrayBuffer);
            }

            if (!decodedBuffer.current || decodedBuffer.current.duration <= 0) {
                throw new Error("Decoded audio duration is zero or invalid.");
            }

            setAudioDuration(decodedBuffer.current.duration);
        } catch (err: any) {
            console.error('Error loading audio:', err);
            setError(getFriendlyErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    const decodeNative = async (arrayBuffer: ArrayBuffer) => {
        // Try using the native WebAudio decoding
        try {
            const audioBuf = await audioContext.current!.decodeAudioData(arrayBuffer);
            decodedBuffer.current = audioBuf;
        } catch (e) {
            console.error("Native decoding failed:", e);
            throw new Error("Native decoding failed. Possibly unsupported format on this device/browser.");
        }
    };

    const decodeWithOpusStreamDecoder = async (arrayBuffer: ArrayBuffer) => {
        try {
            const wasmModule = await fetch('/public/opus-stream-decoder.wasm').then(res => res.arrayBuffer());
            const { decode } = await createWebAssemblyDecoder({ wasmBinary: wasmModule });

            const result = await decode(arrayBuffer);

            // Result typically has { channelData, samples, sampleRate, channelCount }
            const { channelData, sampleRate, channelCount } = result;

            // channelData is usually an array of Float32Array per channel
            // Create an AudioBuffer from the channel data
            const length = channelData[0].length;
            const audioBuf = audioContext.current!.createBuffer(channelCount, length, sampleRate);

            for (let i = 0; i < channelCount; i++) {
                audioBuf.getChannelData(i).set(channelData[i]);
            }

            decodedBuffer.current = audioBuf;
        } catch (e) {
            console.error("Opus decoding failed:", e);
            throw new Error("Opus decoding failed. Possibly unsupported .ogg format or decoding error.");
        }
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    };

    const playAudio = () => {
        if (decodedBuffer.current && audioContext.current) {
            if (sourceNode.current) {
                sourceNode.current.stop();
            }

            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }

            sourceNode.current = audioContext.current.createBufferSource();
            sourceNode.current.buffer = decodedBuffer.current;
            sourceNode.current.connect(audioContext.current.destination);

            const currentTime = audioContext.current.currentTime;
            const offset = playbackState.current.pausedAt;

            sourceNode.current.start(0, offset);

            playbackState.current.startTime = currentTime;
            setIsPlaying(true);

            sourceNode.current.onended = () => {
                setIsPlaying(false);
                setProgress(0);
                playbackState.current = {
                    startTime: 0,
                    pausedAt: 0,
                    totalPausedTime: 0,
                };
            };

            const updateProgress = () => {
                if (!audioContext.current || !decodedBuffer.current) return;
                const currentTime = audioContext.current.currentTime;
                const totalDuration = decodedBuffer.current.duration;

                const elapsedTime = currentTime - playbackState.current.startTime;
                const playedTime = playbackState.current.pausedAt + elapsedTime;

                const progressValue = Math.min(
                    (playedTime / totalDuration) * 100,
                    100
                );

                setProgress((prevProgress) => {
                    return Math.abs(prevProgress - progressValue) > 0.1
                        ? progressValue
                        : prevProgress;
                });

                if (progressValue < 100) {
                    animationFrameId.current = requestAnimationFrame(updateProgress);
                }
            };

            updateProgress();
        } else {
            console.error("No decoded audio buffer available.");
            setError("No decoded audio buffer available. Cannot play.");
        }
    };

    const pauseAudio = () => {
        if (sourceNode.current && audioContext.current && decodedBuffer.current) {
            sourceNode.current.stop();
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }

            const currentTime = audioContext.current.currentTime;
            const elapsedTime = currentTime - playbackState.current.startTime;
            playbackState.current.pausedAt += elapsedTime;

            const progressValue = Math.min(
                (playbackState.current.pausedAt / decodedBuffer.current.duration) * 100,
                100
            );
            setProgress(progressValue);
            setIsPlaying(false);
        }
    };

    const handleSliderChange = (value: number[]) => {
        if (!decodedBuffer.current || !audioContext.current) return;
        const newTime = (value[0] / 100) * audioDuration;

        playbackState.current.pausedAt = newTime;
        setProgress(value[0]);

        if (isPlaying) {
            pauseAudio();
            playAudio();
        }
    };

    const getFriendlyErrorMessage = (error: any) => {
        if (error.message?.includes('Failed to fetch')) {
            return 'Audio not retrieved. Check the network or file URL.';
        }
        if (error.message?.includes('Native decoding failed')) {
            return 'Cannot parse audio on this device due to unsupported .ogg format.';
        }
        if (error.message?.includes('Opus decoding failed')) {
            return 'Error decoding .ogg opus file. Browser may not support format.';
        }
        return 'An unknown error occurred while loading audio.';
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
                aria-label={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Slider
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={handleSliderChange}
                className="flex-grow"
                aria-label="Audio progress"
            />
        </div>
    );
}