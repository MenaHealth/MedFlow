// components/PatientViewModels/Medications/rx/RxOrderDrawerView.tsx

import React, { useRef } from "react";
import { MessageSquareShare, Mail, Calendar, Phone, MapPin, User, Activity, Clock9, Clock, Aperture, Download, Hourglass, Tablets, PillBottle, BadgeAlert } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { usePatientDashboard } from "@/components/PatientViewModels/PatientViewModelContext";
import { IRxOrder } from "@/models/patient";
import { TextFormField } from "@/components/ui/TextFormField";
import { useRxOrderDrawerViewModel } from "./RxOrderDrawerViewModel";

interface RxOrderDrawerViewProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
    rxOrder: IRxOrder | null; // Add rxOrder prop here
}

export default function RxOrderDrawerView({ isOpen, onClose, patientId, rxOrder }: RxOrderDrawerViewProps) {
    const { patientInfo } = usePatientDashboard();
    const drawerRef = useRef<HTMLDivElement>(null);

    const {
        onDownloadPDF,
        onDownloadJPG,
        sendTextMessage,
    } = useRxOrderDrawerViewModel(patientId, onClose, rxOrder); // Pass rxOrder here

    if (!patientInfo || !rxOrder) {
        return null; // Render nothing if patientInfo or rxOrder is null
    }

    return (
        <Drawer>
            <DrawerContent direction="bottom" size="75%" title="Export Rx">
                <DrawerHeader className="border-b border-orange-200 z-50 mb-4">
                    <div className="flex justify-center space-x-4 mt-4">
                        <button onClick={() => sendTextMessage()} className="flex flex-col items-center justify-center text-orange-950 hover:text-orange-500 transition-colors">
                            <div className="rounded-full p-3 bg-orange-100 hover:bg-orange-200 transition-colors">
                                <MessageSquareShare className="h-5 w-5" />
                            </div>
                            <span className="mt-1 text-xs">Share SMS</span>
                        </button>
                        <button onClick={() => onDownloadPDF(drawerRef)} className="flex flex-col items-center justify-center text-orange-900 hover:text-orange-500 transition-colors">
                            <div className="rounded-full p-3 bg-orange-100 hover:bg-orange-200 transition-colors">
                                <Download className="h-5 w-5" />
                            </div>
                            <span className="mt-1 text-xs">PDF</span>
                        </button>
                        <button onClick={() => onDownloadJPG(drawerRef)} className="flex flex-col items-center justify-center text-orange-900 hover:text-orange-500 transition-colors">
                            <div className="rounded-full p-3 bg-orange-100 hover:bg-orange-200 transition-colors">
                                <Download className="h-5 w-5" />
                            </div>
                            <span className="mt-1 text-xs">JPG</span>
                        </button>
                    </div>
                </DrawerHeader>
                <ScrollArea className="flex-grow mt-16">
                    <div ref={drawerRef} className="p-6 space-y-6 bg-orange-950 rounded-lg">
                        <div className="bg-orange-50 p-4 rounded-lg">
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
                                    className="text-orange-900 mr-2">Phone:</strong> {`${patientInfo.phone?.countryCode || ''} ${patientInfo.phone?.phoneNumber || ''}`}
                                </p>
                                <p className="flex items-center"><MapPin
                                    className="h-4 w-4 mr-2 text-orange-500"/><strong
                                    className="text-orange-900 mr-2">City:</strong> {patientInfo.city}</p>
                            </div>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-4 text-center text-orange-900 border-b border-orange-200 pb-2">Prescribing
                                Doctor</h3>
                            <p className="flex items-center justify-center mb-4"><Mail
                                className="h-4 w-4 mr-2 text-orange-500"/><strong
                                className="text-orange-900 mr-2">Email:</strong> {rxOrder.drEmail}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p className="flex items-center"><Activity
                                    className="h-4 w-4 mr-2 text-orange-500"/><strong className="text-orange-900 mr-2">Prescribed
                                    By:</strong> Dr. {rxOrder.prescribingDr}</p>
                                <p className="flex items-center"><Aperture
                                    className="h-4 w-4 mr-2 text-orange-500"/><strong
                                    className="text-orange-900 mr-2">Specialization:</strong> {rxOrder.doctorSpecialty}
                                </p>
                                <p className="flex items-center"><Clock9
                                    className="h-4 w-4 mr-2 text-orange-500"/><strong className="text-orange-900  mr-2">Prescribed
                                    Date:</strong> {new Date(rxOrder.prescribedDate).toLocaleDateString()}</p>
                                <p className="flex items-center"><Clock
                                    className="h-4 w-4 mr-2 text-orange-500"/><strong className="text-orange-900 mr-2">Valid
                                    Till:</strong> {new Date(rxOrder.validTill).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-4 text-center text-orange-900 border-b border-orange-200 pb-2">Medications</h3>
                            <div className="space-y-4">
                                {(rxOrder.prescriptions || []).map((prescription, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg border border-orange-200">
                                        <div className="space-y-4">
                                            {/* Diagnosis */}
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col flex-1">
                                                    <strong className="text-orange-900 mb-1">Diagnosis:</strong>
                                                    <p className="break-words">{prescription.diagnosis}</p>
                                                </div>
                                                <div className="flex items-center h-full">
                                                    <BadgeAlert className="text-orange-500 w-5 h-5"/>
                                                </div>
                                            </div>

                                            {/* Medication */}
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col flex-1">
                                                    <strong className="text-orange-900 mb-1">Medication:</strong>
                                                    <p className="break-words">{prescription.medication}</p>
                                                </div>
                                                <div className="flex items-center h-full">
                                                    <PillBottle className="text-orange-500 w-5 h-5"/>
                                                </div>
                                            </div>

                                            {/* Dosage */}
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col flex-1">
                                                    <strong className="text-orange-900 mb-1">Dosage:</strong>
                                                    <p className="break-words">{prescription.dosage}</p>
                                                </div>
                                                <div className="flex items-center h-full">
                                                    <Tablets className="text-orange-500 w-5 h-5"/>
                                                </div>
                                            </div>

                                            {/* Frequency */}
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col flex-1">
                                                    <strong className="text-orange-900 mb-1">Frequency:</strong>
                                                    <p className="break-words">{prescription.frequency}</p>
                                                </div>
                                                <div className="flex items-center h-full">
                                                    <Hourglass className="text-orange-500 w-5 h-5"/>
                                                </div>
                                            </div>
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