import React, { useState } from 'react';
import { Table, TableColumn } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { useAdminManagementViewModel } from './AdminManagementViewModel';
import type { IAdmin } from '@/models/admin';

export default function AdminManagementView() {
    const {
        adminsData,
        handleRemoveAdmin,
        handleSearch,
        searchQuery,
        setSearchQuery,
        fetchAllAdmins,
    } = useAdminManagementViewModel();


    const columns: TableColumn<IAdmin>[] = [
        {
            key: 'firstName',
            id: 'firstName',
            header: 'First Name',
            width: 'w-32',
        },
        {
            key: 'lastName',
            id: 'lastName',
            header: 'Last Name',
            width: 'w-32',
        },
        {
            key: 'email',
            id: 'email',
            header: 'Email',
            width: 'w-48',
        },
        {
            key: 'adminStartDate',
            id: 'adminStartDate',
            header: 'Start Date',
            width: 'w-40',
            render: (value) => new Date(value as string).toLocaleDateString('en-US'),
        },
        {
            key: 'actions',
            id: 'actions',
            header: 'Actions',
            render: (_value, admin) => (
                <Button
                    size="sm"
                    onClick={() => handleRemoveAdmin(admin.userId.toString())}
                    className="bg-red-500 text-white hover:bg-red-600"
                >
                    Remove
                </Button>
            ),
            width: 'w-32',
        },
    ];


    const handleSearchSubmit = () => {
        handleSearch();
        console.log("Search query submitted:", searchQuery);
    };

    if (!adminsData || adminsData.length === 0) {
        return (
            <div className="flex justify-center items-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4 flex flex-wrap items-center">
                <div className="ml-auto flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Search by email"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-2 border rounded-md bg-gray-50 text-black"
                    />
                    <Button
                        onClick={handleSearchSubmit}
                        variant="outline"
                        className="text-orange-950 border-2 border-white hover:bg-orange-800 hover:text-white transition-colors"
                    >
                        Search
                    </Button>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-orange-900">
                <Table
                    data={adminsData}
                    columns={columns}
                    backgroundColor="bg-darkBlue"
                    textColor="text-orange-50"
                    borderColor="border-orange-900"
                    headerBackgroundColor="bg-orange-950"
                    headerTextColor="text-orange-50"
                    hoverBackgroundColor="hover:bg-orange-950"
                    hoverTextColor="hover:text-darkBlue"
                    stickyHeader={true}
                />
            </div>
        </div>
    );
}