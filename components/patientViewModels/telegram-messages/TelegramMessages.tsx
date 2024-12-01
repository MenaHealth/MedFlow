// components/patientViewModels/telegram-messages/TelegramMessages.tsx

"use client";

import React, { useEffect } from "react";
import { useTelegramMessagesViewModel } from "./TelegramMessagesViewModel";
import { TelegramMessagesView } from "./TelegramMessagesView";

const TelegramMessages: React.FC<{ telegramChatId: string }> = ({ telegramChatId }) => {
    const {
        messages,
        newMessage,
        setNewMessage,
        sendMessage,
        loadMessages,
        isLoading,
    } = useTelegramMessagesViewModel();

    useEffect(() => {
        if (telegramChatId) {
            loadMessages(telegramChatId); // Pass telegramChatId to loadMessages
        }
    }, [loadMessages, telegramChatId]);

    return (
        <TelegramMessagesView
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={() => sendMessage(telegramChatId)} // Pass telegramChatId to sendMessage
            isLoading={isLoading}
        />
    );
};

export default TelegramMessages;