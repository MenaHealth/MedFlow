            // components/patientViewModels/telegram-messages/TelegramMessagesViewModel.tsx

            import { useCallback, useState } from 'react';
            import dotenv from "dotenv";
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
            }

            const useTelegramMessagesViewModel = (initialTelegramChatId: string) => {
                const [messages, setMessages] = useState<TelegramMessage[]>([]);
                const [newMessage, setNewMessage] = useState('');
                const [isLoading, setIsLoading] = useState(false);
                const [telegramChatId] = useState(initialTelegramChatId);

                const getMediaUrl = (filePath: string) => {
                    return `${process.env.NEXT_PUBLIC_API_URL}/api/telegram-bot/get-media?filePath=${encodeURIComponent(filePath)}`;
                };

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

                        const formattedMessages: TelegramMessage[] = data.messages.map((message: any) => ({
                            _id: message._id,
                            text: message.text,
                            sender: message.sender,
                            timestamp: new Date(message.timestamp),
                            isSelf: message.sender === "You",
                            type: message.type,
                            mediaUrl: message.mediaUrl ? getMediaUrl(message.mediaUrl) : undefined,
                            encryptedMedia: message.encryptedMedia,
                            encryptionKey: message.encryptionKey,
                        }));

                        setMessages(formattedMessages);

                        // Log signed URLs and messages
                        const signedUrls = formattedMessages
                            .filter(message => message.type === "audio" && message.mediaUrl)
                            .map(message => ({
                                id: message._id,
                                signedUrl: message.mediaUrl,
                            }));
                        console.log("Signed URLs for audio messages:", signedUrls);

                    } catch (error) {
                        console.error("Error loading messages:", error);
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
                    setIsLoading(true);
                    try {
                        // Upload the file and get the signed URL
                        const formData = new FormData();
                        formData.append('file', file);

                        const uploadResponse = await fetch('/api/telegram-bot/upload-photo', {
                            method: 'POST',
                            body: formData,
                        });

                        if (!uploadResponse.ok) {
                            throw new Error('Failed to upload photo file to Digital Ocean');
                        }

                        const { signedUrl } = await uploadResponse.json();

                        // Send the signed URL to the Telegram send-photo route
                        const response = await fetch(`/api/telegram-bot/${telegramChatId}/send-photo`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                mediaUrl: signedUrl,
                                caption: 'Optional caption for the image',
                            }),
                        });

                        const data = await response.json();

                        setMessages((prevMessages) => [
                            ...prevMessages,
                            {
                                _id: data.savedMessage._id,
                                text: 'Image sent',
                                sender: 'MedFlow',
                                timestamp: new Date(data.savedMessage.timestamp),
                                isSelf: true,
                                type: 'image',
                                mediaUrl: signedUrl,
                            },
                        ]);

                    } catch (error) {
                        console.error('Error sending image:', error);
                    } finally {
                        setIsLoading(false);
                    }
                }, [telegramChatId]);

                const sendAudioMessage: (file: Blob, duration: number) => Promise<void> = useCallback(
                    async (file, duration) => {
                        setIsLoading(true);
                        try {
                            console.log("[DEBUG] Sending audio file:", {
                                type: file.type,
                                size: file.size,
                            });

                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("duration", duration.toString());

                            // Upload to DigitalOcean
                            const uploadResponse = await fetch("/api/telegram-bot/upload-audio", {
                                method: "POST",
                                body: formData,
                            });

                            if (!uploadResponse.ok) {
                                throw new Error("Failed to upload audio file to DigitalOcean");
                            }

                            const { signedUrl } = await uploadResponse.json();
                            console.log("[DEBUG] Received signed URL from upload-audio:", signedUrl);

                            // Send the signed URL to Telegram
                            const response = await fetch(`/api/telegram-bot/${telegramChatId}/send-audio`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    mediaUrl: signedUrl,
                                    caption: `Audio message (${Math.round(duration)} seconds)`,
                                }),
                            });

                            if (!response.ok) {
                                throw new Error("Failed to send audio message to Telegram");
                            }

                            const data = await response.json();
                            console.log("[DEBUG] Telegram response:", data);

                            setMessages((prevMessages) => [
                                ...prevMessages,
                                {
                                    _id: data.savedMessage._id,
                                    text: "Audio message sent",
                                    sender: "You",
                                    timestamp: new Date(data.savedMessage.timestamp),
                                    isSelf: true,
                                    type: "audio",
                                    mediaUrl: signedUrl,
                                },
                            ]);
                        } catch (error) {
                            console.error("Error sending audio message:", error);
                        } finally {
                            setIsLoading(false);
                        }
                    },
                    [telegramChatId]
                );




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


