// components/auth/adminDashboard/sections/ExistingDoctorsAndTriageView.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Minus, Loader2, Edit, Search, X } from 'lucide-react';
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
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Define filteredUsers to filter based on the search term
    const filteredUsers = useMemo(() => {
        return existingUsers.filter(user =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [existingUsers, searchTerm]);

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
                    <span className="truncate max-w-[150px] sm:max-w-none">{value}</span>
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
            <div className="flex flex-col mb-4 space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
                <div className="relative w-full sm:w-64">
                    <Input
                        type="text"
                        placeholder="Search by email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className={`w-full bg-white text-darkBlue pr-10 ${
                            isSearchFocused ? 'absolute z-10 left-0 right-0' : ''
                        }`}
                    />
                    {searchTerm && (
                        <Button
                            onClick={() => setSearchTerm('')}
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                    <Button
                        onClick={toggleCountryVisibility}
                        variant="ghost"
                        className="w-full sm:w-auto"
                    >
                        {isCountryVisible ? 'Hide Country' : 'Show Country'}
                    </Button>
                    <Button
                        onClick={toggleDoctorSpecialtyVisibility}
                        variant="ghost"
                        className="w-full sm:w-auto"
                    >
                        {isDoctorSpecialtyVisible ? 'Hide Doctor Specialty' : 'Show Doctor Specialty'}
                    </Button>
                </div>
            </div>

            <ScrollArea className="w-full rounded-md border border-orange-300">
                <div className="w-max min-w-full">
                    <InfiniteScroll
                        dataLength={filteredUsers.length}
                        next={nextExistingUsers}
                        hasMore={!!hasMoreExistingUsers}
                        isLoading={loadingExistingUsers}
                    >
                        <Table
                            data={filteredUsers}
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
            {!hasMoreExistingUsers && filteredUsers.length > 0 && (
                <p className="text-center py-4">No more existing users to load.</p>
            )}
            {filteredUsers.length === 0 && !loadingExistingUsers && (
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