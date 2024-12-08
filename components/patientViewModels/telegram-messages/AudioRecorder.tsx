// components/patientViewModels/telegram-messages/AudioRecorder.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader } from 'lucide-react';
import { convertToOpus } from './audio-conversion';

interface VoiceRecorderProps {
    onRecordingComplete: (file: Blob, duration: number) => void;
    isUploading: boolean;
    chatId: string;
}

const AudioRecorder: React.FC<VoiceRecorderProps> = ({
                                                         onRecordingComplete,
                                                         isUploading,
                                                         chatId,
                                                     }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);

    const audioChunks = useRef<Blob[]>([]);
    const startTimeRef = useRef<number | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            setStream(stream);
            const mimeType = "audio/webm; codecs=opus";

            mediaRecorder.current = new MediaRecorder(stream, { mimeType });

            startTimeRef.current = Date.now();

            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            mediaRecorder.current.onstop = async () => {
                const rawAudioBlob = new Blob(audioChunks.current, { type: mimeType });
                audioChunks.current = [];

                const duration = startTimeRef.current
                    ? Math.round((Date.now() - startTimeRef.current) / 1000)
                    : 0;

                setIsProcessing(true);

                try {
                    console.log("[DEBUG] Raw audio Blob:", {
                        type: rawAudioBlob.type,
                        size: rawAudioBlob.size,
                    });

                    // Convert the raw audio to Opus format
                    const convertedAudioBlob = await convertToOpus(rawAudioBlob);

                    console.log("[DEBUG] Converted audio Blob:", {
                        type: convertedAudioBlob.type,
                        size: convertedAudioBlob.size,
                    });

                    // Pass the converted audio to the parent component
                    onRecordingComplete(convertedAudioBlob, duration);
                } catch (error) {
                    console.error("Error processing audio:", error);
                } finally {
                    setIsProcessing(false);
                }
            };

            mediaRecorder.current.start();
            setIsRecording(true);
            setTimeLeft(60);
        } catch (error) {
            console.error("Error starting recording:", error);
        }
    }, [onRecordingComplete]);

    const stopRecording = useCallback(() => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
                setStream(null);
            }
        }
    }, [isRecording, stream]);

    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        stopRecording();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [isRecording, stopRecording, stream]);

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isUploading || isProcessing}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
            {isUploading || isProcessing ? (
                <Loader className="animate-spin h-4 w-4" />
            ) : isRecording ? (
                <Square className="h-4 w-4" />
            ) : (
                <Mic className="h-4 w-4" />
            )}
        </Button>
    );
};

export default AudioRecorder;