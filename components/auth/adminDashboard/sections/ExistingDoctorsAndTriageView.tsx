'use client';

import React, { useState } from 'react';
import { Minus, Loader2, Edit } from 'lucide-react';
import InfiniteScroll from '@/components/ui/infiniteScroll';
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { Button } from "@/components/ui/button";
import { Table, TableColumn } from "@/components/ui/table";
import { useExistingDoctorsAndTriageViewModel, User } from './ExistingDoctorsAndTriageViewModel';
import { EditUserModal } from './EditUserModal';

export default function ExistingDoctorsAndTriageView() {
    const {
        existingUsers,
        loadingExistingUsers,
        hasMoreExistingUsers,
        nextExistingUsers,
        handleMoveToDenied,
        isCountryVisible,
        isDoctorSpecialtyVisible,
        toggleCountryVisibility,
        toggleDoctorSpecialtyVisibility,
        handleEditUser,
    } = useExistingDoctorsAndTriageViewModel();

    const [editingUser, setEditingUser] = useState<User | null>(null);

    const columns: TableColumn<User>[] = [
        {
            key: 'name',
            header: 'Name',
            render: (value: any, user: User) => `${user.firstName} ${user.lastName}`
        },
        { key: 'email', header: 'Email' },
        { key: 'accountType', header: 'User Type' },
        {
            key: 'actions',
            header: 'Actions',
            render: (value: any, user: User) => (
                <div className="flex space-x-2">
                    <Button
                        onClick={() => handleMoveToDenied(user._id)}
                        variant="outline"
                        size="sm"
                    >
                        <Minus className="w-4 h-4" />
                    </Button>
                    <Button
                        onClick={() => setEditingUser(user)}
                        variant="outline"
                        size="sm"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
            )
        },
        {
            key: 'approvalDate',
            header: 'Approval Date',
            render: (value: string | undefined) => value ? new Date(value).toLocaleDateString() : 'N/A'
        },
        {
            key: 'doctorSpecialty',
            header: 'Doctor Specialty',
            hidden: !isDoctorSpecialtyVisible,
            render: (value: string | undefined) => value || 'N/A'
        },
        {
            key: 'countries',
            header: 'Country',
            hidden: !isCountryVisible,
            render: (value: string[] | undefined) => value?.join(', ') || 'N/A'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-end mb-4 space-x-2">
                <Button
                    onClick={toggleCountryVisibility}
                    variant="ghost"
                >
                    {isCountryVisible ? 'Hide Country' : 'Show Country'}
                </Button>
                <Button
                    onClick={toggleDoctorSpecialtyVisibility}
                    variant="ghost"
                >
                    {isDoctorSpecialtyVisible ? 'Hide Doctor Specialty' : 'Show Doctor Specialty'}
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
                        <Table
                            data={existingUsers}
                            columns={columns}
                            backgroundColor="bg-orange-100"
                            textColor="text-orange-950"
                            borderColor="border-orange-500"
                            headerBackgroundColor="bg-orange-200"
                            headerTextColor="text-orange-950"
                            hoverBackgroundColor="hover:bg-white"
                            hoverTextColor="hover:text-darkBlue"
                        />
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

            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleEditUser}
                />
            )}
        </div>
    );
}