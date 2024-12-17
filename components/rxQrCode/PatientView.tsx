// components/rxQrCode/PatientView.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableColumn } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Expand } from 'lucide-react';

// Import the IRxOrder interface from your patient model
import { IRxOrder } from '@/models/patient';

interface QRCodeDisplayProps {
    uuid: string;
}

interface RxOrderWithPatient extends IRxOrder {
    patientName: string;
    patientDob: string;
    patientCountry: string;
    patientCity: string;
}

const PatientView: React.FC<QRCodeDisplayProps> = ({ uuid }) => {
    const [rxOrder, setRxOrder] = useState<RxOrderWithPatient | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRxOrder = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/rx-order-qr-code/patient/${uuid}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch RX order');
                }
                const data = await response.json();
                console.log('Patient RX Order Data:', data);
                setRxOrder(data);
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchRxOrder();
    }, [uuid]);

    const prescriptionColumns: TableColumn<Omit<IRxOrder['prescriptions'][0], 'diagnosis'>>[] = [
        { key: 'medication', header: 'Medication' },
        { key: 'dosage', header: 'Dosage' },
        { key: 'frequency', header: 'Frequency' },
    ];

    if (loading) {
        return (
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-8 w-3/4" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-1/2" />
                </CardContent>
            </Card>
        );
    }

    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!rxOrder) return <div>No RX order found</div>;

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Image
                        src="/assets/images/mena_health_logo.jpeg"
                        alt="Mena Health Logo"
                        width={80}
                        height={80}
                        className="rounded-full"
                    />
                    <CardTitle>Prescription Details</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Display message if RX order is completed */}
                {rxOrder.rxStatus === 'completed' ? (
                    <div className="text-center bg-orange-100 text-orange-800 p-4 rounded-md border border-orange-300">
                        <p className="font-semibold">RX Order Completed</p>
                        <p>Please contact your doctor to refill your prescription.</p>
                    </div>
                ) : (
                    <>
                    {/* QR Code Display */}
                    <div className="flex justify-center">
                    <div className="relative inline-block">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="absolute -top-4 -right-4 bg-white text-orange-500 hover:bg-orange-500 hover:text-white shadow-md rounded-full p-1 z-10"
                                >
                                    <Expand className="h-4 w-4"/>
                                    <span className="sr-only">Expand QR Code</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>QR Code</DialogTitle>
                                    <DialogDescription>Scan this QR code for your RX Order</DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center justify-center p-6">
                                    {rxOrder.PharmacyQrCode ? (
                                        <Image
                                            src={rxOrder.PharmacyQrCode}
                                            alt="QR Code for RX Order"
                                            width={300}
                                            height={300}
                                            className="max-w-full h-auto"
                                        />
                                    ) : (
                                        <div
                                            className="flex items-center justify-center w-[300px] h-[300px] bg-gray-200 text-gray-500">
                                            QR Code not available
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>

                        {rxOrder.PharmacyQrCode ? (
                            <Image
                                src={rxOrder.PharmacyQrCode}
                                alt="QR Code for RX Order"
                                width={200}
                                height={200}
                                className="border rounded-lg shadow-md"
                            />
                        ) : (
                            <div
                                className="w-[200px] h-[200px] flex items-center justify-center bg-gray-200 text-gray-500 border rounded-lg shadow-md">
                                QR Code not available
                            </div>
                        )}
                    </div>
                </div>


                {/* Diagnosis and Prescription Info */}
                <div className="space-y-4">
                    {rxOrder.prescriptions.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Diagnosis</h3>
                            <div className="border-gray-300 p-2 rounded-md border">
                                <p>{rxOrder.prescriptions[0].diagnosis}</p>
                            </div>
                        </div>
                    )}
                    <h3 className="text-lg font-semibold mb-2">Prescriptions</h3>
                    <Table
                        data={rxOrder.prescriptions.map(({diagnosis, ...rest}) => rest)}
                        columns={prescriptionColumns}
                        backgroundColor="bg-white"
                        textColor="text-gray-900"
                        borderColor="border-gray-200"
                        headerBackgroundColor="bg-gray-100"
                        headerTextColor="text-gray-700"
                        hoverBackgroundColor="hover:bg-gray-50"
                        hoverTextColor="hover:text-gray-900"
                    />
                </div>

                {/* Order Details inside Accordion */}
                <Accordion type="single" collapsible className="w-full bg-darkBlue text-white rounded-2xl px-4">
                    <AccordionItem value="order-details">
                        <AccordionTrigger className="justify-center text-center">Order Details</AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-lg">Patient Information</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <h5 className="font-semibold border-b pb-1">Name</h5>
                                            <p>{rxOrder.patientName || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold border-b pb-1">Date of Birth</h5>
                                            <p>{rxOrder.patientDob ? new Date(rxOrder.patientDob).toLocaleDateString() : 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold border-b pb-1">Country</h5>
                                            <p>{rxOrder.patientCountry || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold border-b pb-1">City</h5>
                                            <p>{rxOrder.patientCity || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-lg">Doctor Information</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <h5 className="font-semibold border-b pb-1">Doctor Specialty</h5>
                                            <p>{rxOrder.doctorSpecialty || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold border-b pb-1">Prescribing Doctor</h5>
                                            <p>{rxOrder.prescribingDr || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold border-b pb-1">Prescribed Date</h5>
                                            <p>{rxOrder.prescribedDate ? new Date(rxOrder.prescribedDate).toLocaleDateString() : 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold border-b pb-1">Valid Till</h5>
                                            <p>{rxOrder.validTill ? new Date(rxOrder.validTill).toLocaleDateString() : 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold border-b pb-1">City</h5>
                                            <p>{rxOrder.city || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold border-b pb-1">RX Status</h5>
                                            <p>{rxOrder.rxStatus || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default PatientView;

