import React, { useState } from 'react';
import { Table, TableColumn } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {Loader2, UserRoundCheck, UserRoundMinus} from 'lucide-react';
import { useAdminManagementViewModel } from './AdminManagementViewModel';
import type { IAdmin } from '@/models/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function AdminManagementView() {
    const {
        adminsData,
        handleRemoveAdmin,
        handleAddAdmin,
        searchUsers,
        searchResults,
        setSearchQuery,
    } = useAdminManagementViewModel();

    const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);

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
                    onClick={() => handleRemoveAdmin(admin._id.toString())}
                   variant={'lightOrangeOutline'}
                >
                    <UserRoundMinus className="w-5 h-5 mr-2" />
                    Remove
                </Button>
            ),
            width: 'w-32',
        },
    ];

    if (!adminsData || adminsData.length === 0) {
        return (
            <div className="flex justify-center items-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-orange-50">Admin Management</h1>
                <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
                    <DialogTrigger asChild>
                        <Button variant={'lightOrangeOutline'}>
                            Add Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-black text-orange-50">
                        <DialogHeader>
                            <DialogTitle>Add New Admin</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Input
                                placeholder="Search by email"
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    searchUsers(e.target.value);
                                }}
                                className="bg-gray-700 text-orange-50"
                            />
                            {searchResults.map((user) => (
                                <div key={user._id} className="flex justify-between items-center">
                                    <span>{user.email}</span>
                                    <Button
                                        onClick={() => {
                                            handleAddAdmin(user._id);
                                            setIsAddAdminOpen(false);
                                        }}
                                        variant={'lightOrangeOutline'}
                                    >
                                        <UserRoundCheck className="w-5 h-5 mr-2" />
                                        Add
                                    </Button>

                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-lg overflow-hidden border border-orange-50">
                <Table
                    data={adminsData}
                    columns={columns}
                    backgroundColor="bg-darkBlue"
                    textColor="text-orange-50"
                    borderColor="border-orange-50"
                    headerBackgroundColor="bg-grey-950"
                    headerTextColor="text-orange-50"
                    hoverBackgroundColor="hover:bg-grey-950"
                    hoverTextColor="hover:text-orange-500"
                    stickyHeader={true}
                />
            </div>
        </div>
    );
}

