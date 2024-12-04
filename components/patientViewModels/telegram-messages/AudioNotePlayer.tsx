// components/patientViewModels/telegram-messages/AudioNotePlayer.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause } from 'lucide-react'

interface AudioNotePlayerProps {
    audioBuffer: AudioBuffer
}

export function AudioNotePlayer({ audioBuffer }: AudioNotePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const audioContext = useRef<AudioContext | null>(null)
    const sourceNode = useRef<AudioBufferSourceNode | null>(null)
    const startTime = useRef<number>(0)
    const pauseTime = useRef<number>(0)

    useEffect(() => {
        audioContext.current = new AudioContext()
        return () => {
            audioContext.current?.close()
        }
    }, [])

    const togglePlayPause = () => {
        if (isPlaying) {
            pauseAudio()
        } else {
            playAudio()
        }
    }

    const playAudio = () => {
        if (!audioContext.current) return

        sourceNode.current = audioContext.current.createBufferSource()
        sourceNode.current.buffer = audioBuffer
        sourceNode.current.connect(audioContext.current.destination)

        const offset = pauseTime.current
        sourceNode.current.start(0, offset)
        startTime.current = audioContext.current.currentTime - offset
        setIsPlaying(true)

        const updateProgress = () => {
            if (audioContext.current) {
                const elapsedTime = audioContext.current.currentTime - startTime.current
                const progress = (elapsedTime / audioBuffer.duration) * 100
                setProgress(progress)

                if (progress < 100) {
                    requestAnimationFrame(updateProgress)
                } else {
                    setIsPlaying(false)
                    setProgress(0)
                }
            }
        }

        updateProgress()
    }

    const pauseAudio = () => {
        if (sourceNode.current && audioContext.current) {
            sourceNode.current.stop()
            pauseTime.current = audioContext.current.currentTime - startTime.current
            setIsPlaying(false)
        }
    }

    const handleSliderChange = (value: number[]) => {
        const newTime = (value[0] / 100) * audioBuffer.duration
        pauseTime.current = newTime
        setProgress(value[0])

        if (isPlaying) {
            pauseAudio()
            playAudio()
        }
    }

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
        </div>
    )
}
