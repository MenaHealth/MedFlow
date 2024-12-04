// components/patientViewModels/telegram-messages/TelegramMessagesDoctorView.tsx

"use client";

import React, { useEffect } from "react";
import useTelegramMessagesViewModel from "./TelegramMessagesViewModel";
import { TelegramMessagesView } from "./TelegramMessagesView";

const TelegramMessagesDoctorView: React.FC<{ telegramChatId: string }> = ({ telegramChatId }) => {
    const {
        messages,
        newMessage,
        setNewMessage,
        sendMessage,
        sendImage,
        sendVoiceRecording,
        loadMessages,
        isLoading,
    } = useTelegramMessagesViewModel(telegramChatId);

    useEffect(() => {
        console.log("Loading messages for Telegram Chat ID:", telegramChatId);
        if (telegramChatId) {
            loadMessages();
        }
    }, [loadMessages, telegramChatId]);

    return (
        <TelegramMessagesView
            telegramChatId={telegramChatId}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
            sendImage={sendImage}
            sendVoiceRecording={sendVoiceRecording}
            isLoading={isLoading}
        />
    );
};

export default TelegramMessagesDoctorView;



