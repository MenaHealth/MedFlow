// components/patientViewModels/telegram-messages/AudioNotePlayer.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause } from 'lucide-react';

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
    const audioBuffer = useRef<AudioBuffer | null>(null);
    const animationFrameId = useRef<number | null>(null);

    // Track current playback state
    const playbackState = useRef({
        startTime: 0,
        pausedAt: 0,
        totalPausedTime: 0,
    });

    useEffect(() => {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        fetchAndLoadAudio();

        return () => {
            // Cancel any ongoing animation frame
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
            const decodedAudio = await audioContext.current!.decodeAudioData(arrayBuffer);
            audioBuffer.current = decodedAudio;

            if (decodedAudio.duration > 0) {
                setAudioDuration(decodedAudio.duration);
            } else {
                throw new Error("Audio duration is zero or invalid.");
            }
        } catch (error) {
            console.error('Error loading audio:', error);
            setError('Error loading audio file.');
        } finally {
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

    const playAudio = () => {
        if (audioBuffer.current && audioContext.current) {
            // Stop any existing source node
            if (sourceNode.current) {
                sourceNode.current.stop();
            }

            // Cancel any existing animation frame
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }

            sourceNode.current = audioContext.current.createBufferSource();
            sourceNode.current.buffer = audioBuffer.current;
            sourceNode.current.connect(audioContext.current.destination);

            // Calculate the playback offset
            const currentTime = audioContext.current.currentTime;
            const offset = playbackState.current.pausedAt;

            // Start the audio
            sourceNode.current.start(0, offset);

            // Update playback state
            playbackState.current.startTime = currentTime;
            setIsPlaying(true);

            // Reset state when audio ends
            sourceNode.current.onended = () => {
                setIsPlaying(false);
                setProgress(0);
                playbackState.current = {
                    startTime: 0,
                    pausedAt: 0,
                    totalPausedTime: 0,
                };
            };

            // Progress tracking function
            const updateProgress = () => {
                if (!audioContext.current || !audioBuffer.current) return;

                const currentTime = audioContext.current.currentTime;
                const totalDuration = audioBuffer.current.duration;

                // Calculate actual played time
                const elapsedTime = currentTime - playbackState.current.startTime;
                const playedTime = playbackState.current.pausedAt + elapsedTime;

                // Calculate progress percentage
                const progressValue = Math.min(
                    (playedTime / totalDuration) * 100,
                    100
                );

                // Update progress
                setProgress((prevProgress) => {
                    return Math.abs(prevProgress - progressValue) > 0.1
                        ? progressValue
                        : prevProgress;
                });

                // Continue updating until playback ends
                if (progressValue < 100) {
                    animationFrameId.current = requestAnimationFrame(updateProgress);
                }
            };

            // Start progress tracking
            updateProgress();
        }
    };

    const pauseAudio = () => {
        if (sourceNode.current && audioContext.current && audioBuffer.current) {
            // Stop the source node
            sourceNode.current.stop();

            // Cancel animation frame
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }

            // Calculate paused time
            const currentTime = audioContext.current.currentTime;
            const elapsedTime = currentTime - playbackState.current.startTime;
            playbackState.current.pausedAt += elapsedTime;

            // Update progress
            const progressValue = Math.min(
                (playbackState.current.pausedAt / audioBuffer.current.duration) * 100,
                100
            );
            setProgress(progressValue);

            // Update playing state
            setIsPlaying(false);
        }
    };

    const handleSliderChange = (value: number[]) => {
        if (!audioBuffer.current || !audioContext.current) return;

        const newTime = (value[0] / 100) * audioDuration;

        // Update the paused time
        playbackState.current.pausedAt = newTime;

        // Update progress
        setProgress(value[0]);

        // If currently playing, restart playback from new position
        if (isPlaying) {
            pauseAudio();
            playAudio();
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
                disabled={isLoading || !audioBuffer.current}
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