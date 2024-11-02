// components/auth/adminDashboard/sections/DeniedDoctorsAndTriageViewModel.tsx

import { useState } from 'react';
import { useQuery, useInfiniteQuery, useMutation } from 'react-query';

export function useDeniedDoctorsAndTriageViewModel() {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);

    // Fetch denied users with pagination
    const {
        data,
        isLoading: loadingDeniedUsers,
        fetchNextPage: nextDeniedUsers,
        hasNextPage: hasMoreDeniedUsers,
    } = useInfiniteQuery(
        'deniedUsers',
        async ({ pageParam = 1 }) => {
            const res = await fetch(`/api/admin/GET/denied-users?page=${pageParam}&limit=20`);
            if (!res.ok) throw new Error('Failed to fetch denied users');
            const result = await res.json();
            return {
                users: result.users,
                nextPage: pageParam + 1,
                hasMore: result.totalPages > pageParam,
            };
        },
        {
            getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextPage : undefined),
        }
    );

    const deniedUsers = data?.pages.flatMap((page) => page.users) || [];

    // Re-approve users mutation
    const reApproveMutation = useMutation(async (userIds: string[]) => {
        const token = localStorage.getItem('authToken'); // Replace this with your token retrieval method
        const res = await fetch('/api/admin/POST/re-approve-users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userIds }),
        });
        if (!res.ok) throw new Error('Failed to re-approve users');
        return res.json();
    });

    const handleReApproveUsers = () => {
        reApproveMutation.mutate(selectedUsers, {
            onSuccess: () => {
                setSelectedUsers([]);
                // Optionally refetch denied users if necessary
                nextDeniedUsers();
            },
        });
    };

    const handleCheckboxChange = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const toggleSelecting = () => {
        setIsSelecting((prev) => !prev);
    };

    return {
        deniedUsers,
        loadingDeniedUsers,
        hasMoreDeniedUsers,
        nextDeniedUsers,
        isSelecting,
        toggleSelecting,
        selectedUsers,
        handleCheckboxChange,
        handleReApproveUsers, // Expose re-approve function
    };
}