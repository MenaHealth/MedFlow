    // components/patientViewModels/telegram-messages/TelegramMessagesView.tsx


import React, { useRef, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/ScrollArea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Paperclip } from 'lucide-react'

export interface TelegramMessage {
    _id: string;
    text: string;
    sender: string;
    timestamp: Date;
    isSelf: boolean;
}

interface TelegramMessagesViewProps {
    messages: TelegramMessage[]
    newMessage: string
    setNewMessage: (message: string) => void
    sendMessage: () => void
    isLoading: boolean
}

export const TelegramMessagesView: React.FC<TelegramMessagesViewProps> = ({
                                                                              messages,
                                                                              newMessage,
                                                                              setNewMessage,
                                                                              sendMessage,
                                                                              isLoading,
                                                                          }) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col">
            <CardHeader className="border-b p-4">
                <CardTitle className="text-xl">Messages</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-hidden">
                <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
                    <div className="flex flex-col gap-3 p-4">
                        {messages.map((message) => (
                            <div
                                key={message._id}
                                className={`flex items-end gap-2 ${
                                    message.sender === 'You' ? 'flex-row-reverse self-end' : 'self-start'
                                }`}
                            >
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarFallback>{message.sender[0]}</AvatarFallback>
                                </Avatar>
                                <div
                                    className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                                        message.sender === 'You'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                    }`}
                                >
                                    <p>{message.text}</p>
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
    )
}
