// components/auth/admin/AdminManagement.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import useToast from '@/components/hooks/useToast';
import {ChevronLeft, ChevronRight, Minus, Plus, Search, UserRoundCheck} from 'lucide-react';
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
    const [selectedUser, setSelectedUser] = useState<string | null>(null);  // Store user ID

    // Fetch existing admins
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

    // Add new admin
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
                body: JSON.stringify({ userId: selectedUser }),  // Send selected user ID
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

    // Remove an admin
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

    // Search users by email
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

    // UI for loading state
    if (isLoading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-darkBlue text-orange-50">
            <div className="flex justify-between items-center mb-4">
                <Button
                    className="border-2 border-orange-50 text-orange-50 font-bold hover:bg-orange-50 hover:text-darkBlue py-2 px-4 rounded mr-2"
                    onClick={() => setShowAddAdmin(!showAddAdmin)}
                >
                    <Plus className="w-5 h-5" />
                </Button>
            </div>

            {showAddAdmin && (
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

                    {/* Display user search results */}
                    {users.length > 0 && (
                        <div>
                            <label>Select User:</label>
                            <select
                                onChange={(e) => setSelectedUser(e.target.value)}  // Store the selected user's ID
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

                    <Button
                        onClick={handleAddAdmin}
                        className="border-2 border-darkBlue bg-orange-50 hover:bg-darkBlue hover:text-orange-500 text-darkBlue hover:border-orange-500"
                        disabled={!selectedUser}
                    >
                        <UserRoundCheck className="w-5 h-5" />
                    </Button>
                </div>
            )}

            {/* Admins Table */}
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
                                        className="border-2 border-orange-50 text-orange-50 font-bold hover:bg-orange-50 hover:text-darkBlue  py-2 px-4 rounded mr-2"
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
            {admins.length > 0 && totalPages > 1 && (
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