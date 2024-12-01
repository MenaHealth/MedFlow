// components/patientViewModels/telegram-messages/TelegramMessagesView.tsx


import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/ScrollArea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from 'lucide-react'
import { TelegramMessage } from './TelegramMessagesViewModel'

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
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Telegram Messages</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] w-full pr-4">
                    {messages.map((message) => (
                        <div key={message.id} className="flex items-start space-x-4 mb-4">
                            <Avatar>
                                <AvatarFallback>{message.sender[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{message.sender}</p>
                                <p>{message.text}</p>
                                <p className="text-sm text-muted-foreground">
                                    {message.timestamp.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex w-full items-center space-x-2">
                    <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow"
                    />
                    <Button type="submit" size="icon" disabled={isLoading}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}

