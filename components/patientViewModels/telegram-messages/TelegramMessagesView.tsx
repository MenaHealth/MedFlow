    // components/patientViewModels/telegram-messages/TelegramMessagesView.tsx


import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';
import { OggOpusDecoder } from "ogg-opus-decoder";

export interface TelegramMessage {
    _id: string;
    text: string;
    sender: string;
    timestamp: Date;
    isSelf: boolean;
    type: string;
    mediaUrl?: string;
}

interface TelegramMessagesViewProps {
    messages: TelegramMessage[];
    newMessage: string;
    setNewMessage: (message: string) => void;
    sendMessage: () => void;
    isLoading: boolean;
}

export const TelegramMessagesView: React.FC<TelegramMessagesViewProps> = ({
                                                                              messages,
                                                                              newMessage,
                                                                              setNewMessage,
                                                                              sendMessage,
                                                                              isLoading,
                                                                          }) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [audioBuffers, setAudioBuffers] = useState<{ [key: string]: AudioBuffer }>({});

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    // Decode .ogg audio files
    const decodeAudio = async (mediaUrl: string, messageId: string) => {
        try {
            const response = await fetch(mediaUrl);
            if (!response.ok) throw new Error("Failed to fetch audio file");

            const oggData = new Uint8Array(await response.arrayBuffer());
            const decoder = new OggOpusDecoder();
            await decoder.ready;

            const decoded = await decoder.decode(oggData);
            const audioCtx = new AudioContext();
            const audioBuffer = audioCtx.createBuffer(
                decoded.channelData.length,
                decoded.samplesDecoded,
                decoded.sampleRate
            );

            // Copy decoded channel data
            decoded.channelData.forEach((channel, index) => {
                audioBuffer.copyToChannel(channel, index);
            });

            setAudioBuffers((prev) => ({ ...prev, [messageId]: audioBuffer }));
        } catch (error) {
            console.error("Error decoding audio file:", error);
        }
    };

    // Render audio messages
    const renderAudioPlayer = (message: TelegramMessage) => {
        const buffer = audioBuffers[message._id];
        if (!buffer) {
            // If not decoded yet, trigger decoding
            decodeAudio(message.mediaUrl || "", message._id);
            return <p>Loading audio...</p>;
        }

        const handlePlay = () => {
            const audioCtx = new AudioContext();
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            source.start(0);
        };

        return (
            <button onClick={handlePlay} className="bg-primary text-primary-foreground px-3 py-1 rounded">
                Play Audio
            </button>
        );
    };

    return (
        <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col">
            <CardHeader className="border-b p-4">
                <CardTitle className="text-xl">Telegram Messages</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-hidden">
                <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
                    <div className="flex flex-col gap-3 p-4">
                        {messages.map((message) => (
                            <div
                                key={message._id}
                                className={`flex items-end gap-2 ${
                                    message.isSelf ? "flex-row-reverse self-end" : "self-start"
                                }`}
                            >
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarFallback>{message.sender[0]}</AvatarFallback>
                                </Avatar>
                                <div
                                    className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                                        message.isSelf
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                    }`}
                                >
                                    {message.type === "image" ? (
                                        <img
                                            src={message.mediaUrl}
                                            alt={message.text || "Image"}
                                            className="rounded-lg max-w-full h-auto"
                                        />
                                    ) : message.type === "audio" ? (
                                        renderAudioPlayer(message)
                                    ) : (
                                        <p>{message.text}</p>
                                    )}
                                    <p className="text-xs opacity-70 mt-1">
                                        {new Date(message.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                    }}
                    className="flex w-full items-center gap-2"
                >
                    <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow"
                    />
                    <Button variant="orange" type="submit" size="icon" disabled={isLoading}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
};