// components/patientViewModels/Medications/rx/RxOrderDrawerViewModel.ts

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // Import the session hook
import { IRxOrder } from "@/models/patient";
import { useToast } from '@/components/hooks/useToast';

export function useRxOrderDrawerViewModel(
    initialRxOrder: IRxOrder | null
) {
    const { data: session } = useSession(); // Use session directly here
    const [rxOrder, setRxOrder] = useState<IRxOrder | null>(null);
    const { setToast } = useToast();

    useEffect(() => {
        if (initialRxOrder) {
            setRxOrder(initialRxOrder);
        }
    }, [initialRxOrder]);

    const copyLink = () => {
        if (rxOrder && rxOrder.PatientRxUrl) {
            navigator.clipboard.writeText(rxOrder.PatientRxUrl);
            setToast({
                title: 'Link Copied',
                description: 'The prescription link has been copied to your clipboard.',
                variant: 'success',
            });
        }
    };

    const copyMessage = () => {
        if (rxOrder) {
            const message = `Hello, this is Dr. ${session?.user?.firstName} ${session?.user?.lastName}. 
            You can access your prescription details at the following link:
            ${rxOrder.PatientRxUrl}.
            Please take this link to your pharmacy to fulfill the prescription.`;
            navigator.clipboard.writeText(message);
            setToast({
                title: 'TelegramMessage Copied',
                description: 'The SMS message has been copied to your clipboard.',
                variant: 'success',
            });
        }
    };

    return {
        rxOrder,
        copyLink,
        copyMessage,
    };
}