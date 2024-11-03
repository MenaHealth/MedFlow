// components/auth/adminDashboard/sections/ExistingDoctorsAndTriageView.tsx
'use client';

import React from 'react';
import { Minus, Loader2 } from 'lucide-react';
import InfiniteScroll from '@/components/ui/infiniteScroll';
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { Button } from "@/components/ui/button";
import { useExistingDoctorsAndTriageViewModel, User } from './ExistingDoctorsAndTriageViewModel';

export default function ExistingDoctorsAndTriageView() {
    const {
        existingUsers,
        loadingExistingUsers,
        hasMoreExistingUsers,
        nextExistingUsers,
        isCountryVisible,
        toggleCountryVisibility,
        handleMoveToDenied,
    } = useExistingDoctorsAndTriageViewModel();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-end mb-4">
                <Button
                    onClick={toggleCountryVisibility}
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
                        hasMore={!!hasMoreExistingUsers}
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