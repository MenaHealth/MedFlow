// components/patientViewModels/telegram-messages/TelegramMessagesDoctorView.tsx

"use client";

import React, { useEffect, useState, useRef } from "react";
import useTelegramMessagesViewModel from "./TelegramMessagesViewModel";
import { TelegramMessagesView } from "./TelegramMessagesView";
import { CircleLoader } from 'react-spinners';

const TelegramMessagesDoctorView: React.FC<{ telegramChatId: string }> = ({ telegramChatId }) => {
    const {
        messages,
        newMessage,
        setNewMessage,
        sendMessage,
        sendImage,
        sendAudioMessage,
        loadMessages,
        isLoading,
    } = useTelegramMessagesViewModel(telegramChatId);

    const [isLoadingMessages, setIsLoadingMessages] = useState(true);

    // Create the scroll area reference
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (telegramChatId) {
            console.log("Loading messages for Telegram Chat ID:", telegramChatId);
            setIsLoadingMessages(true);
            loadMessages().finally(() => setIsLoadingMessages(false));
        } else {
            console.log("Telegram Chat ID is not available.");
            setIsLoadingMessages(false);
        }
    }, [loadMessages, telegramChatId]);

    return (
        <div className="w-full h-full">
            {isLoadingMessages ? (
                <div className="flex justify-center items-center h-64">
                    <CircleLoader color="#FF5722" />
                </div>
            ) : (
                <TelegramMessagesView
                    scrollAreaRef={scrollAreaRef}
                    telegramChatId={telegramChatId}
                    messages={messages}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    sendMessage={sendMessage}
                    sendImage={sendImage}
                    sendAudioMessage={sendAudioMessage}
                    isLoading={isLoading}
                    isLoadingMessages={isLoadingMessages}
                />
            )}
        </div>
    );
};

export default TelegramMessagesDoctorView;