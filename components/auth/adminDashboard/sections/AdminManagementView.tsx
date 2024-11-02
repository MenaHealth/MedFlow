import React, { useState } from 'react';
import { ChevronDown, Minus, Search, UserRoundCheck, UserMinus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { useAdminManagementViewModel } from './AdminManagementViewModel';

interface Admin {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    adminStartDate: string;
}

export default function AdminManagementView() {
    const {
        adminsData,
        loadingAdmins,
        hasMoreAdmins,
        loadMoreAdmins,
        handleAddAdmin,
        handleRemoveAdmin,
        handleRemoveSelectedAdmins,
        handleSearch,
        searchQuery,
        setSearchQuery,
        selectedUser,
        setSelectedUser,
    } = useAdminManagementViewModel();

    const [selectedAdmins, setSelectedAdmins] = useState<Set<string>>(new Set());

    const firstAdminId = adminsData[0]?._id; // Get the first admin's ID

    // Toggle selection of an admin for bulk delete, excluding the first admin
    const toggleSelectAdmin = (adminId: string) => {
        if (adminId === firstAdminId) return; // Prevent selecting the first admin
        setSelectedAdmins((prev) => {
            const newSelected = new Set(prev);
            newSelected.has(adminId) ? newSelected.delete(adminId) : newSelected.add(adminId);
            return newSelected;
        });
    };

    // Table columns with checkbox and delete icon, disabling for the first admin
    const columns = [
        {
            key: 'select',
            header: '',
            render: (_, admin: Admin) => (
                <input
                    type="checkbox"
                    checked={selectedAdmins.has(admin._id)}
                    onChange={() => toggleSelectAdmin(admin._id)}
                    disabled={admin._id === firstAdminId}
                />
            ),
        },
        { key: 'firstName', header: 'First Name' },
        { key: 'lastName', header: 'Last Name' },
        { key: 'email', header: 'Email' },
        {
            key: 'adminStartDate',
            header: 'Start Date',
            render: (value) => new Date(value).toLocaleDateString(),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (_, admin: Admin) => (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAdmin(admin._id)}
                    disabled={admin._id === firstAdminId} // Disable delete button for first admin
                >
                    <UserMinus className="w-5 h-5" />
                </Button>
            ),
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8 bg-darkBlue text-orange-50">
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
                    <Button onClick={handleSearch}>
                        <Search className="w-5 h-5" />
                    </Button>
                </div>

                {/* Dropdown for selecting a new admin */}
                {Array.isArray(selectedUser) && (
                    <select
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full p-2 mt-2 border rounded-md bg-darkBlue text-white"
                    >
                        <option value="">-- Select a user --</option>
                        {selectedUser.map((user: Admin) => (
                            <option key={user._id} value={user._id}>
                                {user.firstName} {user.lastName} ({user.email})
                            </option>
                        ))}
                    </select>
                )}

                <Button onClick={handleAddAdmin} disabled={!selectedUser}>
                    <UserRoundCheck className="w-5 h-5" />
                </Button>
            </div>

            {/* Table for displaying current admins */}
            <Table data={adminsData} columns={columns} />

            {/* Multi-Select Delete Button */}
            {selectedAdmins.size > 0 && (
                <div className="flex justify-center mt-4">
                    <Button
                        variant="destructive"
                        onClick={() => handleRemoveSelectedAdmins(Array.from(selectedAdmins))}
                        className="flex items-center space-x-2"
                    >
                        <UserMinus className="w-5 h-5" />
                        <span>Delete Selected</span>
                    </Button>
                </div>
            )}

            {/* Load More Button */}
            <div className="flex justify-center mt-4">
                {hasMoreAdmins && !loadingAdmins && (
                    <Button onClick={loadMoreAdmins} className="flex items-center space-x-2">
                        <ChevronDown className="w-5 h-5" />
                        <span>Load More</span>
                    </Button>
                )}
                {loadingAdmins && <p className="text-center py-4">Loading...</p>}
            </div>
        </div>
    );
}