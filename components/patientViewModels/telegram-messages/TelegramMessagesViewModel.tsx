    // components/patientViewModels/telegram-messages/TelegramMessagesViewModel.tsx

    import { useCallback, useState } from "react";
    import { encryptPhoto, generateEncryptionKey, convertToWebP, calculateFileHash } from "@/utils/encryptPhoto";
    import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


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

        const s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_VALUE!,
            },
        });

        const uploadToS3 = async (file: File): Promise<string> => {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/telegram-bot/upload-photo', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file to S3');
            }

            const { fileUrl } = await response.json();
            return fileUrl;
        };

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

                const formattedMessages: TelegramMessage[] = await Promise.all(
                    data.messages.map(async (message: any) => {
                        let mediaUrl = message.mediaUrl;
                        if (message.type === "image" || message.type === "audio") {
                            mediaUrl = await fetchMedia(message.mediaUrl); // Replace mediaUrl with proxy URL
                        }
                        return {
                            _id: message._id,
                            text: message.text,
                            sender: message.sender,
                            timestamp: new Date(message.timestamp),
                            isSelf: message.sender === "You",
                            type: message.type,
                            mediaUrl,
                            encryptedMedia: message.encryptedMedia,
                            encryptionKey: message.encryptionKey,
                        };
                    })
                );

                setMessages(formattedMessages);
            } catch (error) {
                console.error("Error loading messages:", error);
            } finally {
                setIsLoading(false);
            }
        }, [telegramChatId]);

        const fetchMedia = async (filePath: string): Promise<string> => {
            try {
                const response = await fetch(`/api/telegram-bot/get-media?filePath=${encodeURIComponent(filePath)}`, {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SECURE_API_KEY}`, // Replace with your secure logic
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch media: ${response.status}`);
                }

                const blob = await response.blob();
                return URL.createObjectURL(blob);
            } catch (error) {
                console.error("Error fetching media:", error);
                throw error;
            }
        };

        const sendImage = useCallback(async (file: File) => {
            setIsLoading(true);
            try {
                // Upload image to server-side API (which handles S3 upload)
                const s3Url = await uploadToS3(file);

                // Send the image URL to Telegram
                const response = await fetch(`/api/telegram-bot/${telegramChatId}/send-image`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        mediaUrl: s3Url,
                        caption: file.name,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`);
                }

                const data = await response.json();
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        _id: data.savedMessage._id,
                        text: 'Image sent',
                        sender: 'You',
                        timestamp: new Date(),
                        isSelf: true,
                        type: 'image',
                        mediaUrl: s3Url,
                    },
                ]);
            } catch (error) {
                console.error('Error sending image:', error);
            } finally {
                setIsLoading(false);
            }
        }, [telegramChatId]);

        const sendVoiceRecording = useCallback(async (blob: Blob) => {
            setIsLoading(true);
            try {
                const file = new File([blob], "voice_message.mp3", { type: "audio/mpeg" }); // Updated format
                const formData = new FormData();
                formData.append("file", file);

                const uploadResponse = await fetch("/api/telegram-bot/upload-audio", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadResponse.ok) throw new Error("Failed to upload audio file");

                const { fileUrl } = await uploadResponse.json();

                const response = await fetch(`/api/telegram-bot/${telegramChatId}/send-audio`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ mediaUrl: fileUrl }),
                });

                if (!response.ok) throw new Error(`API responded with status: ${response.status}`);

                const data = await response.json();

                // Add the new message object with required properties
                setMessages((prev) => [
                    ...prev,
                    {
                        _id: data.savedMessage._id, // Make sure the backend sends _id
                        text: "Voice message sent",
                        sender: "You",
                        timestamp: new Date(), // Use current timestamp or data from the backend
                        isSelf: true,
                        type: "voice",
                        mediaUrl: fileUrl,
                    },
                ]);
            } catch (error) {
                console.error("Error sending voice recording:", error);
            } finally {
                setIsLoading(false);
            }
        }, [telegramChatId]);

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
            sendVoiceRecording,
            loadMessages,
            isLoading,
            telegramChatId,
        };
    };

    export default useTelegramMessagesViewModel;




