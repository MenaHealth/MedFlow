// components/auth/adminDashboard/sections/ExistingDoctorsAndTriageViewModel.tsx
import { useState, useMemo, useCallback } from 'react';
import { useQueryClient, useInfiniteQuery, useMutation } from 'react-query';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/hooks/useToast';

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: 'Doctor' | 'Triage';
    doctorSpecialty?: string;
    countries?: string[];
    approvalDate?: string;
    gender: 'male' | 'female';
    dob: string;
    languages: string[];
    googleId?: string;
    googleEmail?: string;
    googleImage?: string;
}

export function useExistingDoctorsAndTriageViewModel() {
    const { data: session } = useSession();
    const [isCountryVisible, setIsCountryVisible] = useState(false);
    const [isDoctorSpecialtyVisible, setIsDoctorSpecialtyVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const queryClient = useQueryClient();
    const { setToast } = useToast();

    const {
        data,
        isLoading: loadingExistingUsers,
        fetchNextPage: nextExistingUsers,
        hasNextPage: hasMoreExistingUsers,
    } = useInfiniteQuery(
        'existingUsers',
        async ({ pageParam = 1 }) => {
            const res = await fetch(`/api/admin/GET/existing-users?page=${pageParam}&limit=20`, {
                headers: {
                    Authorization: `Bearer ${session?.user.token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to fetch existing users');
            const result = await res.json();
            return {
                users: result.users,
                nextPage: pageParam + 1,
                hasMore: result.totalPages > pageParam,
            };
        },
        {
            getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextPage : undefined),
            enabled: !!session?.user.token,
        }
    );

    const existingUsers = useMemo(() => {
        return data?.pages.flatMap((page) => page.users) || [];
    }, [data?.pages]);

    const filteredUsers = useMemo(() => {
        return existingUsers.filter((user) =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [existingUsers, searchTerm]);

    const moveToDeniedMutation = useMutation(
        async (userId: string) => {
            const res = await fetch('/api/admin/POST/deny-existing-users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user.token}`,
                },
                body: JSON.stringify({ userIds: [userId] }),
            });
            if (!res.ok) throw new Error('Failed to move user to denied status');
            return res.json();
        },
        {
            onSuccess: () => {
                setToast({
                    title: 'Success',
                    description: 'User moved to denied status successfully.',
                    variant: 'default',
                });
                queryClient.invalidateQueries('existingUsers');
            },
            onError: (error: any) => {
                setToast({
                    title: 'Error',
                    description: error.message || 'Failed to move user to denied status.',
                    variant: 'destructive',
                });
            },
        }
    );

    const handleMoveToDenied = useCallback((userId: string) => {
        if (!session?.user?.isAdmin) {
            setToast({
                title: 'Error',
                description: 'You do not have permission to perform this action.',
                variant: 'destructive',
            });
            return;
        }
        moveToDeniedMutation.mutate(userId);
    }, [session?.user?.isAdmin, setToast, moveToDeniedMutation]);

    const toggleCountryVisibility = useCallback(() => setIsCountryVisible((prev) => !prev), []);
    const toggleDoctorSpecialtyVisibility = useCallback(() => setIsDoctorSpecialtyVisible((prev) => !prev), []);

    const editUserMutation = useMutation(
        async ({ userId, data }: { userId: string; data: Partial<User> }) => {
            const res = await fetch(`/api/user/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user.token}`,
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update user');
            return res.json();
        },
        {
            onSuccess: (updatedUser) => {
                setToast({
                    title: 'Success',
                    description: 'User updated successfully.',
                    variant: 'default',
                });
                queryClient.invalidateQueries('existingUsers');
                setEditingUser(null);
            },
            onError: (error: any) => {
                setToast({
                    title: 'Error',
                    description: error.message || 'Failed to update user.',
                    variant: 'destructive',
                });
            },
        }
    );

    const handleEditUser = useCallback(async (userId: string, data: Partial<User>) => {
        if (!session?.user?.isAdmin) {
            setToast({
                title: 'Error',
                description: 'You do not have permission to perform this action.',
                variant: 'destructive',
            });
            return;
        }
        editUserMutation.mutate({ userId, data });
    }, [session?.user?.isAdmin, setToast, editUserMutation]);

    const exportToCSV = useCallback(async () => {
        try {
            const response = await fetch('/api/admin/user/retrieve-all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user.token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching users: ${response.statusText}`);
            }

            const authorizedUsers: User[] = await response.json();

            if (!Array.isArray(authorizedUsers)) {
                throw new Error('Invalid data format received from the server.');
            }

            const headers = ['Name', 'Email', 'User Type', 'Approval Date', 'Doctor Specialty', 'Country'];

            const csvContent = [
                headers.join(','),
                ...authorizedUsers.map((user: User) => [
                    `${user.firstName} ${user.lastName}`,
                    user.email,
                    user.accountType,
                    user.approvalDate ? new Date(user.approvalDate).toLocaleDateString() : 'N/A',
                    user.doctorSpecialty || 'N/A',
                    user.countries?.join(', ') || 'N/A'
                ].map(value => `"${value.replace(/"/g, '""')}"`).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'existing_users.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error: any) {
            console.error('Error exporting CSV:', error);
            setToast({
                title: 'Error',
                description: error.message || 'Failed to export CSV.',
                variant: 'destructive',
            });
        }
    }, [session?.user.token, setToast]);

    return {
        existingUsers: filteredUsers,
        loadingExistingUsers,
        hasMoreExistingUsers,
        nextExistingUsers,
        isCountryVisible,
        isDoctorSpecialtyVisible,
        toggleCountryVisibility,
        toggleDoctorSpecialtyVisibility,
        handleMoveToDenied,
        handleEditUser,
        searchTerm,
        setSearchTerm,
        exportToCSV,
        editingUser,
        setEditingUser
    };
}

