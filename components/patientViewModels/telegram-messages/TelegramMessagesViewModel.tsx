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
        const [telegramChatId, setTelegramChatId] = useState(initialTelegramChatId);

        const uploadToDigitalOcean = async (file: File): Promise<string> => {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/telegram-bot/upload-photo', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file to Digital Ocean');
            }

            const { cdnUrl } = await response.json();
            return cdnUrl;
        };

        const getMediaUrl = (filePath: string) => {
            return `${process.env.NEXT_PUBLIC_API_URL}/api/telegram-bot/get-media?filePath=${encodeURIComponent(filePath)}`;
        };

        const loadMessages = useCallback(async () => {
            if (!telegramChatId) {
                console.error("Telegram chat ID is missing");
                return;
            }
            console.log("NEXT_PUBLIC_API_URL:"+process.env.NEXT_PUBLIC_API_URL)

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
                    throw new Error('Failed to upload file to Digital Ocean');
                }

                const { signedUrl } = await uploadResponse.json();

                // Send the signed URL to the Telegram send-image route
                const response = await fetch(`/api/telegram-bot/${telegramChatId}/send-image`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        mediaUrl: signedUrl,
                        caption: 'Optional caption for the image',
                    }),
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Image sent and saved successfully:', result);
                } else {
                    console.error('Failed to send and save image');
                }

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

        const sendAudioMessage = useCallback(async (file: File) => {
            setIsLoading(true);
            try {
                const cdnUrl = await uploadToDigitalOcean(file);

                const response = await fetch(`/api/telegram-bot/${telegramChatId}/send-audio`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        mediaUrl: cdnUrl,
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
                        text: 'audio message sent',
                        sender: 'You',
                        timestamp: new Date(data.savedMessage.timestamp),
                        isSelf: true,
                        type: 'audio',
                        mediaUrl: cdnUrl,
                    },
                ]);
            } catch (error) {
                console.error('Error sending audio message:', error);
            } finally {
                setIsLoading(false);
            }
        }, [telegramChatId]);

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


