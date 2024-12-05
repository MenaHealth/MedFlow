import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader } from 'lucide-react';

interface VoiceRecorderProps {
    onRecordingComplete: (blob: Blob) => void;
    isUploading: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, isUploading }) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    const getSupportedMimeType = () => {
        const types = [
            'audio/ogg; codecs=opus', // Ensure this is used
            'audio/webm; codecs=opus',
            'audio/webm',
            'audio/mp4',
            'audio/mpeg',
        ];
        return types.find(type => MediaRecorder.isTypeSupported(type)) || '';
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

            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: mimeType });
                onRecordingComplete(audioBlob);
                audioChunks.current = [];
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    }, [onRecordingComplete]);

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
    );
};

export default VoiceRecorder;

