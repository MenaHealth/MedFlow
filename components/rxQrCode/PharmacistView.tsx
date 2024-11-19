'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Prescription {
    diagnosis: string;
    medication: string;
    dosage: string;
    frequency: string;
}

interface RxOrder {
    _id: string;
    doctorSpecialty: string;
    prescribingDr: string;
    drEmail: string;
    prescribedDate: string;
    validTill: string;
    city: string;
    validated: boolean;
    prescriptions: Prescription[];
    rxStatus: 'Not Reviewed' | 'Prescription Completed' | 'Partial Rx Filled' | 'Declined Rx / Unable to Complete';
    partialRxNotes?: string;
    RxProvider?: string;
}

interface PharmacistViewProps {
    uuid: string;
}

const PharmacistView: React.FC<PharmacistViewProps> = ({ uuid }) => {
    const [rxOrder, setRxOrder] = useState<RxOrder | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchRxOrder = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/rx-order-qr-code/${uuid}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch prescription details.');
                }
                const data = await response.json();
                setRxOrder(data);
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchRxOrder();
    }, [uuid]);

    const handleStatusChange = async (status: RxOrder['rxStatus']) => {
        if (!rxOrder) return;

        try {
            const response = await fetch(`/api/rx-order-qr-code/${uuid}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rxStatus: status,
                    validated: status === 'Prescription Completed',
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update RX order');
            }

            setRxOrder({ ...rxOrder, rxStatus: status, validated: status === 'Prescription Completed' });
            setSuccessMessage('RX order status updated successfully');
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        }
    };

    const handlePartialRxNotesChange = (notes: string) => {
        if (rxOrder) {
            setRxOrder({ ...rxOrder, partialRxNotes: notes });
        }
    };

    const handleRxProviderChange = (provider: string) => {
        if (rxOrder) {
            setRxOrder({ ...rxOrder, RxProvider: provider });
        }
    };

    const handleSave = async () => {
        if (!rxOrder) return;

        try {
            const response = await fetch(`/api/rx-order-qr-code/${uuid}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rxStatus: rxOrder.rxStatus,
                    validated: rxOrder.validated,
                    partialRxNotes: rxOrder.partialRxNotes,
                    RxProvider: rxOrder.RxProvider,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save RX order');
            }

            setSuccessMessage('RX order updated successfully');
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        }
    };

    if (loading) return <div>Loading prescription...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!rxOrder) return <div>No prescription found</div>;

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Pharmacist RX View</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <h3> Update prescription status for patient </h3>
                    <div>
                        <Label htmlFor="prescribingDr">Prescribing Doctor</Label>
                        <Input id="prescribingDr" value={rxOrder.prescribingDr} readOnly />
                    </div>
                    <div>
                        <Label htmlFor="prescribedDate">Prescribed Date</Label>
                        <Input id="prescribedDate" value={new Date(rxOrder.prescribedDate).toLocaleDateString()} readOnly />
                    </div>
                </div>
                <div>
                    <Label htmlFor="rxStatus">RX Status</Label>
                    <Select onValueChange={handleStatusChange} value={rxOrder.rxStatus}>
                        <SelectTrigger id="rxStatus">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Not Reviewed">Not Reviewed</SelectItem>
                            <SelectItem value="Prescription Completed">Prescription Completed</SelectItem>
                            <SelectItem value="Partial Rx Filled">Partial Rx Filled</SelectItem>
                            <SelectItem value="Declined Rx / Unable to Complete">Declined Rx / Unable to Complete</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {rxOrder.rxStatus === 'Partial Rx Filled' && (
                    <div>
                        <Label htmlFor="partialRxNotes">Partial RX Notes</Label>
                        <Textarea
                            id="partialRxNotes"
                            placeholder="Enter notes for partial RX fill"
                            value={rxOrder.partialRxNotes || ''}
                            onChange={(e) => handlePartialRxNotesChange(e.target.value)}
                        />
                    </div>
                )}
                <div>
                    <Label htmlFor="rxProvider">RX Provider (Pharmacist Name)</Label>
                    <Input
                        id="rxProvider"
                        placeholder="Enter pharmacist name"
                        value={rxOrder.RxProvider || ''}
                        onChange={(e) => handleRxProviderChange(e.target.value)}
                    />
                </div>
                <div>
                    <Label>Prescriptions</Label>
                    {rxOrder.prescriptions.map((prescription, index) => (
                        <Card key={index} className="mt-2">
                            <CardContent className="pt-4">
                                <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                                <p><strong>Medication:</strong> {prescription.medication}</p>
                                <p><strong>Dosage:</strong> {prescription.dosage}</p>
                                <p><strong>Frequency:</strong> {prescription.frequency}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
            {successMessage && (
                <div className="text-green-500 text-center mt-4">{successMessage}</div>
            )}
        </Card>
    );
};

export default PharmacistView;