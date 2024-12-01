// components/patientViewModels/telegram-messages/TelegramMessagesViewModel.tsx


import { useState, useCallback } from "react";

export interface TelegramMessage {
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
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
            const data = await response.json();
            setMessages(data.messages || []);
        } catch (error) {
            console.error("Error loading messages:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const sendMessage = useCallback(
        async (telegramChatId: string) => {
            if (!telegramChatId || !newMessage.trim()) {
                console.error("Telegram chat ID or message is missing");
                return;
            }

            try {
                const response = await fetch(`/api/telegram-bot/${telegramChatId}/post`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: newMessage,
                    }),
                });

                const data = await response.json();
                if (data.success) {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            id: Date.now().toString(),
                            text: newMessage,
                            sender: "You",
                            timestamp: new Date(),
                        },
                    ]);
                    setNewMessage("");
                } else {
                    console.error("Error sending message:", data.error);
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        },
        [newMessage]
    );

    return {
        messages,
        newMessage,
        setNewMessage,
        sendMessage,
        loadMessages,
        isLoading,
    };
}