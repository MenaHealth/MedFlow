    // components/patientViewModels/telegram-messages/TelegramMessagesView.tsx
    import React, { useRef, useEffect, useState } from "react";
    import Image from "next/image";
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
    import { ScrollArea } from "@/components/ui/ScrollArea";
    import { Avatar, AvatarFallback } from "@/components/ui/avatar";
    import { OggOpusDecoder } from "ogg-opus-decoder";
    import { AudioNotePlayer } from "./AudioNotePlayer";
    import { decryptPhoto } from "@/utils/encryptPhoto";
    import ReactMarkdown from 'react-markdown';
    import {MessageInput} from "@/components/patientViewModels/telegram-messages/MessageInput";
    import {TelegramMessage} from "@/components/patientViewModels/telegram-messages/TelegramMessagesViewModel";

    interface TelegramMessagesViewProps {
        messages: TelegramMessage[];
        newMessage: string;
        setNewMessage: (message: string) => void;
        sendMessage: (telegramChatId: string) => void;
        sendImage: (file: File) => void;
        sendVoiceRecording: (blob: Blob) => void;
        isLoading: boolean;
        telegramChatId: string;
    }

    interface TelegramMessagesViewProps {
        messages: TelegramMessage[];
        newMessage: string;
        setNewMessage: (message: string) => void;
        sendMessage: (telegramChatId: string) => void;
        sendVoiceRecording: (blob: Blob) => void;
        sendImage: (file: File) => void;
        isLoading: boolean;
        telegramChatId: string;
    }

    export const TelegramMessagesView: React.FC<TelegramMessagesViewProps> = ({
                                                                                  messages,
                                                                                  newMessage,
                                                                                  setNewMessage,
                                                                                  sendMessage,
                                                                                  sendImage,
                                                                                  sendVoiceRecording,
                                                                                  isLoading,
                                                                                  telegramChatId,
                                                                              }) => {
        const scrollAreaRef = useRef<HTMLDivElement>(null);
        const textareaRef = useRef<HTMLTextAreaElement>(null);
        const [audioBuffers, setAudioBuffers] = useState<{ [key: string]: AudioBuffer | null }>({});
        const [decryptedImages, setDecryptedImages] = useState<{ [key: string]: string }>({});

        useEffect(() => {
            if (scrollAreaRef.current) {
                scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
            }
        }, [messages]);

        useEffect(() => {
            messages.forEach(async (message) => {
                if (message.type === "image" && message.encryptedMedia && message.encryptionKey) {
                    try {
                        const decryptedBlob = await decryptPhoto(message.encryptedMedia, message.encryptionKey);
                        const imageUrl = URL.createObjectURL(decryptedBlob);
                        setDecryptedImages(prev => ({ ...prev, [message._id]: imageUrl }));
                    } catch (error) {
                        console.error("Error decrypting image:", error);
                    }
                }
            });
        }, [messages]);

        const decodeAudio = async (mediaUrl: string, messageId: string, format: 'ogg' | 'mp3') => {
            try {
                if (format === 'mp3') {
                    // No decoding needed for MP3, use the media URL directly
                    setAudioBuffers((prev) => ({
                        ...prev,
                        [messageId]: null, // MP3 does not require an AudioBuffer
                    }));
                    return;
                }

                const response = await fetch(mediaUrl);
                if (!response.ok) throw new Error("Failed to fetch audio file");

                const oggData = new Uint8Array(await response.arrayBuffer());
                const decoder = new OggOpusDecoder();
                await decoder.ready;

                const decoded = await decoder.decode(oggData);

                // Add a check to ensure there's valid channel data
                if (decoded.channelData.length === 0 || decoded.samplesDecoded === 0) {
                    console.error("No valid audio data found");
                    return;
                }

                const audioCtx = new AudioContext();
                const audioBuffer = audioCtx.createBuffer(
                    // Ensure at least one channel, defaulting to mono if no channels
                    Math.max(1, decoded.channelData.length),
                    decoded.samplesDecoded,
                    decoded.sampleRate
                );

                // Copy channel data, defaulting to silent channel if no data
                decoded.channelData.forEach((channel, index) => {
                    if (channel && channel.length > 0) {
                        audioBuffer.copyToChannel(channel, index);
                    } else if (index === 0) {
                        // Create a silent channel for the first channel if empty
                        const silentChannel = new Float32Array(decoded.samplesDecoded);
                        audioBuffer.copyToChannel(silentChannel, 0);
                    }
                });

                setAudioBuffers((prev) => ({ ...prev, [messageId]: audioBuffer }));
            } catch (error) {
                console.error("Error decoding audio file:", error);
            }
        };

        const renderAudioPlayer = (message: TelegramMessage) => {
            const buffer = audioBuffers[message._id];
            const format = message.mediaUrl?.endsWith('.mp3') ? 'mp3' : 'ogg';

            if (format === 'ogg' && !buffer) {
                decodeAudio(message.mediaUrl || "", message._id, format);
                return <p>Loading audio...</p>;
            }

            return (
                <AudioNotePlayer
                    audioBuffer={buffer}
                    mediaUrl={message.mediaUrl || ""}
                    format={format}
                />
            );
        };

        const renderImage = (message: TelegramMessage) => {
            if (message.encryptedMedia && message.encryptionKey) {
                const decryptedImageUrl = decryptedImages[message._id];
                if (!decryptedImageUrl) {
                    return <p>Decrypting image...</p>;
                }
                return (
                    <Image
                        src={decryptedImageUrl}
                        alt={message.text || "Decrypted Image"}
                        width={300}
                        height={200}
                        className="rounded-lg max-w-full h-auto"
                    />
                );
            } else if (message.mediaUrl) {
                return (
                    <Image
                        src={message.mediaUrl}
                        alt={message.text || "Image"}
                        width={300}
                        height={200}
                        className="rounded-lg max-w-full h-auto"
                    />
                );
            }
            return null;
        };

        return (
            <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col bg-background shadow-lg">
                <CardHeader className="border-b p-4">
                    <CardTitle className="text-xl font-bold">Telegram Messages</CardTitle>
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
                                        {message.type === "image" ? renderImage(message) :
                                            message.type === "audio" ? renderAudioPlayer(message) :
                                                <ReactMarkdown className="text-sm prose prose-sm max-w-none">
                                                    {message.text}
                                                </ReactMarkdown>}
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
                    <MessageInput
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        sendMessage={() => sendMessage(telegramChatId)}
                        sendImage={sendImage}
                        sendVoiceRecording={sendVoiceRecording}
                        isLoading={isLoading}
                    />
                </CardFooter>
            </Card>
        );
    };

