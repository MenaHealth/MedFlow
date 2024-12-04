// components/patientViewModels/telegram-messages/AudioNotePlayer.tsx
'use client'

'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause } from 'lucide-react';

interface AudioNotePlayerProps {
    audioBuffer: AudioBuffer | null; // Allow nullable
    mediaUrl: string; // URL for MP3 or OGG files
    format: 'ogg' | 'mp3'; // Audio format
}

export function AudioNotePlayer({ audioBuffer, mediaUrl, format }: AudioNotePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioContext = useRef<AudioContext | null>(null);
    const sourceNode = useRef<AudioBufferSourceNode | null>(null);
    const startTime = useRef<number>(0);
    const pauseTime = useRef<number>(0);
    const audioElement = useRef<HTMLAudioElement | null>(null); // For MP3 playback

    useEffect(() => {
        if (format === 'ogg') {
            audioContext.current = new AudioContext();
        }
        return () => {
            if (format === 'ogg') {
                audioContext.current?.close();
            }
        };
    }, [format]);

    const togglePlayPause = () => {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    };

    const playAudio = () => {
        if (format === 'ogg' && audioBuffer && audioContext.current) {
            // OGG Playback with AudioContext
            sourceNode.current = audioContext.current.createBufferSource();
            sourceNode.current.buffer = audioBuffer;
            sourceNode.current.connect(audioContext.current.destination);

            const offset = pauseTime.current;
            sourceNode.current.start(0, offset);
            startTime.current = audioContext.current.currentTime - offset;
            setIsPlaying(true);

            const updateProgress = () => {
                if (audioContext.current) {
                    const elapsedTime = audioContext.current.currentTime - startTime.current;
                    const progress = (elapsedTime / audioBuffer.duration) * 100;
                    setProgress(progress);

                    if (progress < 100) {
                        requestAnimationFrame(updateProgress);
                    } else {
                        setIsPlaying(false);
                        setProgress(0);
                    }
                }
            };

            updateProgress();
        } else if (format === 'mp3' && audioElement.current) {
            // MP3 Playback with HTMLAudioElement
            audioElement.current.play();
            setIsPlaying(true);

            audioElement.current.ontimeupdate = () => {
                const progress = (audioElement.current!.currentTime / audioElement.current!.duration) * 100;
                setProgress(progress);
            };

            audioElement.current.onended = () => {
                setIsPlaying(false);
                setProgress(0);
            };
        }
    };

    const pauseAudio = () => {
        if (format === 'ogg' && sourceNode.current && audioContext.current) {
            sourceNode.current.stop();
            pauseTime.current = audioContext.current.currentTime - startTime.current;
            setIsPlaying(false);
        } else if (format === 'mp3' && audioElement.current) {
            audioElement.current.pause();
            setIsPlaying(false);
        }
    };

    const handleSliderChange = (value: number[]) => {
        const newTime = (value[0] / 100);
        if (format === 'ogg' && audioBuffer) {
            pauseTime.current = newTime * audioBuffer.duration;
            setProgress(value[0]);

            if (isPlaying) {
                pauseAudio();
                playAudio();
            }
        } else if (format === 'mp3' && audioElement.current) {
            audioElement.current.currentTime = newTime * audioElement.current.duration;
            setProgress(value[0]);
        }
    };

    return (
        <div className="flex items-center space-x-2 w-full max-w-[300px]">
            <Button
                variant="outline"
                size="icon"
                onClick={togglePlayPause}
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
            {format === 'mp3' && (
                <audio ref={audioElement} src={mediaUrl} preload="metadata" />
            )}
        </div>
    );
}
