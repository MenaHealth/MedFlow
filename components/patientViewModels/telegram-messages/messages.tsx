// components/patientViewModels/telegram-messages/messages.tsx
"use client";

import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { usePatientDashboard } from "./../PatientViewModelContext";

const TelegramMessages: React.FC = () => {
    const { patientInfo } = usePatientDashboard(); // Access context
    const [message, setMessage] = useState("");

    const handleSendMessage = async () => {
        // Log the values to debug
        console.log("[Debug] PatientInfo in TelegramMessages:", patientInfo);
        console.log("[Debug] TelegramChatId:", patientInfo?.telegramChatId);
        console.log("[Debug] TelegramAccessHash:", patientInfo?.telegramAccessHash);
        console.log("[Debug] Message:", message);


        if (!patientInfo?.telegramChatId || !patientInfo?.telegramAccessHash || !message.trim()) {
            console.error("Telegram ID, access hash, or message is missing");
            alert("Telegram ID, access hash, or message is missing.");
            return;
        }

        try {
            console.log("[TelegramMessages] Sending request with Telegram ID:", patientInfo.telegramChatId);
            const res = await fetch("/api/telegram-webhook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatId: patientInfo.telegramChatId, // Use telegramChatId
                    accessHash: patientInfo.telegramAccessHash, // Use telegramAccessHash
                    message,
                }),
            });

            const data = await res.json();
            if (data.success) {
                console.log("Message sent successfully!");
            } else {
                console.error("Error sending message:", data.error);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <Box>
            <Typography variant="h6">Send Telegram Message</Typography>
            <TextField
                label="Message"
                multiline
                rows={3}
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={handleSendMessage}>Send</Button>
        </Box>
    );
};

export default TelegramMessages;