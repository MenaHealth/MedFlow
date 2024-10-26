"use client"

import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "./../../../ui/Drawer";
import { RxOrder } from './../../../../models/patient'; // Ensure this path matches your RxOrder type definition

interface RxOrderDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    rxOrder: RxOrder | null;
}

export default function RxOrderDrawer({ isOpen, onClose, rxOrder }: RxOrderDrawerProps) {
    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Prescription Details</DrawerTitle>
                    <DrawerClose className="text-sm text-muted">Close</DrawerClose>
                </DrawerHeader>
                {rxOrder && (
                    <div className="mt-4 space-y-2">
                        <p><strong>City:</strong> {rxOrder.city}</p>
                        <p><strong>Valid Till:</strong> {new Date(rxOrder.validTill).toLocaleDateString()}</p>
                        <h4 className="mt-2 font-bold">Prescriptions:</h4>
                        {rxOrder.prescriptions.map((prescription, index) => (
                            <div key={index} className="mt-2 p-2 bg-gray-100 rounded-sm">
                                <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                                <p><strong>Medication:</strong> {prescription.medication}</p>
                                <p><strong>Dosage:</strong> {prescription.dosage}</p>
                                <p><strong>Frequency:</strong> {prescription.frequency}</p>
                            </div>
                        ))}
                    </div>
                )}
                <DrawerFooter className="mt-6">
                    <div className="flex flex-col items-center space-y-2">
                        <button className="text-sm text-blue-500">Share via Message</button>
                        <button className="text-sm text-blue-500">Share via Email</button>
                        <button className="text-sm text-blue-500">Share via Telegram</button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}