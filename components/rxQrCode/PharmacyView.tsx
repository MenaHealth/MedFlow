'use client';

import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const PharmacyView = ({ uuid }: { uuid: string }) => {
    const [rxOrder, setRxOrder] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
                setRxOrder(data);
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchRxOrder();
    }, [uuid]);

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/rx-order-qr-code/pharmacy/${uuid}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rxOrder),
            });

            if (!response.ok) {
                throw new Error('Failed to save RX order');
            }

            setSuccessMessage('RX order updated successfully');
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        }
    };

    if (loading) return <div>Loading RX order...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!rxOrder) return <div>No RX order found</div>;

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Pharmacist RX View</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label>Prescribing Doctor</Label>
                    <Input value={rxOrder.prescribingDr} readOnly />
                </div>
                <div>
                    <Label>RX Status</Label>
                    <Select
                        value={rxOrder.rxStatus}
                        onValueChange={(value) => setRxOrder({ ...rxOrder, rxStatus: value })}
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
                {rxOrder.rxStatus === 'partially filled' && (
                    <div>
                        <Label>Partial RX Notes</Label>
                        <Textarea
                            value={rxOrder.partialRxNotes || ''}
                            onChange={(e) =>
                                setRxOrder({ ...rxOrder, partialRxNotes: e.target.value })
                            }
                        />
                    </div>
                )}
                <div>
                    <Label>RX Provider (your name)</Label>
                    <Input
                        value={rxOrder.RxProvider || ''}
                        onChange={(e) =>
                            setRxOrder({ ...rxOrder, RxProvider: e.target.value })
                        }
                    />
                </div>
                <Button onClick={handleSave}>Save Changes</Button>
                {successMessage && <div className="text-green-500">{successMessage}</div>}
            </CardContent>
        </Card>
    );
};

export default PharmacyView;