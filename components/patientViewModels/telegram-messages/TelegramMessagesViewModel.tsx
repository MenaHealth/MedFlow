// components/patientViewModels/telegram-messages/TelegramMessagesViewModel.tsx

import { useCallback, useState } from "react";

interface TelegramMessage {
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
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            const data = await response.json();
            setMessages(data.messages);
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

            setIsLoading(true);
            try {
                const response = await fetch(`/api/telegram-bot/${encodeURIComponent(telegramChatId)}/send`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: newMessage,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Error sending message: ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Message sent and saved successfully", data);

                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        id: data.savedMessage._id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        text: newMessage,
                        sender: "You",
                        timestamp: new Date(data.savedMessage.timestamp),
                    },
                ]);
                setNewMessage("");
            } catch (error) {
                console.error("Error in sendMessage:", error);
            } finally {
                setIsLoading(false);
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



