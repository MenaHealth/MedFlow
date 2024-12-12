// components/rxQrCode/PharmacyView.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableColumn } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from 'lucide-react'

// Import the IRxOrder interface from your patient model
import { IRxOrder } from '@/models/patient';
import {TextFormField} from "@/components/ui/TextFormField";

const PharmacyView = ({ uuid }: { uuid: string }) => {
    const [rxOrder, setRxOrder] = useState<IRxOrder | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [patientId, setPatientId] = useState<string | null>(null);

    useEffect(() => {
        const fetchRxOrder = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/rx-order-qr-code/pharmacy/${uuid}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch RX order');
                }
                const data = await response.json();
                setRxOrder(data.rxOrder);
                setPatientId(data.patientId); // Store patientId from response
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchRxOrder();
    }, [uuid]);

    const handleSave = async () => {
        if (!rxOrder?.RxDispenserName || !rxOrder.RxDispenserContact) {
            setError('RX dispenser name and contact information are required.');
            return;
        }

        if (!patientId) {
            setError('Patient ID is missing. Cannot update RX order.');
            return;
        }

        try {
            const response = await fetch(`/api/patient/${patientId}/medications/rx-order`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uuid, updatedRxOrder: rxOrder }),
            });

            if (!response.ok) {
                throw new Error('Failed to save RX order');
            }

            const data = await response.json();
            setRxOrder(data.rxOrder);
            setSuccessMessage('RX order updated successfully');
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        }
    };

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
            <CardHeader>
                <CardTitle>Pharmacist RX View</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Diagnosis and Prescription Info */}
                <div className="space-y-4">
                    {rxOrder.prescriptions.length > 0 && (
                        <div>
                            <Label>Diagnosis</Label>
                            <div className="border-gray-300 p-2 rounded-md border-t-2 border-r-2">
                                <p>{rxOrder.prescriptions[0].diagnosis}</p>
                            </div>
                        </div>
                    )}
                    <Table
                        data={rxOrder.prescriptions.map(({ diagnosis, ...rest }) => rest)}
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

                {/* Administrative Info inside Accordion */}
                <Accordion type="single" collapsible className="w-full bg-darkBlue text-white rounded-2xl pl-4 pr-4">
                    <AccordionItem value="admin-details">
                        <AccordionTrigger className=" justify-center text-center">Administrative Details</AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Prescribing Doctor</Label>
                                    <div className="border-gray-300 p-2 rounded-md border-t-2 border-r-2">
                                        <p>{rxOrder.prescribingDr}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label>Doctor Specialty</Label>
                                    <div className="border-gray-300 p-2 rounded-md border-t-2 border-r-2">
                                        <p>{rxOrder.doctorSpecialty}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label>Prescribed Date</Label>
                                    <div className="border-gray-300 p-2 rounded-md border-t-2 border-r-2">
                                        <p>{new Date(rxOrder.prescribedDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label>Valid Till</Label>
                                    <div className="border-gray-300 p-2 rounded-md border-t-2 border-r-2">
                                        <p>{new Date(rxOrder.validTill).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label>City</Label>
                                    <div className="border-gray-300 p-2 rounded-md border-t-2 border-r-2">
                                        <p>{rxOrder.city}</p>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Status and Save Section */}
                {/* Status and Save Section */}
                <div className="space-y-4">
                    <div>
                        <Label>RX Status</Label>
                        <Select
                            value={rxOrder?.rxStatus || ''}
                            onValueChange={(value) =>
                                setRxOrder({ ...rxOrder, rxStatus: value as IRxOrder['rxStatus'] })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select RX Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="not reviewed">Not Reviewed</SelectItem>
                                <SelectItem value="partially filled">Partially Filled</SelectItem>
                                <SelectItem value="declined">Declined</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {rxOrder?.rxStatus === 'partially filled' && (
                        <TextFormField
                            fieldName="partialRxNotes"
                            fieldLabel="Partial RX Notes"
                            multiline
                            rows={3}
                            value={rxOrder?.partialRxNotes || ''}
                            onChange={(e) => setRxOrder({ ...rxOrder, partialRxNotes: e.target.value })}
                        />
                    )}
                    <div>
                        <TextFormField
                            fieldName="RxDispenserName"
                            fieldLabel="Name of RX Dispenser"
                            value={rxOrder?.RxDispenserName || ''}
                            onChange={(e) =>
                                setRxOrder({ ...rxOrder, RxDispenserName: e.target.value })
                            }
                            error={
                                !rxOrder?.RxDispenserName && !rxOrder?.submitted
                                    ? 'RX Dispenser Name is required.'
                                    : undefined
                            }
                        />
                    </div>
                    <div>
                        <TextFormField
                            fieldName="RxDispenserContact"
                            fieldLabel="RX Dispenser Contact Info"
                            value={rxOrder?.RxDispenserContact || ''}
                            onChange={(e) =>
                                setRxOrder({ ...rxOrder, RxDispenserContact: e.target.value })
                            }
                            error={
                                !rxOrder?.RxDispenserContact && !rxOrder?.submitted
                                    ? 'RX Dispenser Contact Info is required.'
                                    : undefined
                            }
                        />
                    </div>
                    <Button
                        onClick={handleSave}
                        className="w-full"
                        variant="submit"
                        disabled={
                            rxOrder?.submitted ||
                            !rxOrder?.RxDispenserName ||
                            !rxOrder?.RxDispenserContact
                        }
                        title={
                            rxOrder?.submitted
                                ? 'RX order has been submitted and cannot be edited.'
                                : 'Complete all required fields to save.'
                        }
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                    {successMessage && (
                        <div className="text-white bg-orange-500 text-center">
                            {successMessage}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default PharmacyView;