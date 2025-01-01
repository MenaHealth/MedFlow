// components/auth/adminDashboard/sections/NewSignupsView.tsx
'use client';

import React from 'react';
import { UserRoundCheck, UserRoundMinus, Loader2 } from 'lucide-react';
import InfiniteScroll from '@/components/ui/infiniteScroll';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table } from "@/components/ui/table";
import { useNewSignupsViewModel, User } from './NewSignupsViewModel';

export default function NewSignupsView() {
    const {
        newSignups,
        loadingNewSignups,
        hasMoreNewSignups,
        nextNewSignups,
        selectedUsers,
        handleBulkAction,
        handleCheckboxChange,
        isCountryVisible,
        isDoctorSpecialtyVisible,
        toggleCountryVisibility,
        toggleDoctorSpecialtyVisibility,
    } = useNewSignupsViewModel();

    const columns = [
        {
            key: 'select',
            header: '',
            render: (value: any, user: User) => (
                <Checkbox
                    checked={selectedUsers.includes(user._id)}
                    onCheckedChange={() => handleCheckboxChange(user._id)}
                />
            ),
            width: '40px'
        },
        {
            key: 'name',
            header: 'Name',
            render: (value: any, user: User) => `${user.firstName} ${user.lastName}`
        },
        { key: 'email', header: 'Email' },
        { key: 'accountType', header: 'User Type' },
        {
            key: 'doctorSpecialty',
            header: 'Doctor Specialty',
            hidden: !isDoctorSpecialtyVisible
        },
        {
            key: 'countries',
            header: 'Country',
            hidden: !isCountryVisible
        }
    ];

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
            </div>

            <ScrollArea className="w-full rounded-md">
                <div className="w-max min-w-full">
                    <div className="flex justify-end mb-4 space-x-2">
                        <Button
                            onClick={toggleCountryVisibility}
                            variant="outline"
                        >
                            {isCountryVisible ? 'Hide Country' : 'Show Country'}
                        </Button>
                        <Button
                            onClick={toggleDoctorSpecialtyVisibility}
                            variant="outline"
                        >
                            {isDoctorSpecialtyVisible ? 'Hide Doctor Specialty' : 'Show Doctor Specialty'}
                        </Button>
                    </div>
                    <InfiniteScroll
                        dataLength={newSignups.length}
                        next={nextNewSignups}
                        hasMore={!!hasMoreNewSignups}
                        isLoading={loadingNewSignups}
                    >
                        <Table
                            data={newSignups}
                            columns={columns}
                            backgroundColor="bg-white"
                            textColor="text-orange-800"
                            borderColor="border-orange-800"
                            headerBackgroundColor="bg-orange-100"
                            headerTextColor="text-text-orange-800"
                            hoverBackgroundColor="hover:bg-orange-300"
                            hoverTextColor="hover:text-gray-900"
                        />
                    </InfiniteScroll>
                </div>
                <ScrollBar orientation="horizontal"/>
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