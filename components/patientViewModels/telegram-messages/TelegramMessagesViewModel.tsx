// components/patientViewModels/telegram-messages/TelegramMessagesViewModel.tsx

import { useCallback, useState } from 'react';
import dotenv from "dotenv";
import { useSession } from 'next-auth/react';
dotenv.config();

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
signedUrl?: string; // Add this property

}
const useTelegramMessagesViewModel = (initialTelegramChatId: string) => {
    const [messages, setMessages] = useState<TelegramMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [telegramChatId] = useState(initialTelegramChatId);
    const { data: session } = useSession();

    const getSignedUrl = useCallback(async (filePath: string) => {
        try {
            const response = await fetch(`/api/telegram-bot/get-media?filePath=${encodeURIComponent(filePath)}`);
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            const data = await response.json();
            return data.signedUrl;
        } catch (error) {
            console.error("Error fetching signed URL:", error);
            return null;
        }
    }, []);

    const loadMessages = useCallback(async () => {
        if (!telegramChatId) {
            console.error("Telegram Chat ID is missing.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/telegram-bot/${encodeURIComponent(telegramChatId)}/get`);
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            const data = await response.json();

            const formattedMessages: TelegramMessage[] = await Promise.all(data.messages.map(async (message: any) => {
                let signedUrl;
                if (message.type === 'image' || message.type === 'audio') {
                    signedUrl = await getSignedUrl(message.mediaUrl);
                }

                return {
                    _id: message._id,
                    text: message.text,
                    sender: message.sender,
                    timestamp: new Date(message.timestamp),
                    isSelf: message.sender === `${session?.user?.firstName} ${session?.user?.lastName}`,
                    type: message.type,
                    mediaUrl: message.mediaUrl,
                    encryptedMedia: message.encryptedMedia,
                    encryptionKey: message.encryptionKey,
                    signedUrl: signedUrl,
                };
            }));

            setMessages(formattedMessages);
        } catch (error) {
            console.error("Error loading messages:", error);
        } finally {
            setIsLoading(false);
        }
    }, [telegramChatId, getSignedUrl, session]);

const sendMessage = useCallback(async () => {
    if (!newMessage || !telegramChatId) {
        return;
    }

    setIsLoading(true);
    try {
        const response = await fetch(`/api/telegram-bot/${encodeURIComponent(telegramChatId)}/send-text`, {
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
                _id: data.savedMessage._id,
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

    const sendImage = useCallback(async (file: File) => {
        if (!telegramChatId) {
            console.error("Telegram Chat ID is missing.");
            return;
        }
        console.log("[DEBUG] File object:", file);
        console.log("[DEBUG] Telegram Chat ID:", telegramChatId);
        setIsLoading(true);
        try {
            // Step 1: Upload the photo
            const formData = new FormData();
            formData.append("file", file);
            formData.append("telegramChatId", telegramChatId);

            const uploadResponse = await fetch("/api/telegram-bot/upload-photo", {
                method: "POST",
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error("Failed to upload photo file to Digital Ocean");
            }

            const { signedUrl, filePath } = await uploadResponse.json();
            console.log("[INFO] Photo uploaded successfully. Signed URL:", signedUrl);

            // Step 2: Send the photo to the Telegram API
            const sendPhotoUrl = `/api/telegram-bot/${telegramChatId}/send-photo`;
            console.log("[DEBUG] Sending photo to Telegram via:", sendPhotoUrl);

            const response = await fetch(sendPhotoUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mediaUrl: signedUrl, // Use the signed URL for Telegram
                    caption: "Optional caption for the image", // Add your caption here
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("[ERROR] Failed to send photo to Telegram:", errorText);
                throw new Error(errorText);
            }

            const data = await response.json();
            console.log("[INFO] Photo sent to Telegram successfully:", data);

            // Step 3: Update local state with the new message
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    _id: data.savedMessage._id,
                    text: "Image sent",
                    sender: "You",
                    timestamp: new Date(data.savedMessage.timestamp),
                    isSelf: true,
                    type: "image",
                    mediaUrl: filePath, // Use the file path for local reference
                },
            ]);
        } catch (error) {
            console.error("Error sending image:", error);
        } finally {
            setIsLoading(false);
        }
    }, [telegramChatId]);

    const sendAudioMessage = async (blob: Blob, duration: number) => {
        if (!telegramChatId) {
            console.error("Telegram Chat ID is missing.");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", blob); // Use blob here
            formData.append("telegramChatId", telegramChatId);
            formData.append("duration", duration.toString());

            const uploadResponse = await fetch("/api/telegram-bot/upload-audio", {
                method: "POST",
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error("Failed to upload audio file to Digital Ocean");
            }

            const { signedUrl, filePath } = await uploadResponse.json();

            const response = await fetch(`/api/telegram-bot/${telegramChatId}/send-audio`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mediaUrl: signedUrl,
                    caption: `Audio message (${Math.round(duration)} seconds)`,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send audio to Telegram");
            }

            const data = await response.json();
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    _id: data.savedMessage._id,
                    text: "Audio sent",
                    sender: "You",
                    timestamp: new Date(data.savedMessage.timestamp),
                    isSelf: true,
                    type: "audio",
                    mediaUrl: filePath,
                },
            ]);
        } catch (error) {
            console.error("Error sending audio message:", error);
        } finally {
            setIsLoading(false);
        }
    };




    return {
        messages,
        newMessage,
        setNewMessage,
        sendMessage,
        sendImage,
        sendAudioMessage,
        loadMessages,
        isLoading,
        telegramChatId,
    };
};

export default useTelegramMessagesViewModel;



