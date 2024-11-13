// components/PatientViewModels/Medications/rx/RxOrderDrawerViewModel.ts

import { useState, RefObject, useEffect } from 'react';
import { usePatientDashboard } from '@/components/PatientViewModels/PatientViewModelContext';
import { IRxOrder } from "@/models/patient";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function useRxOrderDrawerViewModel(
    patientId: string,
    onClose: () => void,
    initialRxOrder: IRxOrder | null
) {
    const { userSession, patientInfo } = usePatientDashboard();
    const [rxOrder, setRxOrder] = useState<IRxOrder | null>(null);

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
        logo.src = "/assets/images/mena_health_logo.jpeg";

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
        logo.src = "/images/mena_health_logo.jpeg";

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
        const patientName = patientInfo.patientName;
        const doctorName = rxOrder.prescribingDr || "Your Doctor";
        const medicationsList = rxOrder.prescriptions[0]?.medication || "your prescription";
        const message = `Hello ${patientName},\n\nThis is Dr. ${doctorName}. Here are your prescribed medications: ${medicationsList}.`;

        window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    };

    return {
        rxOrder,
        onDownloadPDF,
        onDownloadJPG,
        sendTextMessage,
    };
}