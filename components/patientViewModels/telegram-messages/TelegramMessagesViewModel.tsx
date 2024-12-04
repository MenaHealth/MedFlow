// components/patientViewModels/telegram-messages/TelegramMessagesViewModel.tsx

import { useCallback, useState } from "react";
import { encryptPhoto, generateEncryptionKey, convertToWebP, calculateFileHash } from "@/utils/encryptPhoto";

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

const useTelegramMessagesViewModel = (initialTelegramChatId: string) => {
    const [messages, setMessages] = useState<TelegramMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [telegramChatId, setTelegramChatId] = useState(initialTelegramChatId);

    const loadMessages = useCallback(async () => {
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

            const formattedMessages: TelegramMessage[] = data.messages.map((message: any) => ({
                _id: message._id,
                text: message.text,
                sender: message.sender,
                timestamp: new Date(message.timestamp),
                isSelf: message.sender === "You",
                type: message.type,
                mediaUrl: message.mediaUrl || "",
                encryptedMedia: message.encryptedMedia,
                encryptionKey: message.encryptionKey,
            }));

            setMessages(formattedMessages);
        } catch (error) {
            console.error("Error loading messages:", error);
        } finally {
            setIsLoading(false);
        }
    }, [telegramChatId]);

    const sendImage = useCallback(async (file: File) => {
        setIsLoading(true);
        try {
            const webpBlob = await convertToWebP(file);
            const encryptionKey = generateEncryptionKey();
            const encryptedImage = await encryptPhoto(new File([webpBlob], file.name, { type: 'image/webp' }), encryptionKey);
            const fileHash = await calculateFileHash(file);

            const formData = new FormData();
            formData.append('encryptedImage', encryptedImage);
            formData.append('encryptionKey', encryptionKey);
            formData.append('fileHash', fileHash);

            const response = await fetch("/api/telegram-bot/send-image", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            const data = await response.json();
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    _id: data.savedMessage._id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    text: "Image",
                    sender: "You",
                    timestamp: new Date(data.savedMessage.timestamp),
                    isSelf: true,
                    type: "image",
                    encryptedMedia: encryptedImage,
                    encryptionKey: encryptionKey,
                },
            ]);
        } catch (error) {
            console.error("Error sending image:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const sendMessage = useCallback(async () => {
        if (!newMessage || !telegramChatId) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/telegram-bot/${encodeURIComponent(telegramChatId)}/send`, {
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
    }, [newMessage, telegramChatId]);

    return {
        messages,
        newMessage,
        setNewMessage,
        sendMessage,
        sendImage,
        loadMessages,
        isLoading,
        telegramChatId,
    };
};

export default useTelegramMessagesViewModel;




