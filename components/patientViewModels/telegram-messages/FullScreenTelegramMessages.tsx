"use client"

import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Button } from "@/components/ui/button";
import { Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import { MessageInput } from "./MessageInput";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';
import Image from "next/image";
import { AudioNotePlayer } from "./AudioNotePlayer";
import { Loader2 } from 'lucide-react';

interface FullScreenTelegramMessagesProps {
    messages: any[];
    newMessage: string;
    setNewMessage: (message: string) => void;
    sendMessage: () => void;
    sendImage: (file: File) => void;
    sendAudioMessage: (file: Blob, duration: number) => void;
    isLoading: boolean;
    telegramChatId: string;
    isLoadingMessages: boolean;
    toggleFullScreen: () => void;
}

export const FullScreenTelegramMessages: React.FC<FullScreenTelegramMessagesProps> = ({
                                                                                          messages,
                                                                                          newMessage,
                                                                                          setNewMessage,
                                                                                          sendMessage,
                                                                                          sendImage,
                                                                                          sendAudioMessage,
                                                                                          isLoading,
                                                                                          telegramChatId,
                                                                                          isLoadingMessages,
                                                                                          toggleFullScreen,
                                                                                      }) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [messageScale, setMessageScale] = useState(1);

    // Zoom functions
    const zoomIn = () => setMessageScale(prev => Math.min(prev + 0.1, 1.5));
    const zoomOut = () => setMessageScale(prev => Math.max(prev - 0.1, 0.5));

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const renderAudioPlayer = (message: any) => {
        if (!message.signedUrl) {
            return <p>Loading audio... <Loader2 className="h-4 w-4 animate-spin" /></p>;
        }

        return (
            <div className="w-full p-0">
                <AudioNotePlayer mediaUrl={message.signedUrl} format={message.format}/>
            </div>
        );
    };

    const renderImage = (message: any) => {
        if (message.encryptedMedia && message.encryptionKey) {
            if (!message.signedUrl) {
                return <p>Decrypting image... <Loader2 className="h-4 w-4 animate-spin"/></p>;
            }
            return (
                <Image
                    src={message.signedUrl}
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

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                toggleFullScreen();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [toggleFullScreen]);

    return (
        <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
            <Card className="w-full h-full max-w-4xl mx-auto flex flex-col bg-background shadow-lg">
                <CardHeader className="border-b p-4 flex flex-row justify-between items-center">
                    <CardTitle className="text-xl font-bold">Telegram Messages
                            <Button variant="orangeOutline" size="icon" onClick={toggleFullScreen}>
                                <Minimize2 className="h-4 w-4" />
                            </Button>
                    </CardTitle>
                    <div className="flex items-center gap-4">
                        <Button variant="darkBlueOutline" size="icon" onClick={zoomOut}>
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button variant="darkBlueOutline" size="icon" onClick={zoomIn}>
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow p-0 overflow-hidden">
                    <ScrollArea
                        className="h-full w-full p-4"
                        ref={scrollAreaRef}
                        style={{
                            transform: `scale(${messageScale})`,
                            transformOrigin: "center top",
                        }}
                    >
                        {isLoadingMessages ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <div
                                className="flex flex-col gap-6"
                                style={{
                                    paddingLeft: `${20 * messageScale}px`,
                                    paddingRight: `${20 * messageScale}px`,
                                }}
                            >
                                {messages.map((message) => (
                                    <div
                                        key={message._id}
                                        className={`flex ${
                                            message.isSelf ? "justify-end" : "justify-start"
                                        } gap-2`}
                                        style={{
                                            transformOrigin: message.isSelf
                                                ? "right center"
                                                : "left center",
                                        }}
                                    >
                                        {!message.isSelf && (
                                            <Avatar className="h-8 w-8 flex-shrink-0">
                                                <AvatarFallback>{message.sender[0]}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div
                                            className={`rounded-2xl p-3 ${
                                                message.isSelf
                                                    ? "bg-darkBlue text-white"
                                                    : "bg-orange-50 text-black"
                                            } inline-block max-w-[70%]`}
                                            style={{
                                                marginLeft: message.isSelf ? "auto" : "0",
                                                marginRight: message.isSelf ? "0" : "auto",
                                                wordBreak: "break-word",
                                                marginBottom: `${5 * messageScale}px`,
                                            }}
                                        >
                                            {message.type === "image"
                                                ? renderImage(message)
                                                : message.type === "audio"
                                                    ? renderAudioPlayer(message)
                                                    : (
                                                        <ReactMarkdown className="text-sm prose prose-sm max-w-none break-words">
                                                            {message.text}
                                                        </ReactMarkdown>
                                                    )}
                                            <p
                                                className="text-xs opacity-70 mt-1 text-center text-orange-500"
                                                style={{ marginTop: `${4 * messageScale}px` }}
                                            >
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
                        sendMessage={sendMessage}
                        sendImage={sendImage}
                        sendAudioMessage={sendAudioMessage}
                        isLoading={isLoading}
                        telegramChatId={telegramChatId}
                    />
                </CardFooter>
            </Card>
        </div>
    );
};

