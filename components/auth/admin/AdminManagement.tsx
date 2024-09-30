// components/auth/admin/AdminManagement.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import useToast from '@/components/hooks/useToast';
import {ChevronLeftIcon, ChevronRightIcon, MinusIcon, PlusIcon, SearchIcon} from 'lucide-react';
import { SingleChoiceFormField } from '@/components/form/SingleChoiceFormField';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Admin {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    adminStartDate: string;
}

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export default function AdminManagement() {
    const { data: session } = useSession();
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { setToast } = useToast();
    const [showAddAdmin, setShowAddAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    const fetchAdmins = useCallback(async () => {
        if (session?.user?.isAdmin) {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/admin/management?page=${currentPage}&limit=20`);
                if (!res.ok) throw new Error('Failed to fetch admins');
                const data = await res.json();
                setAdmins(data.admins || []);
                setTotalPages(data.totalPages || 1);
            } catch (error) {
                console.error('Error fetching admins:', error);
                setToast?.({
                    title: 'Error',
                    description: 'Failed to fetch admins.',
                    variant: 'destructive',
                });
                setAdmins([]);
            } finally {
                setIsLoading(false);
            }
        }
    }, [session, currentPage, setToast]);

    useEffect(() => {
        if (session?.user?.isAdmin) {
            fetchAdmins();
        }
    }, [session, fetchAdmins]);

    const handleAddAdmin = async () => {
        if (!selectedUser) {
            setToast?.({
                title: 'Error',
                description: 'Please select a user to add as admin.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const response = await fetch('/api/admin/management', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user?.token}`,
                },
                body: JSON.stringify({ userId: selectedUser }),
            });

            if (!response.ok) {
                throw new Error('Failed to add admin');
            }

            setToast?.({
                title: 'Success',
                description: 'User successfully added as admin.',
                variant: 'default',
            });

            setShowAddAdmin(false);
            setSelectedUser(null);
            fetchAdmins();
        } catch (error) {
            console.error('Error adding admin:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to add admin.',
                variant: 'destructive',
            });
        }
    };

    const handleRemoveAdmin = async (adminId: string) => {
        if (admins.length <= 1) {
            setToast?.({
                title: 'Error',
                description: 'There must be at least one admin.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const response = await fetch('/api/admin/management', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user?.token}`,
                },
                body: JSON.stringify({ adminId }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove admin');
            }

            setToast?.({
                title: 'Success',
                description: 'Admin removed successfully.',
                variant: 'default',
            });

            fetchAdmins();
        } catch (error) {
            console.error('Error removing admin:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to remove admin.',
                variant: 'destructive',
            });
        }
    };

    const handleSearch = useCallback(async () => {
        try {
            const res = await fetch(`/api/admin/existing-users?search=${searchQuery}`);
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data.users || []);
        } catch (error) {
            console.error('Error searching users:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to search users.',
                variant: 'destructive',
            });
        }
    }, [searchQuery, setToast]);

    useEffect(() => {
        if (searchQuery) {
            handleSearch();
        }
    }, [searchQuery, handleSearch]);

    if (isLoading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-darkBlue text-orange-50">
            <div className="flex justify-between items-center mb-4">
                <Button
                    className="bg-orange-100 hover:bg-orange-500 hover:text-orange-50 text-orange-500"
                    onClick={() => setShowAddAdmin(true)}
                >
                    <PlusIcon className="w-5 h-5" />
                </Button>
                <Button
                    className="bg-orange-100 hover:bg-orange-500 hover:text-orange-50 text-orange-500"
                    // onClick={() => setShowAddAdmin(true)}
                >
                    <MinusIcon className="w-5 h-5" />
                </Button>
            </div>
            {showAddAdmin && (
                <div className="mb-4 p-4 bg-grey-800 rounded-lg">
                    <h3 className="text-xl mb-2">Add New Admin</h3>
                    <div className="flex items-center space-x-2 mb-4">
                        <Input
                            type="text"
                            placeholder="Search by last name or email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-grow"
                        />
                        <Button onClick={handleSearch} className="bg-yellow-500 hover:bg-yellow-600 text-grey-900">
                            <SearchIcon className="w-5 h-5" />
                        </Button>
                    </div>
                    {users.length > 0 && (
                        <SingleChoiceFormField
                            fieldName="selectedUser"
                            fieldLabel="Select User"
                            choices={users.map(user => `${user.firstName} ${user.lastName} (${user.email})`)}
                        />
                    )}
                    <Button
                        onClick={handleAddAdmin}
                        className="mt-2 bg-green-500 hover:bg-green-600 text-white"
                        disabled={!selectedUser}
                    >
                        Add as Admin
                    </Button>
                </div>
            )}
            <table className="min-w-full">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b border-grey-700">Name</th>
                    <th className="py-2 px-4 border-b border-grey-700">Email</th>
                    <th className="py-2 px-4 border-b border-grey-700">Start Date</th>
                    <th className="py-2 px-4 border-b border-grey-700">Actions</th>
                </tr>
                </thead>
                <tbody>
                {admins.length > 0 ? (
                    admins.map((admin) => (
                        <tr key={admin._id}>
                            <td className="py-2 px-4 border-b border-grey-700">
                                {admin.firstName} {admin.lastName}
                            </td>
                            <td className="py-2 px-4 border-b border-grey-700">{admin.email}</td>
                            <td className="py-2 px-4 border-b border-grey-700">
                                {new Date(admin.adminStartDate).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4 border-b border-grey-700">
                                {admins.length > 1 ? (
                                    <Button
                                        className="bg-red-500 hover:bg-red-600 text-white"
                                        onClick={() => handleRemoveAdmin(admin._id)}
                                    >
                                        Remove Admin
                                    </Button>
                                ) : (
                                    <span className="text-grey-500">Cannot remove last admin</span>
                                )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4} className="py-2 px-4 border-b border-grey-700 text-center">
                            No admins found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            {admins.length > 0 && totalPages > 1 && (
                <div className="mt-4 flex justify-center items-center space-x-2">
                    <Button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full bg-grey-700 disabled:opacity-50"
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </Button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full bg-grey-700 disabled:opacity-50"
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </Button>
                </div>
            )}
        </div>
    );
}