// components/auth/adminDashboard/sections/NewSignups.tsx
'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import useToast from '@/components/hooks/useToast';
import { UserRoundCheck, UserRoundMinus, Loader2 } from 'lucide-react';
import { useAdminDashboard } from '../AdminDashboardContext';
import InfiniteScroll from '@/components/ui/infiniteScroll';
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
}

export default function NewSignups() {
    const { data: session } = useSession();
    const {
        newSignups,
        loadingNewSignups,
        hasMoreNewSignups,
        nextNewSignups,
        toggleSection,
    } = useAdminDashboard();

    const { setToast } = useToast();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isCountryVisible, setIsCountryVisible] = useState(true);

    async function handleBulkAction(actionType: 'approve-users' | 'deny-users') {
        if (!session?.user?.token || selectedUsers.length === 0) {
            setToast?.({
                title: 'Error',
                description: 'No users selected or no authentication token found.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const url = `/api/admin/POST/${actionType}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.user.token}`,
                },
                body: JSON.stringify({ userIds: selectedUsers }),
            });

            if (!response.ok) {
                throw new Error(`Failed to ${actionType} users`);
            }

            setToast?.({
                title: 'Success',
                description: `Selected users ${actionType === 'approve-users' ? 'approved' : 'denied'} successfully.`,
                variant: 'default',
            });

            setSelectedUsers([]);
            toggleSection('newSignups');
        } catch (error) {
            console.error(`Error in bulk ${actionType}:`, error);
            const errorMessage = error instanceof Error ? error.message : `An error occurred while trying to ${actionType} the users.`;
            setToast?.({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    }

    const handleCheckboxChange = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        setSelectedUsers((prev) => (
            prev.length === newSignups.length
                ? []
                : newSignups.map((user: User) => user._id)
        ));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <Button
                    onClick={() => handleBulkAction('approve-users')}
                    variant="outline"
                    disabled={selectedUsers.length === 0}
                >
                    <UserRoundCheck className="w-5 h-5 mr-2" />
                    Approve Selected
                </Button>

                <Button
                    onClick={() => handleBulkAction('deny-users')}
                    variant="outline"
                    disabled={selectedUsers.length === 0}
                >
                    <UserRoundMinus className="w-5 h-5 mr-2" />
                    Deny Selected
                </Button>

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
                        dataLength={newSignups.length}
                        next={nextNewSignups}
                        hasMore={hasMoreNewSignups}
                        isLoading={loadingNewSignups}
                    >
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-muted">
                                <th className="p-2 text-left font-medium">
                                    <Checkbox
                                        checked={selectedUsers.length === newSignups.length && newSignups.length > 0}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </th>
                                <th className="p-2 text-left font-medium">Name</th>
                                <th className="p-2 text-left font-medium">Email</th>
                                <th className="p-2 text-left font-medium">User Type</th>
                                {isCountryVisible && (
                                    <th className="p-2 text-left font-medium">Country</th>
                                )}
                            </tr>
                            </thead>
                            <tbody>
                            {newSignups.length > 0 ? (
                                newSignups.map((user: User) => (
                                    <tr key={user._id} className="border-t">
                                        <td className="p-2">
                                            <Checkbox
                                                checked={selectedUsers.includes(user._id)}
                                                onCheckedChange={() => handleCheckboxChange(user._id)}
                                            />
                                        </td>
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
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={isCountryVisible ? 5 : 4} className="p-2 text-center">
                                        No new signups.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </InfiniteScroll>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {loadingNewSignups && (
                <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin"/>
                </div>
            )}
            {!hasMoreNewSignups && newSignups.length > 0 && (
                <p className="text-center py-4">No more new signups to load.</p>
            )}
        </div>
    );
}