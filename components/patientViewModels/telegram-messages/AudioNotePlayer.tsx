// components/patientViewModels/telegram-messages/AudioNotePlayer.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause } from 'lucide-react';

interface AudioNotePlayerProps {
    mediaUrl: string; // Signed URL of the audio file
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
    const startTime = useRef<number>(0);
    const pauseTime = useRef<number>(0);

    useEffect(() => {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        fetchAndLoadAudio();

        return () => {
            audioContext.current?.close();
        };
    }, [mediaUrl]);

    const fetchAndLoadAudio = async () => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('Fetching audio from:', mediaUrl);
            const response = await fetch(mediaUrl, { mode: 'cors' });
            if (!response.ok) {
                throw new Error(`Failed to fetch audio file: ${response.statusText}`);
            }

            const arrayBuffer = await response.arrayBuffer();

            const decodedAudio = await audioContext.current!.decodeAudioData(arrayBuffer);
            audioBuffer.current = decodedAudio;
            setAudioDuration(decodedAudio.duration);
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
            sourceNode.current = audioContext.current.createBufferSource();
            sourceNode.current.buffer = audioBuffer.current;
            sourceNode.current.connect(audioContext.current.destination);

            const offset = pauseTime.current;
            sourceNode.current.start(0, offset);
            startTime.current = audioContext.current.currentTime - offset;
            setIsPlaying(true);

            const updateProgress = () => {
                if (audioContext.current && sourceNode.current) {
                    const elapsedTime = audioContext.current.currentTime - startTime.current;
                    const progressValue = (elapsedTime / audioBuffer.current!.duration) * 100;
                    setProgress(progressValue);

                    if (progressValue < 100 && isPlaying) {
                        requestAnimationFrame(updateProgress);
                    } else if (progressValue >= 100) {
                        setIsPlaying(false);
                        setProgress(0);
                        pauseTime.current = 0;
                    }
                }
            };

            updateProgress();
        }
    };

    const pauseAudio = () => {
        if (sourceNode.current && audioContext.current) {
            sourceNode.current.stop();
            pauseTime.current = audioContext.current.currentTime - startTime.current;
            setIsPlaying(false);
        }
    };

    const handleSliderChange = (value: number[]) => {
        const newTime = (value[0] / 100) * audioDuration;
        pauseTime.current = newTime;
        setProgress(value[0]);

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
                variant="outline"
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