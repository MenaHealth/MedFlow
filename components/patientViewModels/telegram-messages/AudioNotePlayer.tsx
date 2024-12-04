// components/patientViewModels/telegram-messages/AudioNotePlayer.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause } from 'lucide-react';
import { OggOpusDecoder } from 'ogg-opus-decoder';

interface AudioNotePlayerProps {
    mediaUrl: string;
    format: 'ogg' | 'mp3';
}

export function AudioNotePlayer({ mediaUrl, format }: AudioNotePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const audioContext = useRef<AudioContext | null>(null);
    const sourceNode = useRef<AudioBufferSourceNode | null>(null);
    const startTime = useRef<number>(0);
    const pauseTime = useRef<number>(0);
    const audioElement = useRef<HTMLAudioElement | null>(null);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const oggOpusDecoder = useRef<OggOpusDecoder | null>(null);

    useEffect(() => {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();

        if (format === 'ogg') {
            fetchAndDecodeOgg();
        } else {
            setIsLoading(false);
        }

        return () => {
            audioContext.current?.close();
            oggOpusDecoder.current?.free();
        };
    }, [format, mediaUrl]);

    const fetchAndDecodeOgg = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(mediaUrl);
            const arrayBuffer = await response.arrayBuffer();

            oggOpusDecoder.current = new OggOpusDecoder();
            await oggOpusDecoder.current.ready;

            const { channelData, sampleRate } = await oggOpusDecoder.current.decodeFile(new Uint8Array(arrayBuffer));

            const newAudioBuffer = audioContext.current!.createBuffer(
                channelData.length,
                channelData[0].length,
                sampleRate
            );

            for (let i = 0; i < channelData.length; i++) {
                newAudioBuffer.copyToChannel(channelData[i], i);
            }

            setAudioBuffer(newAudioBuffer);
        } catch (error) {
            console.error('Error fetching and decoding audio:', error);
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
        if (format === 'ogg' && audioBuffer && audioContext.current) {
            sourceNode.current = audioContext.current.createBufferSource();
            sourceNode.current.buffer = audioBuffer;
            sourceNode.current.connect(audioContext.current.destination);

            const offset = pauseTime.current;
            sourceNode.current.start(0, offset);
            startTime.current = audioContext.current.currentTime - offset;
            setIsPlaying(true);

            const updateProgress = () => {
                if (audioContext.current && sourceNode.current) {
                    const elapsedTime = audioContext.current.currentTime - startTime.current;
                    const duration = sourceNode.current.buffer?.duration || 0;
                    const progress = (elapsedTime / duration) * 100;
                    setProgress(progress);

                    if (progress < 100 && isPlaying) {
                        requestAnimationFrame(updateProgress);
                    } else if (progress >= 100) {
                        setIsPlaying(false);
                        setProgress(0);
                    }
                }
            };

            updateProgress();
        } else if (format === 'mp3' && audioElement.current) {
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

    if (isLoading) {
        return <div>Loading audio...</div>;
    }

    return (
        <div className="flex items-center space-x-2 w-full max-w-[300px]">
            <Button
                variant="outline"
                size="icon"
                onClick={togglePlayPause}
                disabled={isLoading || (format === 'ogg' && !audioBuffer)}
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

