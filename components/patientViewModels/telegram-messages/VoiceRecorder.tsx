// components/patientViewModels/telegram-messages/VoiceRecorder.tsx
'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Mic, Square, Loader } from 'lucide-react'

interface VoiceRecorderProps {
    onRecordingComplete: (blob: Blob) => void
    isUploading: boolean
}

export function VoiceRecorder({ onRecordingComplete, isUploading }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false)
    const mediaRecorder = useRef<MediaRecorder | null>(null)
    const audioChunks = useRef<Blob[]>([])

    const stopRecording = () => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);

            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = () => {
                if (audioChunks.current.length) {
                    const audioBlob = new Blob(audioChunks.current, { type: 'audio/ogg; codecs=opus' });
                    onRecordingComplete(audioBlob);
                    audioChunks.current = [];
                }
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isUploading}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
            {isUploading ? (
                <Loader className="animate-spin h-4 w-4" />
            ) : isRecording ? (
                <Square className="h-4 w-4" />
            ) : (
                <Mic className="h-4 w-4" />
            )}
        </Button>
    )
}