// components/patientViewModels/telegram-messages/messages.tsx
"use client";

import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { usePatientDashboard } from "./../PatientViewModelContext";

const TelegramMessages: React.FC = () => {
    const { patientInfo } = usePatientDashboard(); // Access context
    const [message, setMessage] = useState("");

    const handleSendMessage = async () => {
        if (!patientInfo?.phone?.phoneNumber || !message.trim()) {
            console.error("Phone number or message is missing");
            alert("Patient phone number or message is missing.");
            return;
        }

        // Combine countryCode and phoneNumber
        const fullPhoneNumber = `${patientInfo.phone.countryCode}${patientInfo.phone.phoneNumber}`;

        try {
            console.log("[TelegramMessages] Sending request with phone number:", fullPhoneNumber);
            const res = await fetch("/api/telegram-webhook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phoneNumber: fullPhoneNumber,
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