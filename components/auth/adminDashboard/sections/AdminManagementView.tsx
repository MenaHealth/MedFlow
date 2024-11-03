import React, { useState } from 'react';
import { ChevronDown, Search, UserRoundCheck, UserMinus } from 'lucide-react';
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

    const firstAdminId = adminsData[0]?._id;

    const toggleSelectAdmin = (adminId: string) => {
        if (adminId === firstAdminId) return;
        setSelectedAdmins((prev) => {
            const newSelected = new Set(prev);
            newSelected.has(adminId) ? newSelected.delete(adminId) : newSelected.add(adminId);
            return newSelected;
        });
    };

// Transform adminsData to ensure each entry has adminStartDate
    const transformedAdminsData = (adminsData as Admin[]).map((admin) => ({
        ...admin,
        adminStartDate: admin.adminStartDate || new Date().toISOString(), // Use current date as a default
    }));

    const columns = [
        {
            key: 'select',
            header: '',
            render: (_: any, admin: Admin) => (
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
            render: (value: string) => new Date(value).toLocaleDateString(),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (_: any, admin: Admin) => (
                <Button
                    variant="default"
                    size="icon"
                    onClick={() => handleRemoveAdmin(admin._id)}
                    disabled={admin._id === firstAdminId}
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
            <Table
                data={transformedAdminsData}
                columns={columns}
                backgroundColor="darkBlue"
                textColor="orange-50"
                stickyHeader={true}
                headerBackgroundColor="orange-50"
                headerTextColor="darkBlue"
            />

            {/* Multi-Select Delete Button */}
            {selectedAdmins.size > 0 && (
                <div className="flex justify-center mt-4">
                    <Button
                        variant="submit"
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