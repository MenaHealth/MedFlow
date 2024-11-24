"use client";

import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';

interface ViberMessagesProps {
    phoneNumber: string; // Viber phone number to send the message to
}

const ViberMessages: React.FC<ViberMessagesProps> = ({ phoneNumber }) => {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [chatHistory, setChatHistory] = useState<{ text: string; sender: 'user' | 'system' }[]>([]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        // Add user's message to the chat history
        setChatHistory((prev) => [...prev, { text: message, sender: 'user' }]);
        setMessage(""); // Clear the input field

        try {
            const res = await fetch('/api/viber-messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber, message }), // Send phoneNumber instead of userId
            });

            const data = await res.json();
            if (data.success) {
                setResponse("Message sent successfully!");
                setChatHistory((prev) => [
                    ...prev,
                    { text: "Message sent successfully!", sender: 'system' },
                ]);
            } else {
                setResponse("Error sending message: " + data.error);
                setChatHistory((prev) => [
                    ...prev,
                    { text: "Error sending message: " + data.error, sender: 'system' },
                ]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setResponse("Error sending message");
            setChatHistory((prev) => [
                ...prev,
                { text: "Error sending message", sender: 'system' },
            ]);
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 400,
                mx: 'auto',
                mt: 5,
                p: 2,
                border: '1px solid #ddd',
                borderRadius: 3,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MessageIcon fontSize="large" sx={{ color: '#665CAC', mr: 1 }} />
                <Typography variant="h6" component="h2">
                    Viber Chat
                </Typography>
            </Box>

            <Box
                sx={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    p: 2,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2,
                    mb: 2,
                }}
            >
                {chatHistory.map((chat, index) => (
                    <Box
                        key={index}
                        sx={{
                            alignSelf: chat.sender === "user" ? "flex-end" : "flex-start",
                            backgroundColor: chat.sender === "user" ? "#DCF8C6" : "#E5E5EA",
                            color: "#333",
                            borderRadius: 2,
                            p: 1,
                            maxWidth: "70%",
                            wordBreak: "break-word",
                        }}
                    >
                        {chat.text}
                    </Box>
                ))}
            </Box>

            <TextField
                label="Type a message"
                multiline
                rows={2}
                variant="outlined"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ mb: 1 }}
                disabled={!phoneNumber}
            />
            <Button
                variant="contained"
                fullWidth
                onClick={handleSendMessage}
                disabled={!phoneNumber}
                sx={{
                    backgroundColor: '#665CAC',
                    '&:hover': {
                        backgroundColor: '#564B9A',
                    },
                }}
            >
                Send
            </Button>
            {response && (
                <Box mt={2}>
                    <Typography color="error">{response}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default ViberMessages;
