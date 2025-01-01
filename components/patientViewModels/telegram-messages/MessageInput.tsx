// Medflow/components/patientViewModels/telegram-messages/MessageInput.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Send, Image, Plus } from 'lucide-react';
import AudioRecorder from "@/components/patientViewModels/telegram-messages/AudioRecorder";
import { AutoExpandingInput } from "@/components/ui/auto-expanding-input";

interface MessageInputProps {
    newMessage: string;
    setNewMessage: (message: string) => void;
    sendMessage: () => void;
    sendImage: (file: File) => void;
    sendAudioMessage: (file: Blob, duration: number) => void;
    isLoading: boolean;
    telegramChatId: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
    newMessage,
    setNewMessage,
    sendMessage,
    sendImage,
    sendAudioMessage,
    isLoading,
    telegramChatId,
}) => {
    const [expanded, setExpanded] = React.useState(false);

    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB limit for images

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            if (file.size > MAX_IMAGE_SIZE) {
                alert("File size exceeds the limit. Please upload a smaller file.");
                return;
            }
            sendImage(file);
        }
    };

    const handleRecordingComplete = (file: Blob, duration: number) => {
        sendAudioMessage(file, duration); // Pass the Blob and duration
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
            }}
            className="flex flex-col w-full gap-2"
        >
            <div className="flex items-end gap-2">
                <AutoExpandingInput
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    minRows={1}
                    maxRows={5}
                    className="flex-grow"
                />
                <div className="flex gap-2">
                    <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => setExpanded((prev) => !prev)}
                        className="rounded-full h-10 w-10"
                    >
                        <Plus className={`h-4 w-4 transform ${expanded ? "rotate-45" : ""}`} />
                        <span className="sr-only">Toggle Options</span>
                    </Button>

                    {expanded && (
                        <div className="flex gap-2 mt-2 transition-all duration-300">
                    <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => document.getElementById("image-upload")?.click()}
                        className="rounded-full h-10 w-10"
                    >
    <Image className="h-4 w-4" aria-label="Upload Image" />
    <span className="sr-only">Upload Image</span>
</Button>

                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <AudioRecorder
                                chatId={telegramChatId}
                                isUploading={isLoading}
                                onRecordingComplete={(file: Blob, duration: number) => handleRecordingComplete(file, duration)}
                            />
                        </div>
                    )}

                    <Button
                        variant="orange"
                        type="submit"
                        size="icon"
                        disabled={isLoading || newMessage.trim().length === 0}
                        className="rounded-full h-10 w-10 transition-colors"
                    >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
            </div>
        </form>
    );
};
