// components/auth/adminDashboard/sections/NewSignupsView.tsx
'use client';

import React from 'react';
import { UserRoundCheck, UserRoundMinus, Loader2 } from 'lucide-react';
import InfiniteScroll from '@/components/ui/infiniteScroll';
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNewSignupsViewModel, User } from './NewSignupsViewModel';

export default function NewSignupsView() {
    const {
        newSignups,
        loadingNewSignups,
        hasMoreNewSignups,
        nextNewSignups,
        selectedUsers,
        isCountryVisible,
        handleBulkAction,
        handleCheckboxChange,
        handleSelectAll,
        toggleCountryVisibility,
    } = useNewSignupsViewModel();

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
                    onClick={toggleCountryVisibility}
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
                        hasMore={!!hasMoreNewSignups}
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