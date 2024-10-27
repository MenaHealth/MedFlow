"use client"

import React from 'react';
import { X, MessageSquareShare, MailPlus } from 'lucide-react';
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
            <DrawerContent direction="bottom" size="75%">
                <DrawerHeader>
                    <DrawerTitle>Prescription Details</DrawerTitle>
                    <div className="absolute right-4 top-4 flex space-x-2">
                        <button className="flex items-center text-blue-500 hover:text-blue-700 transition-colors">
                            <MessageSquareShare className="h-5 w-5 mr-1" />
                            <span className="hidden md:inline">Share via Message</span>
                        </button>
                        <button className="flex items-center text-blue-500 hover:text-blue-700 transition-colors">
                            <MailPlus className="h-5 w-5 mr-1" />
                            <span className="hidden md:inline">Share via Email</span>
                        </button>
                    </div>
                </DrawerHeader>
                <ScrollArea className="flex-grow">
                    <div className="space-y-6 p-6">
                        <div className="bg-muted p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2 text-center">Patient Information</h3>
                            <p><strong>Name:</strong> {patientInfo.patientName}</p>
                            <p><strong>DOB:</strong> {patientInfo.dob.toLocaleDateString()}</p>
                            <p className="flex items-center">
                                <MessageSquareShare className="h-4 w-4 mr-2" />
                                <strong>Phone:</strong> {patientInfo.phoneNumber}
                            </p>
                            <p className="flex items-center">
                                <MailPlus className="h-4 w-4 mr-2" />
                                <strong>Email:</strong> {patientInfo.email}
                            </p>
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
                <DrawerFooter className="md:hidden flex flex-col items-center space-y-2">
                    <button className="flex items-center text-sm text-blue-500 hover:text-blue-700 transition-colors">
                        <MessageSquareShare className="h-5 w-5 mr-2" />
                        Share via Message
                    </button>
                    <button className="flex items-center text-sm text-blue-500 hover:text-blue-700 transition-colors">
                        <MailPlus className="h-5 w-5 mr-2" />
                        Share via Email
                    </button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}