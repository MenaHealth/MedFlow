// components/auth/adminDashboard/sections/DeniedDoctorsAndTriage.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import useToast from '@/components/hooks/useToast';
import InfiniteScroll from '@/components/ui/infiniteScroll';
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableColumn } from "@/components/ui/table";
import { useAdminDashboard } from './../AdminDashboardContext';
import { User } from './../AdminDashboardContext';

export default function DeniedDoctorsAndTriage() {
    const [isCountryVisible, setIsCountryVisible] = useState(false);
    const { data: session } = useSession();
    const { setToast } = useToast();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);

    const {
        deniedUsers,
        loadingDeniedUsers,
        hasMoreDeniedUsers,
        nextDeniedUsers,
        isDeniedUsersOpen
    } = useAdminDashboard();

    useEffect(() => {
        if (isDeniedUsersOpen && deniedUsers.length === 0 && !loadingDeniedUsers) {
            nextDeniedUsers();
        }
    }, [isDeniedUsersOpen, deniedUsers.length, loadingDeniedUsers, nextDeniedUsers]);

    const columns: TableColumn<User>[] = [
        { key: 'firstName', header: 'First Name', width: 'w-1/4' },
        { key: 'lastName', header: 'Last Name', width: 'w-1/4' },
        { key: 'email', header: 'Email', width: 'w-1/4' },
        { key: 'accountType', header: 'User Type', width: 'w-1/4' },
        {
            key: 'countries',
            header: 'Country',
            width: 'w-1/4',
            render: (value: string[]) => (value ? value.join(', ') : 'N/A'),
            hidden: !isCountryVisible,
        },
        {
            key: 'denialDate',
            header: 'Denial Date',
            width: 'w-1/4',
            render: (value: string) => (value ? new Date(value).toLocaleDateString() : 'N/A')
        },
    ];

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
                    disabled={deniedUsers.length === 0}
                >
                    {isSelecting ? 'Cancel Selection' : 'Select Users'}
                </Button>

                <Button
                    onClick={() => setIsCountryVisible(!isCountryVisible)}
                    variant="outline"
                >
                    {isCountryVisible ? 'Hide Country' : 'Show Country'}
                </Button>
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
                    backgroundColor="bg-white"
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