// components/PatientViewModels/Medications/rx/RxOrderDrawerViewModel.ts

import { useState, RefObject, useEffect } from 'react';
import { usePatientDashboard } from '@/components/PatientViewModels/PatientViewModelContext';
import { IRxOrder } from "@/models/patient";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Types } from 'mongoose';
import { useToast } from '@/components/hooks/useToast';

export function useRxOrderDrawerViewModel(
    patientId: Types.ObjectId | undefined | string,
    onClose: () => void,
    initialRxOrder: IRxOrder | null
) {
    const { userSession, patientInfo } = usePatientDashboard();
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
        if (patientInfo && rxOrder) {
            const message = `Hello ${patientInfo.patientName},\n\nThis is Dr. ${rxOrder.prescribingDr}. You can access your prescription details at the following link:\n${rxOrder.PatientRxUrl}\n\nPlease take this link to your pharmacy to fulfill the prescription.`;
            navigator.clipboard.writeText(message);
            setToast({
                title: 'Message Copied',
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