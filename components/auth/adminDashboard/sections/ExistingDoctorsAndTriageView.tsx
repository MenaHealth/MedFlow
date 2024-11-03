// components/auth/adminDashboard/sections/ExistingDoctorsAndTriage.tsx
'use client';

import React, { useState } from 'react';
import { Minus, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import useToast from '@/components/hooks/useToast';
import { useAdminDashboard } from '../AdminDashboardContext';
import InfiniteScroll from '@/components/ui/infiniteScroll';
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { Button } from "@/components/ui/button";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: 'Doctor' | 'Triage';
    countries?: string[];
    approvalDate?: string;
}

export default function ExistingDoctorsAndTriage() {
    const { data: session } = useSession();
    const { setToast } = useToast();
    const {
        existingUsers,
        loadingExistingUsers,
        hasMoreExistingUsers,
        nextExistingUsers,
    } = useAdminDashboard();

    const [isCountryVisible, setIsCountryVisible] = useState(true);

    const handleMoveToDenied = async (userId: string) => {
        if (!session?.user?.isAdmin) {
            setToast?.({
                title: 'Error',
                description: 'You do not have permission to perform this action.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const response = await fetch('/api/admin/POST/deny-existing-users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.user.token}`,
                },
                body: JSON.stringify({ userIds: [userId] }),
            });

            if (!response.ok) throw new Error('Failed to move user to denied status');

            setToast?.({
                title: 'Success',
                description: 'User moved to denied status successfully.',
                variant: 'default',
            });

            // Optionally, refresh data or remove the user from the UI after success
            // This would depend on how you want to handle the UI update
        } catch (error) {
            console.error('Error moving user to denied status:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to move user to denied status.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-end mb-4">
                <Button
                    onClick={() => setIsCountryVisible(!isCountryVisible)}
                    variant="outline"
                >
                    {isCountryVisible ? 'Hide Country' : 'Show Country'}
                </Button>
            </div>

            <ScrollArea className="w-full rounded-md border">
                <div className="w-max min-w-full">
                    <InfiniteScroll
                        dataLength={existingUsers.length}
                        next={nextExistingUsers}
                        hasMore={hasMoreExistingUsers}
                        isLoading={loadingExistingUsers}
                    >
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-muted">
                                <th className="p-2 text-left font-medium">Name</th>
                                <th className="p-2 text-left font-medium">Email</th>
                                <th className="p-2 text-left font-medium">User Type</th>
                                {isCountryVisible && (
                                    <th className="p-2 text-left font-medium">Country</th>
                                )}
                                <th className="p-2 text-left font-medium">Approval Date</th>
                                <th className="p-2 text-left font-medium">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {existingUsers.map((user: User, index: number) => (
                                <tr key={user._id} className="border-t">
                                    <td className="p-2">{user.firstName} {user.lastName}</td>
                                    <td className="p-2">{user.email}</td>
                                    <td className="p-2">{user.accountType}</td>
                                    {isCountryVisible && (
                                        <td className="p-2">{user.countries?.join(', ') || 'N/A'}</td>
                                    )}
                                    <td className="p-2">
                                        {user.approvalDate ? new Date(user.approvalDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="p-2">
                                        {index !== 0 ? (
                                            <Button
                                                onClick={() => handleMoveToDenied(user._id)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                        ) : (
                                            <span className="text-orange-50 bg-orange-500 px-2 py-1 rounded"> Root</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </InfiniteScroll>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {loadingExistingUsers && (
                <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin"/>
                </div>
            )}
            {!hasMoreExistingUsers && existingUsers.length > 0 && (
                <p className="text-center py-4">No more existing users to load.</p>
            )}
            {existingUsers.length === 0 && !loadingExistingUsers && (
                <p className="text-center py-4">No existing users found.</p>
            )}
        </div>
    );
}