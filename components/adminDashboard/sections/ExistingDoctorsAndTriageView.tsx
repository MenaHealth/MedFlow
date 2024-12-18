// components/auth/adminDashboard/sections/ExistingDoctorsAndTriageView.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Minus, Loader2, Edit, Search, X, Download } from 'lucide-react';
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

    const exportToCSV = async () => {
        // Include all columns except the 'actions' column
        const visibleColumns = columns.filter(column => column.key !== 'actions');
        const headers = visibleColumns.map(column => column.header);
        const authorizedUsers = await fetch('/api/user/authorized').then(res => res.json());

        const csvContent = [
            headers.join(','),
            ...authorizedUsers.map((user: User) =>
                visibleColumns.map(column => {
                    // Check if a render function is defined
                    if (column.render) {
                        // Extract plain text from rendered content with null checks
                        const renderedValue = column.render(user[column.key as keyof User], user);
                        if (typeof renderedValue === 'string') {
                            return renderedValue;
                        } else if (renderedValue && typeof renderedValue === 'object' && 'props' in renderedValue) {
                            const children = renderedValue.props.children;
                            if (Array.isArray(children)) {
                                return children
                                    .map(child =>
                                        typeof child === 'string' ? child : (child as any).props?.children || ''
                                    )
                                    .join('');
                            }
                            return renderedValue.props.children || '';
                        }
                    }

                    // Handle direct user property values, such as specialty and country fields
                    const value = user[column.key as keyof User];
                    if (Array.isArray(value)) {
                        // For array values like countries, join them with commas
                        return value.join(', ');
                    }
                    return value?.toString() || '';
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'existing_users.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
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
                            <X className="w-4 h-4"/>
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
                    <Button
                        onClick={exportToCSV}
                        variant="outline"
                        className="w-full sm:w-auto"
                    >
                        <Download className="w-4 h-4 mr-2"/>
                        Export CSV
                    </Button>
                </div>
            </div>

            <InfiniteScroll
                dataLength={filteredUsers.length}
                next={nextExistingUsers}
                hasMore={!!hasMoreExistingUsers}
                isLoading={loadingExistingUsers}
                className="bg-white rounded-md border border-orange-300"
            >
                <div className="w-full overflow-x-auto">
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
                </div>
                {!hasMoreExistingUsers && filteredUsers.length > 0 && (
                    <div className="text-center py-4 text-orange-950 bg-orange-100 border-t border-orange-300">
                        No more existing users to load.
                    </div>
                )}
                {filteredUsers.length === 0 && !loadingExistingUsers && (
                    <div className="text-center py-4 text-orange-950 bg-orange-100">
                        No existing users found.
                    </div>
                )}
            </InfiniteScroll>

            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                />
            )}
        </div>
    );
}


