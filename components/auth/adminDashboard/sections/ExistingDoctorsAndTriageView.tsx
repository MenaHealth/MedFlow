// components/auth/adminDashboard/sections/ExistingDoctorsAndTriageView.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Minus, Loader2, Edit, Search } from 'lucide-react';
import InfiniteScroll from '@/components/ui/infiniteScroll';
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { Button } from "@/components/ui/button";
import { Table, TableColumn } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useExistingDoctorsAndTriageViewModel, User } from './ExistingDoctorsAndTriageViewModel';
import { EditUserModal } from './EditUserModalView';

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
        searchTerm,
        setSearchTerm,
    } = useExistingDoctorsAndTriageViewModel();

    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Sort users by approval date in descending order
    const sortedUsers = useMemo(() => {
        return [...existingUsers].sort((a, b) => {
            const dateA = a.approvalDate ? new Date(a.approvalDate).getTime() : 0;
            const dateB = b.approvalDate ? new Date(b.approvalDate).getTime() : 0;
            return dateB - dateA;
        });
    }, [existingUsers]);

    const columns: TableColumn<User>[] = [
        {
            key: 'name',
            header: 'Name',
            render: (value: any, user: User) => `${user.firstName} ${user.lastName}`
        },
        {
            key: 'email',
            header: 'Email',
            render: (value: string) => (
                <div className="flex items-center">
                    <span>{value}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => setSearchTerm(value)}
                    >
                        <Search className="w-4 h-4" />
                    </Button>
                </div>
            )
        },
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
            <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Search by email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64 bg-white text-darkBlue"
                    />
                    <Button
                        onClick={() => setSearchTerm('')}
                        variant="outline"
                        size="sm"
                    >
                        Clear
                    </Button>
                </div>
                <div className="flex space-x-2">
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
            </div>

            <ScrollArea className="w-full rounded-md border border-orange-300 ">
                <div className="w-max min-w-full">
                    <InfiniteScroll
                        dataLength={sortedUsers.length}
                        next={nextExistingUsers}
                        hasMore={!!hasMoreExistingUsers}
                        isLoading={loadingExistingUsers}
                    >
                        <Table
                            data={sortedUsers}
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
            {!hasMoreExistingUsers && sortedUsers.length > 0 && (
                <p className="text-center py-4">No more existing users to load.</p>
            )}
            {sortedUsers.length === 0 && !loadingExistingUsers && (
                <p className="text-center py-4">No existing users found.</p>
            )}

            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                />
            )}
        </div>
    );
}