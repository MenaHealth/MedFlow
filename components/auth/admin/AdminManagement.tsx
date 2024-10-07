// components/auth/admin/AdminManagement.tsx
// components/auth/admin/AdminManagement.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import useToast from '@/components/hooks/useToast';
import { ChevronLeft, ChevronRight, Minus, Plus, Search, UserRoundCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminDashboard } from '@/components/auth/admin/AdminDashboardContext'; // Import the context

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export default function AdminManagement() {
    const { data: session } = useSession();
    const {
        adminsData,
        loadingAdmins,
        totalPages,
        currentPage,
        setCurrentPage,
        isAddAdminUsersOpen,
        toggleSection
    } = useAdminDashboard();

    const { setToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

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

            if (!response.ok) throw new Error('Failed to add admin');

            setToast?.({
                title: 'Success',
                description: 'User successfully added as admin.',
                variant: 'default',
            });

            setSelectedUser(null);
            toggleSection('addAdmin'); // Refetch data after adding admin
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
        if (adminsData.length <= 1) {
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

            if (!response.ok) throw new Error('Failed to remove admin');

            setToast?.({
                title: 'Success',
                description: 'Admin removed successfully.',
                variant: 'default',
            });

            toggleSection('addAdmin'); // Refetch data after removing admin
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
        if (!searchQuery) return;

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

    if (loadingAdmins) {
        return <div className="text-center py-4">Loading...</div>;
    }

    // Inside AdminManagement component

    return (
        <div className="container mx-auto px-4 py-8 bg-darkBlue text-orange-50">
            {isAddAdminUsersOpen && (
                <div className="mb-4 p-4 border-2 border-orange-50 rounded-lg">
                    <h3 className="text-xl mb-2">Add New Admin</h3>
                    <div className="flex items-center bg-orange-50 text-darkBlue">
                        <Input
                            type="text"
                            placeholder="Search by email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-grow"
                        />
                        <Button onClick={handleSearch} className="border-2 border-darkBlue bg-orange-50 hover:bg-darkBlue hover:text-orange-50 text-darkBlue">
                            <Search className="w-5 h-5" />
                        </Button>
                    </div>

                    {users.length > 0 && (
                        <div>
                            <label>Select User:</label>
                            <select
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="w-full p-2 mt-2 border rounded-md bg-darkBlue"
                            >
                                <option value="">-- Select a user --</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {user.firstName} {user.lastName} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <Button onClick={handleAddAdmin} disabled={!selectedUser} className="border-2 border-darkBlue bg-orange-50 hover:bg-darkBlue hover:text-orange-500 text-darkBlue hover:border-orange-500">
                        <UserRoundCheck className="w-5 h-5" />
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
                {adminsData?.length > 0 ? (
                    adminsData.map((admin: any) => (
                        <tr key={admin._id}>
                            <td className="py-2 px-4 border-b border-grey-700">
                                {admin.firstName} {admin.lastName}
                            </td>
                            <td className="py-2 px-4 border-b border-grey-700">{admin.email}</td>
                            <td className="py-2 px-4 border-b border-grey-700">
                                {new Date(admin.adminStartDate).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4 border-b border-grey-700">
                                {adminsData.length > 1 ? (
                                    <Button
                                        className="border-2 border-orange-50 text-orange-50 font-bold hover:bg-orange-50 hover:text-darkBlue py-2 px-4 rounded mr-2"
                                        onClick={() => handleRemoveAdmin(admin._id)}
                                    >
                                        <Minus className="w-5 h-5" />
                                    </Button>
                                ) : (
                                    <span className="text-orange-50 border-2 border-orange-50">root admin</span>
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

            {adminsData?.length > 0 && totalPages > 1 && (
                <div className="mt-4 flex justify-center items-center space-x-2">
                    <Button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full bg-grey-700 disabled:opacity-50"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <span>
                    Page {currentPage} of {totalPages}
                </span>
                    <Button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full bg-grey-700 disabled:opacity-50"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            )}
        </div>
    );
}