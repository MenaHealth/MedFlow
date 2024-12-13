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
import { MessageInput } from "@/components/patientViewModels/telegram-messages/MessageInput";
import { TelegramMessage } from "@/components/patientViewModels/telegram-messages/TelegramMessagesViewModel";
import { Loader2 } from 'lucide-react';
import { Maximize2, AudioLines, Minimize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { FullScreenTelegramMessages } from "./FullScreenTelegramMessages";
import { convertAudio } from "@/components/patientViewModels/telegram-messages/audio-conversion";
import { useToast } from '@/components/hooks/useToast';


interface TelegramMessagesViewProps {
    messages: TelegramMessage[];
    newMessage: string;
    setMessages: React.Dispatch<React.SetStateAction<TelegramMessage[]>>;
    setNewMessage: (message: string) => void;
    sendMessage: (telegramChatId: string) => void;
    sendImage: (file: File) => void;
    sendAudioMessage: (file: Blob, duration: number) => void;
    isLoading: boolean;
    telegramChatId: string;
    scrollAreaRef: React.RefObject<HTMLDivElement>;
    isLoadingMessages: boolean;
}

export const TelegramMessagesView: React.FC<TelegramMessagesViewProps> = ({
                                                                              messages,
                                                                              newMessage,
                                                                              setMessages,
                                                                              setNewMessage,
                                                                              sendMessage,
                                                                              sendImage,
                                                                              sendAudioMessage,
                                                                              isLoading,
                                                                              telegramChatId,
                                                                              isLoadingMessages,
                                                                          }) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [audioBuffers, setAudioBuffers] = useState<{ [key: string]: AudioBuffer | null }>({});
    const [decryptedImages, setDecryptedImages] = useState<{ [key: string]: string }>({});
    const [signedUrls, setSignedUrls] = useState<{ [key: string]: string }>({});
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isBatchConverting, setIsBatchConverting] = useState(false);
    const [convertedUrls, setConvertedUrls] = useState<{ [key: string]: string | null }>({});
    const { toast, setToast } = useToast();

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        messages.forEach(async (message) => {
            try {
                // Process messages with "image" or "audio" types
                if (message.type === "image" || message.type === "audio") {
                    if (message.mediaUrl) {
                        const response = await fetch(`/api/telegram-bot/get-media?filePath=${encodeURIComponent(message.mediaUrl)}`);
                        if (response.ok) {
                            const data = await response.json();
                            if (data.signedUrl) {
                                // Save signed URLs for images and audio
                                setSignedUrls(prev => ({ ...prev, [message._id]: data.signedUrl }));
                            } else {
                                console.error("No signed URL returned:", data);
                            }
                        } else {
                            console.error("Error fetching signed URL:", await response.text());
                        }
                    }
                }

                // Handle encrypted images
                if (message.type === "image" && message.encryptedMedia && message.encryptionKey) {
                    const decryptedBlob = await decryptPhoto(message.encryptedMedia, message.encryptionKey);
                    const imageUrl = URL.createObjectURL(decryptedBlob);
                    setDecryptedImages(prev => ({ ...prev, [message._id]: imageUrl }));
                }
            } catch (error) {
                console.error("Error processing message:", error);
            }
        });
    }, [messages]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const convertAllAudioNotes = async () => {
        setIsBatchConverting(true);

        const audioMessages = messages.filter((message) => message.type === "audio");
        const updatedMessages = [...messages];

        try {
            const conversionPromises = audioMessages.map(async (message) => {
                const signedUrl = signedUrls[message._id];
                if (!signedUrl) {
                    console.error("Missing signed URL for message:", message._id);
                    return null;
                }

                const response = await fetch(signedUrl);
                if (!response.ok) {
                    console.error(`Failed to fetch audio for message ${message._id}:`, response.statusText);
                    return null;
                }

                const audioBlob = await response.blob();
                const convertedBlob = await convertAudio(audioBlob, { outputFormat: "mp4" });
                const convertedUrl = URL.createObjectURL(convertedBlob);

                const messageIndex = updatedMessages.findIndex((m) => m._id === message._id);
                if (messageIndex !== -1) {
                    updatedMessages[messageIndex] = {
                        ...updatedMessages[messageIndex],
                        signedUrl: convertedUrl,
                        format: "mp4", // new field to indicate it's now MP4
                    };
                }

                return convertedUrl;
            });

            await Promise.all(conversionPromises);

            setMessages(updatedMessages);
            setIsBatchConverting(false);

            // Show a success toast using setToast
            setToast({
                title: "Success",
                description: "All audio notes converted successfully!",
                variant: "success",
            });
        } catch (error) {
            console.error("Error converting audio notes:", error);
            setIsBatchConverting(false);

            // Show an error toast using setToast
            setToast({
                title: "Error",
                description: "Failed to convert audio notes.",
                variant: "error",
            });
        }
    };

    const renderAudioPlayer = (message: TelegramMessage) => {
        if (!message.signedUrl) {
            return <p>Loading audio... <Loader2 className="h-4 w-4 animate-spin" /></p>;
        }

        return (
            <div className="w-full p-0">
                <AudioNotePlayer mediaUrl={message.signedUrl} format={message.format} />
            </div>
        );
    };

    const renderImage = (message: TelegramMessage) => {
        if (message.encryptedMedia && message.encryptionKey) {
            const decryptedImageUrl = decryptedImages[message._id];
            if (!decryptedImageUrl) {
                return <p>Decrypting image... <Loader2 className="h-4 w-4 animate-spin"/></p>;
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
        } else if (message.signedUrl) {
            return (
                <Image
                    src={message.signedUrl}
                    alt={message.text || "Image"}
                    width={300}
                    height={200}
                    className="rounded-lg max-w-full h-auto"
                />
            );
        }
        return <p>Image not available</p>;
    };

    const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isFullScreen) {
                setIsFullScreen(false);
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isFullScreen]);

    return (
        <>
            {isFullScreen ? (
                <FullScreenTelegramMessages
                    messages={messages}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    sendMessage={() => sendMessage(telegramChatId)}
                    sendImage={sendImage}
                    sendAudioMessage={sendAudioMessage}
                    isLoading={isLoading}
                    telegramChatId={telegramChatId}
                    isLoadingMessages={isLoadingMessages}
                    toggleFullScreen={toggleFullScreen}
                />
            ) : (
                <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col bg-background shadow-lg">
                    <CardHeader className="border-b p-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold">
                            <Button onClick={convertAllAudioNotes} disabled={isBatchConverting} className="p-2">
                                {isBatchConverting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <AudioLines className="h-5 w-5" />
                                )}
                            </Button>
                            Telegram Messages
                        <Button className={'ml-3'} variant="orangeOutline" size="icon" onClick={toggleFullScreen}>
                            <Maximize2 className="h-4 w-4" />
                        </Button></CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow p-0 overflow-hidden">
                        <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
                            {isLoadingMessages ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 p-2 md:p-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message._id} // Ensure _id is unique for each message
                                            className={`flex items-end gap-2 ${
                                                message.isSelf ? "flex-row-reverse self-end" : "self-start"
                                            }`}
                                        >
                                            <Avatar className="h-8 w-8 flex-shrink-0">
                                                <AvatarFallback>{message.sender[0]}</AvatarFallback>
                                            </Avatar>
                                            <div
                                                className={`rounded-2xl p-3 ${
                                                    message.isSelf ? "bg-darkBlue text-white" : "bg-orange-50 text-black"
                                                } w-full max-w-xs md:max-w-sm`}
                                            >
                                                {message.type === "image"
                                                    ? renderImage(message)
                                                    : message.type === "audio"
                                                        ? renderAudioPlayer(message)
                                                        : <ReactMarkdown className="text-sm prose prose-sm max-w-none">
                                                            {message.text}
                                                        </ReactMarkdown>}
                                                <p className="text-xs opacity-70 mt-1 text-center text-orange-500">
                                                    {new Date(message.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-4 border-t">
                        <MessageInput
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                            sendMessage={() => sendMessage(telegramChatId)}
                            sendImage={sendImage}
                            sendAudioMessage={(file: Blob, duration: number) => {
                                const convertedFile = new File([file], 'audio_message.wav', { type: file.type });
                                sendAudioMessage(convertedFile, duration);
                            }}
                            isLoading={isLoading}
                            telegramChatId={telegramChatId}
                        />
                    </CardFooter>
                </Card>
            )}
        </>
    );
}

