import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader } from 'lucide-react';

interface AudioRecorderProps {
    onRecordingComplete: (mediaUrl: string) => void;
    isUploading: boolean;
    chatId: string; // New prop for telegramChatId
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, isUploading, chatId }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    const getSupportedMimeType = () => {
        const types = [
            'audio/ogg; codecs=opus',
            'audio/webm; codecs=opus',
        ];
        return types.find(type => MediaRecorder.isTypeSupported(type)) || '';
    };

    const uploadAudio = async (blob: Blob, chatId: string): Promise<string> => {
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('chatId', chatId); // Include chatId in upload

        const response = await fetch('/api/telegram-bot/upload-audio', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload audio file');
        }

        const { fileUrl } = await response.json();
        return fileUrl;
    };

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mimeType = getSupportedMimeType();

            if (!mimeType) {
                throw new Error('No supported MIME type found for MediaRecorder');
            }

            mediaRecorder.current = new MediaRecorder(stream, { mimeType });

            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: mimeType });
                audioChunks.current = [];

                setIsProcessing(true);
                try {
                    const fileUrl = await uploadAudio(audioBlob, chatId); // Pass chatId here
                    onRecordingComplete(fileUrl);
                } catch (error) {
                    console.error('Error uploading audio:', error);
                } finally {
                    setIsProcessing(false);
                }
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    }, [onRecordingComplete, chatId]);

    const stopRecording = useCallback(() => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

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
                <Square className="h-4 w-4" />
            ) : (
                <Mic className="h-4 w-4" />
            )}
        </Button>
    );
};

export default AudioRecorder;


// // Helper function to convert PCM to WAV
// const pcmToWav = (pcmData: Float32Array, sampleRate: number): Promise<Blob> => {
//     return new Promise((resolve) => {
//         const wavData = new ArrayBuffer(44 + pcmData.length * 2);
//         const view = new DataView(wavData);
//
//         // Write WAV header
//         writeString(view, 0, 'RIFF');
//         view.setUint32(4, 36 + pcmData.length * 2, true);
//         writeString(view, 8, 'WAVE');
//         writeString(view, 12, 'fmt ');
//         view.setUint32(16, 16, true);
//         view.setUint16(20, 1, true);
//         view.setUint16(22, 1, true);
//         view.setUint32(24, sampleRate, true);
//         view.setUint32(28, sampleRate * 2, true);
//         view.setUint16(32, 2, true);
//         view.setUint16(34, 16, true);
//         writeString(view, 36, 'data');
//         view.setUint32(40, pcmData.length * 2, true);
//
//         // Write PCM data
//         floatTo16BitPCM(view, 44, pcmData);
//
//         resolve(new Blob([wavData], { type: 'audio/wav' }));
//     });
// };
//
// const writeString = (view: DataView, offset: number, string: string) => {
//     for (let i = 0; i < string.length; i++) {
//         view.setUint8(offset + i, string.charCodeAt(i));
//     }
// };
//
// const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
//     for (let i = 0; i < input.length; i++, offset += 2) {
//         const s = Math.max(-1, Math.min(1, input[i]));
//         output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
//     }
// };
