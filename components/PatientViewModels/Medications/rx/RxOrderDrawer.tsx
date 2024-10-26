"use client"

import React from 'react';
import { X } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "./../../../../components/ui/drawer";
import { ScrollArea } from "./../../../form/ScrollArea";
import { usePatientDashboard } from './.././../PatientViewModelContext';
import { RxOrder } from './../../../../models/patient';

interface RxOrderDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    rxOrder: RxOrder | null;
}

export default function RxOrderDrawer({ isOpen, onClose, rxOrder }: RxOrderDrawerProps) {
    const { patientInfo } = usePatientDashboard();

    if (!rxOrder || !patientInfo) return null;

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="h-[85vh]">
                <DrawerHeader className="text-center relative">
                    <DrawerTitle className="text-2xl font-bold">Prescription Details</DrawerTitle>
                    <DrawerClose className="absolute right-4 top-4 z-50">
                        <X className="h-6 w-6" />
                    </DrawerClose>
                </DrawerHeader>
                <ScrollArea className="flex-grow px-6">
                    <div className="space-y-6 flex flex-col text-left border-2 border-darkBlue rounded-lg p-4 w-3/4 max-w-lg mx-auto">
                        <div className="bg-muted p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2 text-center">Patient Information</h3>
                            <p><strong>Name:</strong> {patientInfo.patientName}</p>
                            <p><strong>DOB:</strong> {patientInfo.dob.toLocaleDateString()}</p>
                            <p><strong>Phone:</strong> {patientInfo.phoneNumber}</p>
                            <p><strong>City:</strong> {patientInfo.city}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2 text-center">Prescription Details</h3>
                            <p><strong>Prescribed By:</strong> Dr. {rxOrder.prescribingDr}</p>
                            <p><strong>Specialization:</strong> {rxOrder.doctorSpecialization}</p>
                            <p><strong>Prescribed Date:</strong> {new Date(rxOrder.date).toLocaleDateString()}</p>
                            <p><strong>Valid Till:</strong> {new Date(rxOrder.validTill).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2 text-center">Medications</h3>
                            {rxOrder.prescriptions.map((prescription, index) => (
                                <div key={index} className="bg-muted p-4 rounded-lg mb-4">
                                    <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                                    <p><strong>Medication:</strong> {prescription.medication}</p>
                                    <p><strong>Dosage:</strong> {prescription.dosage}</p>
                                    <p><strong>Frequency:</strong> {prescription.frequency}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollArea>
                <DrawerFooter className="flex flex-col items-center space-y-2">
                    <button className="w-full text-sm text-blue-500 hover:text-blue-700 transition-colors">Share via Message</button>
                    <button className="w-full text-sm text-blue-500 hover:text-blue-700 transition-colors">Share via Email</button>
                    <button className="w-full text-sm text-blue-500 hover:text-blue-700 transition-colors">Share via Telegram</button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}