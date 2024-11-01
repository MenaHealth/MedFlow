// components/auth/adminDashboard/sections/DeniedDoctorsAndTriage.tsx

'use client';

import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import useToast from '@/components/hooks/useToast';
import InfiniteScroll from '@/components/ui/infiniteScroll';
import { Loader2 } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: 'Doctor' | 'Triage';
    countries?: string[];
    denialDate?: string;
}

interface DeniedDoctorsAndTriageProps {
    data: User[];
    hasMore: boolean;
    loading: boolean;
    next: () => void;
}

export default function DeniedDoctorsAndTriage({
                                                   data = [],
                                                   hasMore = false,
                                                   loading = false,
                                                   next = () => {},
                                               }: DeniedDoctorsAndTriageProps) {
    const [isCountryVisible, setIsCountryVisible] = useState(false);
    const { data: session } = useSession();
    const { setToast } = useToast();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);

    const handleReApprove = async () => {
        if (!session?.user?.isAdmin) {
            setToast?.({
                title: 'Error',
                description: 'You do not have permission to perform this action.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const response = await fetch('/api/admin/POST/re-approve-users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.user.token}`,
                },
                body: JSON.stringify({ userIds: selectedUsers }),
            });

            if (!response.ok) {
                throw new Error('Failed to re-approve users');
            }

            setToast?.({
                title: 'Success',
                description: 'Users re-approved successfully.',
            });

            setSelectedUsers([]);
            setIsSelecting(false);
        } catch (error) {
            console.error('Error re-approving users:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to re-approve users.',
                variant: 'destructive',
            });
        }
    };

    const handleCheckboxChange = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <Button
                    onClick={() => setIsSelecting(!isSelecting)}
                    variant="outline"
                    disabled={data.length === 0}
                >
                    {isSelecting ? 'Cancel Selection' : 'Select Users'}
                </Button>

                <Button
                    onClick={() => setIsCountryVisible(!isCountryVisible)}
                    variant="outline"
                >
                    {isCountryVisible ? 'Hide Country' : 'Show Country'}
                </Button>

                {isSelecting && (
                    <Button
                        onClick={handleReApprove}
                        variant="default"
                        disabled={selectedUsers.length === 0}
                    >
                        Re-approve Users
                    </Button>
                )}
            </div>

            <ScrollArea className="w-full rounded-md border">
                <div className="w-max min-w-full">
                    <InfiniteScroll dataLength={data.length} next={next} hasMore={hasMore} isLoading={loading}>
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-muted">
                                {isSelecting && <th className="p-2 text-left font-medium">Select</th>}
                                <th className="p-2 text-left font-medium">Name</th>
                                <th className="p-2 text-left font-medium">Email</th>
                                <th className="p-2 text-left font-medium">User Type</th>
                                {isCountryVisible && (
                                    <th className="p-2 text-left font-medium">Country</th>
                                )}
                                <th className="p-2 text-left font-medium">Denial Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.length > 0 ? (
                                [...data]
                                    .sort((a, b) => {
                                        const dateA = new Date(a.denialDate || 0).getTime();
                                        const dateB = new Date(b.denialDate || 0).getTime();
                                        return dateB - dateA;
                                    })
                                    .map((user) => (
                                        <tr key={user._id} className="border-t">
                                            {isSelecting && (
                                                <td className="p-2">
                                                    <Checkbox
                                                        checked={selectedUsers.includes(user._id)}
                                                        onCheckedChange={() => handleCheckboxChange(user._id)}
                                                    />
                                                </td>
                                            )}
                                            <td className="p-2">
                                                {user.firstName} {user.lastName}
                                            </td>
                                            <td className="p-2">{user.email}</td>
                                            <td className="p-2">{user.accountType}</td>
                                            {isCountryVisible && (
                                                <td className="p-2">
                                                    {user.countries?.join(', ') || 'N/A'}
                                                </td>
                                            )}
                                            <td className="p-2">
                                                {user.denialDate ? new Date(user.denialDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-2 text-center">
                                        No denied users.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </InfiniteScroll>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {loading && (
                <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin"/>
                </div>
            )}
            {!hasMore && data.length > 0 && (
                <p className="text-center py-4">No more denied users to load.</p>
            )}
        </div>
    );
}