import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader } from 'lucide-react';
import CircleTimer from './CircleTimer';
import {convertToOpus} from "@/components/patientViewModels/telegram-messages/audio-conversion";

interface VoiceRecorderProps {
    onRecordingComplete: (mediaUrl: string, duration: number, waveform: Uint8Array) => void;
    isUploading: boolean;
    chatId: string;
}

const AudioRecorder: React.FC<VoiceRecorderProps> = ({
                                                         onRecordingComplete,
                                                         isUploading,
                                                         chatId
                                                     }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const audioContext = useRef<AudioContext | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const generateWaveform = async (audioBuffer: AudioBuffer): Promise<Uint8Array> => {
        const channelData = audioBuffer.getChannelData(0);
        const samplesPerWaveformByte = Math.floor(channelData.length / 40);
        const waveform: number[] = [];

        let maxAmplitude = 0;
        const amplitudes = Array.from(channelData).map(Math.abs);

        for (let i = 0; i < 40; i++) {
            const start = i * samplesPerWaveformByte;
            const end = start + samplesPerWaveformByte;
            const sectionAmplitudes = amplitudes.slice(start, end);
            const sectionMax = Math.max(...sectionAmplitudes);

            maxAmplitude = Math.max(maxAmplitude, sectionMax);
            waveform.push(sectionMax);
        }

        return new Uint8Array(waveform.map(amplitude => {
            return Math.min(31, Math.floor((amplitude / maxAmplitude) * 31));
        }));
    };

    const getSupportedMimeType = () => {
        const types = [
            'audio/ogg; codecs=opus', // Preferred for Telegram
            'audio/webm; codecs=opus',
        ];
        return types.find(type => MediaRecorder.isTypeSupported(type)) || '';
    };

    const uploadAndSendAudio = async (
        blob: Blob,
        chatId: string,
        duration: number,
        waveform: Uint8Array
    ): Promise<void> => {
        try {
            // Upload the audio file to the backend
            const formData = new FormData();
            formData.append('file', blob, 'audio-recording.wav');
            formData.append('chatId', chatId);
            formData.append('duration', duration.toString());
            formData.append('waveform', JSON.stringify(Array.from(waveform)));

            const uploadResponse = await fetch('/api/telegram-bot/upload-audio', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload audio file');
            }

            // Get the signed URL from the response
            const { signedUrl } = await uploadResponse.json();
            console.log("Signed URL from upload:", signedUrl);

            // Encode the signed URL before sending it to Telegram
            const encodedSignedUrl = encodeURIComponent(signedUrl);

            // Call the new send-audio route
            const sendResponse = await fetch(`/api/telegram-bot/${chatId}/send-audio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    signedAudioUrl: encodedSignedUrl, // Use encoded URL here
                    caption: `Audio message (${Math.round(duration)} seconds)`,
                }),
            });

            if (!sendResponse.ok) {
                throw new Error('Failed to send audio message to Telegram');
            }

            console.log('Audio message successfully sent to Telegram');
        } catch (error) {
            console.error('Error in uploadAndSendAudio:', error);
            throw error;
        }
    };

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStream(stream);
            const mimeType = getSupportedMimeType();
            if (!mimeType) {
                throw new Error('No supported MIME type found for MediaRecorder');
            }
            mediaRecorder.current = new MediaRecorder(stream, { mimeType });

            if (!mimeType) {
                throw new Error('No supported MIME type found for MediaRecorder');
            }
            mediaRecorder.current = new MediaRecorder(stream, { mimeType });

            audioContext.current = new AudioContext();
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
                    const convertedBlob = await convertToOpus(rawAudioBlob);

                    const arrayBuffer = await convertedBlob.arrayBuffer();
                    const audioBuffer = await audioContext.current!.decodeAudioData(arrayBuffer);
                    const waveform = await generateWaveform(audioBuffer);

                    // Upload the converted file and send it to Telegram
                    await uploadAndSendAudio(convertedBlob, chatId, duration, waveform);

                    onRecordingComplete('Audio sent to Telegram', duration, waveform);
                } catch (error) {
                    console.error('Error processing and sending audio:', error);
                } finally {
                    setIsProcessing(false);
                    if (audioContext.current) {
                        audioContext.current.close();
                        audioContext.current = null;
                    }
                }
            };

            mediaRecorder.current.start();
            setIsRecording(true);
            setTimeLeft(60);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    }, [onRecordingComplete, chatId]);

    const stopRecording = useCallback(() => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
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
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isRecording, stopRecording, stream]);

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isUploading || isProcessing}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
            {isUploading || isProcessing ? (
                <Loader className="animate-spin h-4 w-4" />
            ) : isRecording ? (
                <CircleTimer progress={1 - timeLeft / 60} />
            ) : (
                <Mic className="h-4 w-4" />
            )}
        </Button>
    );
};

export default AudioRecorder;

