// components/patientViewModels/telegram-messages/TelegramMessagesDoctorView.tsx

"use client";

import React, { useEffect } from "react";
import { useTelegramMessagesViewModel } from "./TelegramMessagesViewModel";
import { TelegramMessagesView } from "./TelegramMessagesView";

const TelegramMessagesDoctorView: React.FC<{ telegramChatId: string }> = ({ telegramChatId }) => {
    const {
        messages,
        newMessage,
        setNewMessage,
        sendMessage,
        loadMessages,
        isLoading,
    } = useTelegramMessagesViewModel();

    useEffect(() => {
        console.log("Loading messages for Telegram Chat ID:", telegramChatId);
        if (telegramChatId) {
            loadMessages(telegramChatId);
        }
    }, [loadMessages, telegramChatId]);

    return (
        <TelegramMessagesView
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={() => sendMessage(telegramChatId)}
            isLoading={isLoading}
        />
    );
};

export default TelegramMessagesDoctorView;