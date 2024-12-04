// components/patientViewModels/telegram-messages/TelegramMessagesViewModel.tsx

import { useCallback, useState } from "react";

export interface TelegramMessage {
    _id: string;
    text: string;
    sender: string;
    timestamp: Date;
    isSelf: boolean;
    type: string;
    mediaUrl?: string;
}

export function useTelegramMessagesViewModel() {
    const [messages, setMessages] = useState<TelegramMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const loadMessages = useCallback(async (telegramChatId: string) => {
        if (!telegramChatId) {
            console.error("Telegram chat ID is missing");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/telegram-bot/${encodeURIComponent(telegramChatId)}/get`);
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            const data = await response.json();

            // Map API data to the correct shape
            const formattedMessages: TelegramMessage[] = data.messages.map((message: any) => ({
                _id: message._id,
                text: message.text,
                sender: message.sender,
                timestamp: new Date(message.timestamp),
                isSelf: message.sender === "You",
                type: message.type,
                mediaUrl: message.mediaUrl || "",
            }));

            setMessages(formattedMessages);
        } catch (error) {
            console.error("Error loading messages:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const sendMessage = useCallback(async () => {
        if (!newMessage) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/telegram-bot/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: newMessage }),
            });

            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            const data = await response.json();
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    _id: data.savedMessage._id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    text: newMessage,
                    sender: "You",
                    timestamp: new Date(data.savedMessage.timestamp),
                    isSelf: true,
                    type: "text",
                    mediaUrl: "",
                },
            ]);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsLoading(false);
        }
    }, [newMessage]);


    return {
        messages,
        newMessage,
        setNewMessage,
        sendMessage,
        loadMessages,
        isLoading,
    };
}

