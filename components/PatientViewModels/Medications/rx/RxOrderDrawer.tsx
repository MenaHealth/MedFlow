"use client"

import React, {useRef} from 'react';
import { X, MessageSquareShare, MailPlus, Calendar, Phone, MapPin, User, Activity, Clock9, Clock, Aperture, BadgeAlert, PillBottle, Tablets, Hourglass, Download } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "./../../../../components/ui/drawer";
import { ScrollArea } from "./../../../form/ScrollArea";
import { usePatientDashboard } from './.././../PatientViewModelContext';
import { RxOrder } from './../../../../models/patient';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface RxOrderDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    rxOrder: RxOrder | null;
}


export default function RxOrderDrawer({ isOpen, onClose, rxOrder }: RxOrderDrawerProps) {
    const { patientInfo } = usePatientDashboard();
    const drawerRef = useRef(null);

    if (!rxOrder || !patientInfo) return null;

    const onDownload = async () => {
        if (drawerRef.current) {
            // Capture the drawer content with a higher scale for better quality
            const canvas = await html2canvas(drawerRef.current, { scale: 1.2 });
            const imgData = canvas.toDataURL('image/jpeg', 1); // High-quality JPEG

            const pdf = new jsPDF();
            const pdfWidth = pdf.internal.pageSize.getWidth();

            // Add the logo at the top as a header
            const logo = new Image();
            logo.src = '/assets/images/mena_health_logo.jpeg';
            logo.onload = () => {
                const logoWidth = 50; // Set logo width
                const logoHeight = 20; // Set logo height
                const logoX = (pdfWidth - logoWidth) / 2; // Center the logo
                const logoY = 10; // Position at the top with a 10-unit margin

                pdf.addImage(logo, 'JPEG', logoX, logoY, logoWidth, logoHeight);

                // Adjust Y position for main content below the logo
                const contentYPosition = logoY + logoHeight + 10; // Space below the logo

                // Add the captured content starting from adjusted Y position
                const imgProps = pdf.getImageProperties(imgData);
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'JPEG', 0, contentYPosition, pdfWidth, pdfHeight, undefined, 'FAST');

                // Save the PDF
                pdf.save("PrescriptionDetails.pdf");
            };
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent direction="bottom" size="75%" title="Prescription Details">
                <DrawerHeader className="border-b border-orange-200 z-50 mb-4">
                    <div className="absolute right-20 top-4 flex space-x-2">
                        <div className="rounded-full p-3 bg-orange-100 hover:bg-orange-200 transition-colors">
                            <button
                                className="flex items-center justify-center text-orange-900 hover:text-orange-500 transition-colors">
                                <MessageSquareShare className="h-5 w-5"/>
                                <span className="sr-only">Share via Message</span>
                            </button>
                        </div>
                        <div className="rounded-full p-3 bg-orange-100 hover:bg-orange-200 transition-colors">
                            <button
                                className="flex items-center justify-center text-orange-900 hover:text-orange-500 transition-colors">
                                <MailPlus className="h-5 w-5"/>
                                <span className="sr-only">Share via Email</span>
                            </button>
                        </div>
                        <div className="rounded-full p-3 bg-orange-100 hover:bg-orange-200 transition-colors">
                            <button
                                onClick={onDownload}
                                className="flex items-center justify-center text-orange-900 hover:text-orange-500 transition-colors">
                                <Download className="h-5 w-5"/>
                                <span className="sr-only">Download Locally</span>
                            </button>
                        </div>
                    </div>
                </DrawerHeader>
                <ScrollArea className="flex-grow">
                    <div ref={drawerRef} className="p-6 space-y-6">
                        <div className="bg-orange-50 p-4 rounded-lg ">
                            <h3 className="font-semibold text-lg mb-4 text-center text-orange-900 border-b border-orange-200 pb-2">Patient
                                Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p className="flex items-center"><User className="h-4 w-4 mr-2 text-orange-500"/><strong
                                    className="text-orange-900 mr-2">Name:</strong> {patientInfo.patientName}</p>
                                <p className="flex items-center"><Calendar
                                    className="h-4 w-4 mr-2 text-orange-500"/><strong
                                    className="text-orange-900 mr-2">DOB:</strong> {patientInfo.dob.toLocaleDateString()}
                                </p>
                                <p className="flex items-center"><Phone
                                    className="h-4 w-4 mr-2 text-orange-500"/><strong
                                    className="text-orange-900 mr-2">Phone:</strong> {patientInfo.phoneNumber}</p>
                                <p className="flex items-center"><MailPlus
                                    className="h-4 w-4 mr-2 text-orange-500"/><strong
                                    className="text-orange-900 mr-2">Email:</strong> {patientInfo.email}</p>
                                <p className="flex items-center md:col-span-2"><MapPin
                                    className="h-4 w-4 mr-2 text-orange-500"/><strong
                                    className="text-orange-900 mr-2">City:</strong> {patientInfo.city}</p>
                            </div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg ">
                            <h3 className="font-semibold text-lg mb-4 text-center text-orange-900 border-b border-orange-200 pb-2">Prescribing
                                Doctor</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p className="flex items-center"><Activity
                                    className="h-4 w-4 mr-2 text-orange-500"/><strong className="text-orange-900 mr-2">Prescribed
                                    By:</strong> Dr. {rxOrder.prescribingDr}</p>
                                <p className="flex items-center"><Aperture
                                    className="h-4 w-4 mr-2 text-orange-500"/><strong
                                    className="text-orange-900 mr-2">Specialization:</strong> {rxOrder.doctorSpecialization}
                                </p>
                                <p className="flex items-center"><Clock9
                                    className="h-4 w-4 mr-2 text-orange-500"/><strong className="text-orange-900 mr-2">Prescribed
                                    Date:</strong> {new Date(rxOrder.date).toLocaleDateString()}</p>
                                <p className="flex items-center"><Clock
                                    className="h-4 w-4 mr-2 text-orange-500"/><strong className="text-orange-900 mr-2">Valid
                                    Till:</strong> {new Date(rxOrder.validTill).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg ">
                            <h3 className="font-semibold text-lg mb-4 text-center text-orange-900 border-b border-orange-200 pb-2">Medications</h3>
                            <div className="space-y-4">
                                {rxOrder.prescriptions.map((prescription, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg border border-orange-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <p className="flex items-center"><BadgeAlert
                                                className="h-4 w-4 mr-2 text-orange-500"/><strong
                                                className="text-orange-900 mr-2">Diagnosis:</strong> {prescription.diagnosis}
                                            </p>
                                            <p className="flex items-center"><PillBottle
                                                className="h-4 w-4 mr-2 text-orange-500"/><strong
                                                className="text-orange-900 mr-2">Medication:</strong> {prescription.medication}
                                            </p>
                                            <p className="flex items-center"><Tablets
                                                className="h-4 w-4 mr-2 text-orange-500"/><strong
                                                className="text-orange-900 mr-2">Dosage:</strong> {prescription.dosage}
                                            </p>
                                            <p className="flex items-center"><Hourglass
                                                className="h-4 w-4 mr-2 text-orange-500"/><strong
                                                className="text-orange-900 mr-2">Frequency:</strong> {prescription.frequency}
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