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

    const onDownloadPDF = async (drawerRef: RefObject<HTMLDivElement>) => {
        if (!drawerRef.current || !patientInfo || !rxOrder) return;

        const canvas = await html2canvas(drawerRef.current, {
            scale: 2,
            width: 1080,
            windowWidth: 1080,
            useCORS: true,
            scrollX: 0,
            scrollY: 0,
        });

        const imgData = canvas.toDataURL("image/jpeg", 1);

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: [canvas.width, canvas.height + 200],
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        const logo = new Image();
        logo.src = "/assets/images/mena_health_logo.jpeg"; // Corrected Path
        logo.onload = () => {
            const logoWidth = 300;
            const logoHeight = 120;
            const xPosition = (pdfWidth - logoWidth) / 2;
            const yPosition = 10;

            pdf.addImage(logo, "JPEG", xPosition, yPosition, logoWidth, logoHeight);

            const contentYPosition = yPosition + logoHeight + 20;
            pdf.addImage(imgData, "JPEG", 0, contentYPosition, pdfWidth, pdfHeight);

            const patientName = patientInfo.patientName.replace(/\s+/g, "_");
            const doctorName = rxOrder.prescribingDr.replace(/\s+/g, "_");
            const prescribedDate = new Date(rxOrder.prescribedDate).toLocaleDateString().replace(/\//g, "-");

            const fileName = `Prescription_${patientName}_${prescribedDate}_Dr_${doctorName}.pdf`;

            pdf.save(fileName);
        };
    };

    const onDownloadJPG = async (drawerRef: RefObject<HTMLDivElement>) => {
        if (!drawerRef.current || !patientInfo || !rxOrder) return;

        const canvas = await html2canvas(drawerRef.current, {
            scale: 2,
            width: 1080,
            windowWidth: 1080,
            useCORS: true,
        });

        const logo = new Image();
        logo.src = "/assets/images/mena_health_logo.jpeg"; // Corrected Path

        await new Promise((resolve, reject) => {
            logo.onload = resolve;
            logo.onerror = () => reject(new Error("Logo image failed to load"));
        });

        const newCanvas = document.createElement("canvas");
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height + 200;

        const ctx = newCanvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context is not available");

        const logoWidth = 300;
        const logoHeight = 120;
        const xPosition = (newCanvas.width - logoWidth) / 2;
        ctx.drawImage(logo, xPosition, 10, logoWidth, logoHeight);
        ctx.drawImage(canvas, 0, logoHeight + 20);

        const imgData = newCanvas.toDataURL("image/jpeg", 0.95);

        const link = document.createElement("a");
        link.href = imgData;
        link.download = `Prescription_${patientInfo.patientName.replace(/\s+/g, "_")}_${new Date(rxOrder.prescribedDate).toLocaleDateString().replace(/\//g, "-")}_Dr_${rxOrder.prescribingDr.replace(/\s+/g, "_")}.jpg`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const sendTextMessage = () => {
        if (!patientInfo || !rxOrder) return;

        const phoneNumber = `${patientInfo.phone?.countryCode || ''}${patientInfo.phone?.phoneNumber || ''}`;
        const message = `Hello ${patientInfo.patientName},\n\nThis is Dr. ${rxOrder.prescribingDr}. You can access your prescription details at the following link:\n${rxOrder.PatientRxUrl}\n\nPlease take this link to your pharmacy to fulfill the prescription.`;

        // Use the `sms:` protocol to send the SMS
        window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    };

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
        onDownloadPDF,
        onDownloadJPG,
        sendTextMessage,
        copyLink,
        copyMessage,
    };
}