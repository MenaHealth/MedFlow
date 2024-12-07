// components/patientViewModels/telegram-messages/AudioNotePlayer.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause } from 'lucide-react';
import { OggOpusDecoder } from 'ogg-opus-decoder';

// AudioNotePlayer.tsx
interface AudioNotePlayerProps {
    mediaUrl: string;         // URL of the audio file
    audioBuffer: AudioBuffer | null; // Optional, decoded audio data
    format: string;           // Format of the audio file
}
export function AudioNotePlayer({ mediaUrl }: AudioNotePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [audioDuration, setAudioDuration] = useState<number>(0);
    const audioContext = useRef<AudioContext | null>(null);
    const sourceNode = useRef<AudioBufferSourceNode | null>(null);
    const startTime = useRef<number>(0);
    const pauseTime = useRef<number>(0);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const oggOpusDecoder = useRef<OggOpusDecoder | null>(null);

    useEffect(() => {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        fetchAndDecodeOgg();

        return () => {
            audioContext.current?.close();
            oggOpusDecoder.current?.free();
        };
    }, [mediaUrl]);

    const fetchAndDecodeOgg = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Fetching audio from:', mediaUrl);
            const response = await fetch(mediaUrl, { mode: 'cors' });
            if (!response.ok) {
                throw new Error(`Failed to fetch audio file: ${response.statusText}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            try {
                const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);
                setAudioBuffer(audioBuffer);
                setAudioDuration(audioBuffer.duration);
            } catch (decodeError) {
                console.error('Fallback decodeAudioData failed:', decodeError);
                throw new Error('Audio decoding failed.');
            }

            try {
                oggOpusDecoder.current = new OggOpusDecoder();
                await oggOpusDecoder.current.ready;
            } catch (decoderError) {
                console.error('Error initializing OggOpusDecoder:', decoderError);
                throw new Error('Failed to initialize OggOpusDecoder.');
            }

            const { channelData, sampleRate } = await oggOpusDecoder.current.decodeFile(new Uint8Array(arrayBuffer));

            console.log('Decoded channel data:', channelData);

            if (!channelData || channelData.length === 0) {
                throw new Error('Decoded audio has no valid channels.');
            }

            const numChannels = channelData.length;
            const bufferLength = channelData[0]?.length || 0;

            if (numChannels < 1 || numChannels > 32 || bufferLength < 1) {
                throw new Error(`Invalid audio data: channels=${numChannels}, length=${bufferLength}`);
            }

            const newAudioBuffer = audioContext.current!.createBuffer(
                numChannels,
                bufferLength,
                sampleRate
            );

            for (let i = 0; i < numChannels; i++) {
                if (channelData[i]) {
                    newAudioBuffer.copyToChannel(channelData[i], i);
                }
            }

            setAudioBuffer(newAudioBuffer);
            setAudioDuration(newAudioBuffer.duration);
        } catch (error) {
            console.error('Error fetching and decoding audio:', error);
            setError(`Error decoding audio file: ${error instanceof Error ? error.message : String(error)}`);
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
        if (audioBuffer && audioContext.current) {
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
                    const progressValue = (elapsedTime / audioBuffer.duration) * 100;
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
        if (audioBuffer) {
            pauseTime.current = newTime;
            setProgress(value[0]);

            if (isPlaying) {
                pauseAudio();
                playAudio();
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
                variant="outline"
                size="icon"
                onClick={togglePlayPause}
                disabled={isLoading || !audioBuffer}
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

