    // components/patientViewModels/telegram-messages/TelegramMessagesView.tsx
    import React, { useRef, useEffect, useState } from "react";
    import Image from "next/image";
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
    import { ScrollArea } from "@/components/ui/ScrollArea";
    import { Avatar, AvatarFallback } from "@/components/ui/avatar";
    import { Textarea } from "@/components/ui/textarea";
    import { Button } from "@/components/ui/button";
    import { Send } from 'lucide-react';
    import { OggOpusDecoder } from "ogg-opus-decoder";
    import { AudioNotePlayer } from "./AudioNotePlayer";
    import { decryptPhoto } from "@/utils/encryptPhoto";
    import ReactMarkdown from 'react-markdown';
    import {VoiceRecorder} from "@/components/patientViewModels/telegram-messages/VoiceRecorder";

    export interface TelegramMessage {
        _id: string;
        text: string;
        sender: string;
        timestamp: Date;
        isSelf: boolean;
        type: string;
        mediaUrl?: string;
        encryptedMedia?: string;
        encryptionKey?: string;
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
                                                                                  telegramChatId, // Added telegramChatId to props
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
                const audioCtx = new AudioContext();
                const audioBuffer = audioCtx.createBuffer(
                    decoded.channelData.length,
                    decoded.samplesDecoded,
                    decoded.sampleRate
                );

                decoded.channelData.forEach((channel, index) => {
                    audioBuffer.copyToChannel(channel, index);
                });

                setAudioBuffers((prev) => ({ ...prev, [messageId]: audioBuffer }));
            } catch (error) {
                console.error("Error decoding audio file:", error);
            }
        };

        const renderAudioPlayer = (message: TelegramMessage) => {
            const buffer = audioBuffers[message._id];
            const format = message.mediaUrl?.endsWith('.mp3') ? 'mp3' : 'ogg'; // Determine format from URL

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

        const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setNewMessage(e.target.value);
            adjustTextareaHeight();
        };

        const insertFormatting = (startChar: string, endChar: string = startChar) => {
            if (textareaRef.current) {
                const start = textareaRef.current.selectionStart;
                const end = textareaRef.current.selectionEnd;
                const text = newMessage;
                const before = text.substring(0, start);
                const selection = text.substring(start, end);
                const after = text.substring(end);
                setNewMessage(`${before}${startChar}${selection}${endChar}${after}`);
            }
        };

        const handleBold = () => insertFormatting('**');
        const handleItalic = () => insertFormatting('_');
        const handleBulletList = () => {
            if (textareaRef.current) {
                const start = textareaRef.current.selectionStart;
                const text = newMessage;
                const before = text.substring(0, start);
                const after = text.substring(start);
                setNewMessage(`${before}\n- ${after}`);
            }
        };

        const adjustTextareaHeight = () => {
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }
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
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendMessage(telegramChatId); // sendMessage now takes telegramChatId
                        }}
                        className="flex flex-col w-full gap-2"
                    >
                        <div className="flex items-end gap-2">
                            <div className="flex-grow relative">
                                <Textarea
                                    ref={textareaRef}
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={handleTextareaChange}
                                    className="resize-none pr-12"
                                    rows={1}
                                />
                            </div>
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
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        sendImage(e.target.files[0]);
                                    }
                                }}
                            />

                            <div>
                                <VoiceRecorder
                                    onRecordingComplete={sendVoiceRecording}
                                    isUploading={isLoading}
                                />
                            </div>
                        </div>
                    </form>
                </CardFooter>
            </Card>
        );
    };

