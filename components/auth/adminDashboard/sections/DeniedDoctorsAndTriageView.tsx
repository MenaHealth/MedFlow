// components/auth/adminDashboard/sections/DeniedDoctorsAndTriageView.tsx

'use client';

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, CheckSquare, UserRoundPlus } from "lucide-react";
import InfiniteScroll from '@/components/ui/infiniteScroll';
import { Table, TableColumn } from "@/components/ui/table";
import { useDeniedDoctorsAndTriageViewModel } from './DeniedDoctorsAndTriageViewModel';
import type { IUser as User } from '@/models/user';

export default function DeniedDoctorsAndTriageView() {
    const {
        deniedUsers,
        loadingDeniedUsers,
        hasMoreDeniedUsers,
        nextDeniedUsers,
        isSelecting,
        toggleSelecting,
        selectedUsers,
        handleCheckboxChange,
        handleReApproveUsers, // For bulk re-approve action
    } = useDeniedDoctorsAndTriageViewModel();

    useEffect(() => {
        console.log("Denied Users Data:", deniedUsers);
    }, [deniedUsers]);

    const toggleSelectUser = (userId: string) => {
        handleCheckboxChange(userId);
    };

    const columns: TableColumn<User>[] = [
        {
            key: 'select',
            header: '',
            render: (_: any, user: User) => (
                <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => toggleSelectUser(user._id)}
                />
            ),
        },
        { key: 'firstName', header: 'First Name', width: 'w-1/4' },
        { key: 'lastName', header: 'Last Name', width: 'w-1/4' },
        { key: 'email', header: 'Email', width: 'w-1/4' },
        { key: 'accountType', header: 'User Type', width: 'w-1/4' },
        {
            key: 'denialDate',
            header: 'Denial Date',
            width: 'w-1/4',
            render: (value: string) => (value ? new Date(value).toLocaleDateString() : 'N/A')
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (_: any, user: User) => (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleReApproveUsers([user._id])}
                >
                    <UserRoundPlus className="w-5 h-5" />
                </Button>
            ),
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <Button
                    onClick={toggleSelecting}
                    variant="outline"
                    disabled={deniedUsers.length === 0}
                >
                    {isSelecting ? 'Cancel Selection' : 'Select Users'}
                </Button>

                {selectedUsers.length > 0 && (
                    <Button
                        onClick={() => handleReApproveUsers(selectedUsers)}
                        variant="success"
                    >
                        <CheckSquare className="w-5 h-5 mr-2" /> Re-Approve Selected
                    </Button>
                )}
            </div>

            <InfiniteScroll
                dataLength={deniedUsers.length}
                next={nextDeniedUsers}
                hasMore={hasMoreDeniedUsers}
                isLoading={loadingDeniedUsers}
            >
                <Table
                    data={deniedUsers}
                    columns={columns}
                    onRowClick={(item) => console.log('Clicked user:', item)}
                    backgroundColor="gray-100"
                    textColor="text-black"
                    borderColor="border-gray-200"
                    headerBackgroundColor="bg-gray-100"
                    headerTextColor="text-black"
                    hoverBackgroundColor="hover:bg-gray-50"
                    hoverTextColor="hover:text-black"
                />
            </InfiniteScroll>

            {loadingDeniedUsers && (
                <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
            )}

            {!hasMoreDeniedUsers && deniedUsers.length > 0 && (
                <p className="text-center py-4">No more denied users to load.</p>
            )}

            {deniedUsers.length === 0 && !loadingDeniedUsers && (
                <p className="text-center py-4">No Denied Users found.</p>
            )}
        </div>
    );
}