    // components/patientViewModels/telegram-messages/TelegramMessagesDoctorView.tsx

    "use client";

    import React, { useEffect, useRef } from "react";
    import useTelegramMessagesViewModel from "./TelegramMessagesViewModel";
    import { TelegramMessagesView } from "./TelegramMessagesView";
    import { CircleLoader } from "react-spinners";
    import { ToastProvider } from "@/components/ui/toast";
    import { ToastComponent } from "@/components/hooks/useToast";

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
            setMessages, // note we can still get setMessages from the view model if needed
        } = useTelegramMessagesViewModel(telegramChatId);

        const [isLoadingMessages, setIsLoadingMessages] = React.useState(true);
        const scrollAreaRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (telegramChatId) {
                setIsLoadingMessages(true);
                loadMessages()
                    .then(() => {
                        // messages are now loaded into viewModel's messages state
                    })
                    .finally(() => setIsLoadingMessages(false));
            }
        }, [loadMessages, telegramChatId]);

        return (
            <ToastProvider>
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
                            setMessages={setMessages} // pass from view model
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
                <ToastComponent />
            </ToastProvider>
        );
    };

    export default TelegramMessagesDoctorView;