import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Image, Plus } from "lucide-react";
import { VoiceRecorder } from "@/components/patientViewModels/telegram-messages/VoiceRecorder";
import { AutoExpandingInput } from "@/components/ui/auto-expanding-input";

interface MessageInputProps {
    newMessage: string;
    setNewMessage: (message: string) => void;
    sendMessage: () => void;
    sendImage: (file: File) => void;
    sendVoiceRecording: (blob: Blob) => void;
    isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
                                                              newMessage,
                                                              setNewMessage,
                                                              sendMessage,
                                                              sendImage,
                                                              sendVoiceRecording,
                                                              isLoading,
                                                          }) => {
    const [expanded, setExpanded] = useState(false); // State to toggle visibility

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            sendImage(e.target.files[0]);
        }
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
                {/* Input for typing a message */}
                <AutoExpandingInput
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    minRows={1}
                    maxRows={5}
                    className="flex-grow"
                />
                <div className="flex gap-2">
                    {/* Expand/Collapse Button */}
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

                    {/* Collapsible Content */}
                    {expanded && (
                        <div className="flex gap-2 mt-2 transition-all duration-300">
                            <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                onClick={() => document.getElementById("image-upload")?.click()}
                                className="rounded-full h-10 w-10"
                            >
                                <Image className="h-4 w-4" />
                                <span className="sr-only">Upload Image</span>
                            </Button>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <VoiceRecorder
                                onRecordingComplete={sendVoiceRecording}
                                isUploading={isLoading}
                            />
                        </div>
                    )}

                    {/* Send Message Button */}
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