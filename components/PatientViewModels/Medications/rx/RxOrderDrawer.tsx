"use client";

import React, { useRef } from "react";
import { X, MessageSquareShare, Mail, Calendar, Phone, MapPin, User, Activity, Clock9, Clock, Aperture, BadgeAlert, PillBottle, Tablets, Hourglass, Download } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader } from "./../../../../components/ui/drawer";
import { ScrollArea } from "./../../../form/ScrollArea";
import { usePatientDashboard } from "./.././../PatientViewModelContext";
import { IRxOrder } from "./../../../../models/patient";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface RxOrderDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    rxOrder: IRxOrder | null;
}

export default function RxOrderDrawer({ isOpen, onClose, rxOrder }: RxOrderDrawerProps) {
    const { patientInfo } = usePatientDashboard();
    const drawerRef = useRef(null);

    // Logging to confirm data availability
    console.log("Patient Info:", patientInfo);
    console.log("Rx Order:", rxOrder);

    // Wait until both patientInfo and rxOrder are defined
    if (!rxOrder || !patientInfo) return null;

    const onDownload = async () => {
        if (drawerRef.current) {
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
        }
    };

    const sendTextMessage = () => {
        const phoneNumber = patientInfo.phoneNumber;
        const patientName = patientInfo.patientName;
        const doctorName = rxOrder?.prescribingDr || "Your Doctor";
        const medicationsList = rxOrder?.prescriptions?.[0]?.medication || "your prescription";
        const message = `Hello ${patientName},\n\nThis is Dr. ${doctorName}. Here are your prescribed medications: ${medicationsList}.`;

        window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    };

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent direction="bottom" size="75%" title="Export Rx">
                <DrawerHeader className="border-b border-orange-200 z-50 mb-4">
                    <div className="absolute right-20 top-4 flex space-x-2">
                        <div className="rounded-full p-3 bg-orange-100 hover:bg-orange-200 transition-colors">
                            <button onClick={sendTextMessage} className="flex items-center justify-center text-orange-900 hover:text-orange-500 transition-colors">
                                <MessageSquareShare className="h-5 w-5" />
                                <span className="sr-only">Share via Message</span>
                            </button>
                        </div>
                        <div className="rounded-full p-3 bg-orange-100 hover:bg-orange-200 transition-colors">
                            <button onClick={onDownload} className="flex items-center justify-center text-orange-900 hover:text-orange-500 transition-colors">
                                <Download className="h-5 w-5" />
                                <span className="sr-only">Download Locally</span>
                            </button>
                        </div>
                    </div>
                </DrawerHeader>
                <ScrollArea className="flex-grow">
                    <div ref={drawerRef} className="p-6 space-y-6 bg-orange-950">
                        <div className="bg-orange-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-4 text-center text-orange-900 border-b border-orange-200 pb-2">Patient Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p className="flex items-center"><User className="h-4 w-4 mr-2 text-orange-500" /><strong
                                    className="text-orange-900 mr-2">Name:</strong> {patientInfo.patientName}</p>
                                <p className="flex items-center"><Calendar
                                    className="h-4 w-4 mr-2 text-orange-500" /><strong
                                    className="text-orange-900 mr-2">DOB:</strong> {patientInfo.dob.toLocaleDateString()}
                                </p>
                                <p className="flex items-center"><Phone
                                    className="h-4 w-4 mr-2 text-orange-500" /><strong
                                    className="text-orange-900 mr-2">Phone:</strong> {patientInfo.phoneNumber}</p>
                                <p className="flex items-center"><MapPin
                                    className="h-4 w-4 mr-2 text-orange-500" /><strong
                                    className="text-orange-900 mr-2">City:</strong> {patientInfo.city}</p>
                            </div>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-4 text-center text-orange-900 border-b border-orange-200 pb-2">Prescribing Doctor</h3>
                            <p className="flex items-center justify-center mb-4"><Mail
                                className="h-4 w-4 mr-2 text-orange-500" /><strong
                                className="text-orange-900 mr-2">Email:</strong> {rxOrder.drEmail}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p className="flex items-center"><Activity
                                    className="h-4 w-4 mr-2 text-orange-500" /><strong className="text-orange-900 mr-2">Prescribed By:</strong> Dr. {rxOrder.prescribingDr}</p>
                                <p className="flex items-center"><Aperture
                                    className="h-4 w-4 mr-2 text-orange-500" /><strong className="text-orange-900 mr-2">Specialization:</strong> {rxOrder.doctorSpecialization}</p>
                                <p className="flex items-center"><Clock9
                                    className="h-4 w-4 mr-2 text-orange-500" /><strong className="text-orange-900 mr-2">Prescribed Date:</strong> {new Date(rxOrder.prescribedDate).toLocaleDateString()}</p>
                                <p className="flex items-center"><Clock
                                    className="h-4 w-4 mr-2 text-orange-500" /><strong className="text-orange-900 mr-2">Valid Till:</strong> {new Date(rxOrder.validTill).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-4 text-center text-orange-900 border-b border-orange-200 pb-2">Medications</h3>
                            <div className="space-y-4">
                                {(rxOrder.prescriptions || []).map((prescription, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg border border-orange-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <p className="text-top-align">
                                                <BadgeAlert className="h-4 w-4 mr-2 text-orange-500"/>
                                                <strong className="text-orange-900 mr-2">Diagnosis:</strong>
                                                <span>{prescription.diagnosis}</span>
                                            </p>
                                            <p className="text-top-align">
                                                <PillBottle className="h-4 w-4 mr-2 text-orange-500"/>
                                                <strong className="text-orange-900 mr-2">Medication:</strong>
                                                <span>{prescription.medication}</span>
                                            </p>
                                            <p className="text-top-align">
                                                <Tablets className="h-4 w-4 mr-2 text-orange-500"/>
                                                <strong className="text-orange-900 mr-2">Dosage:</strong>
                                                <span>{prescription.dosage}</span>
                                            </p>
                                            <p className="text-top-align">
                                                <Hourglass className="h-4 w-4 mr-2 text-orange-500"/>
                                                <strong className="text-orange-900 mr-2">Frequency:</strong>
                                                <span>{prescription.frequency}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}