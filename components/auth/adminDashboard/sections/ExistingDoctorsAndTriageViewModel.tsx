// components/auth/adminDashboard/sections/ExistingDoctorsAndTriageViewModel.tsx
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
    approvalDate?: string;
}

export function useExistingDoctorsAndTriageViewModel() {
    const { data: session } = useSession();
    const [isCountryVisible, setIsCountryVisible] = useState(true);
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

    const existingUsers = data?.pages.flatMap((page) => page.users) || [];

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

    const handleMoveToDenied = (userId: string) => {
        if (!session?.user?.isAdmin) {
            setToast({
                title: 'Error',
                description: 'You do not have permission to perform this action.',
                variant: 'destructive',
            });
            return;
        }
        moveToDeniedMutation.mutate(userId);
    };

    const toggleCountryVisibility = () => setIsCountryVisible((prev) => !prev);

    return {
        existingUsers,
        loadingExistingUsers,
        hasMoreExistingUsers,
        nextExistingUsers,
        isCountryVisible,
        toggleCountryVisibility,
        handleMoveToDenied,
    };
}