// components/auth/adminDashboard/sections/DeniedDoctorsAndTriageView.tsx

'use client';

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import InfiniteScroll from '@/components/ui/infiniteScroll';
import { Table, TableColumn } from "@/components/ui/table";
import { useDeniedDoctorsAndTriageViewModel } from './DeniedDoctorsAndTriageViewModel';

export default function DeniedDoctorsAndTriageView() {
    const {
        deniedUsers,
        loadingDeniedUsers,
        hasMoreDeniedUsers,
        nextDeniedUsers,
        isCountryVisible,
        toggleCountryVisibility,
        isSelecting,
        toggleSelecting,
        selectedUsers,
        handleCheckboxChange,
    } = useDeniedDoctorsAndTriageViewModel();

    useEffect(() => {
        console.log("Denied Users Data:", deniedUsers);
        console.log("Loading Denied Users:", loadingDeniedUsers);
    }, [deniedUsers, loadingDeniedUsers]);

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

                <Button
                    onClick={toggleCountryVisibility}
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