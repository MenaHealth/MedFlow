// components/auth/adminDashboard/sections/NewSignupsViewModel.tsx
'use client';

import { useState } from 'react';
import { useQueryClient, useInfiniteQuery, useMutation } from 'react-query';
import { useSession } from 'next-auth/react';
import useToast from '@/components/hooks/useToast';

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: 'Doctor' | 'Triage';
    countries?: string[];
    doctorSpecialty?: string;
}

export function useNewSignupsViewModel() {
    const { data: session } = useSession();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isCountryVisible, setIsCountryVisible] = useState(false);
    const [isDoctorSpecialtyVisible, setIsDoctorSpecialtyVisible] = useState(false);
    const queryClient = useQueryClient();
    const { setToast } = useToast();

    const {
        data,
        isLoading: loadingNewSignups,
        fetchNextPage: nextNewSignups,
        hasNextPage: hasMoreNewSignups,
    } = useInfiniteQuery(
        'newSignups',
        async ({ pageParam = 1 }) => {
            const res = await fetch(`/api/admin/GET/new-users?page=${pageParam}&limit=20`, {
                headers: {
                    Authorization: `Bearer ${session?.user.token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to fetch new signups');
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

    const newSignups = data?.pages.flatMap((page) => page.users) || [];

    const bulkActionMutation = useMutation(
        async ({ actionType, userIds }: { actionType: 'approve-users' | 'deny-users'; userIds: string[] }) => {
            const res = await fetch(`/api/admin/POST/${actionType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user.token}`,
                },
                body: JSON.stringify({ userIds }),
            });
            if (!res.ok) throw new Error(`Failed to ${actionType}`);
            return res.json();
        },
        {
            onSuccess: (_, variables) => {
                setToast({
                    title: 'Success',
                    description: `Selected users ${variables.actionType === 'approve-users' ? 'approved' : 'denied'} successfully.`,
                    variant: 'default',
                });
                setSelectedUsers([]);
                queryClient.invalidateQueries('newSignups');
            },
            onError: (error: any, variables) => {
                setToast({
                    title: 'Error',
                    description: error.message || `Failed to ${variables.actionType}.`,
                    variant: 'destructive',
                });
            },
        }
    );

    const handleBulkAction = (actionType: 'approve-users' | 'deny-users') => {
        if (selectedUsers.length === 0) {
            setToast({
                title: 'Error',
                description: 'No users selected.',
                variant: 'destructive',
            });
            return;
        }
        bulkActionMutation.mutate({ actionType, userIds: selectedUsers });
    };

    const handleCheckboxChange = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        setSelectedUsers((prev) => (
            prev.length === newSignups.length
                ? []
                : newSignups.map((user: User) => user._id)
        ));
    };

    const toggleCountryVisibility = () => setIsCountryVisible((prev) => !prev);
    const toggleDoctorSpecialtyVisibility = () => setIsDoctorSpecialtyVisible((prev) => !prev);

    return {
        newSignups,
        loadingNewSignups,
        hasMoreNewSignups,
        nextNewSignups,
        selectedUsers,
        isCountryVisible,
        isDoctorSpecialtyVisible,
        handleBulkAction,
        handleCheckboxChange,
        handleSelectAll,
        toggleCountryVisibility,
        toggleDoctorSpecialtyVisibility,
    };
}