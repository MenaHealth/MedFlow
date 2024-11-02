// components/auth/adminDashboard/sections/DeniedDoctorsAndTriageViewModel.tsx

import { useState } from 'react';
import { useQuery, useInfiniteQuery } from 'react-query';

export function useDeniedDoctorsAndTriageViewModel() {
    const [isCountryVisible, setIsCountryVisible] = useState(false);
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

    const handleCheckboxChange = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const toggleCountryVisibility = () => {
        setIsCountryVisible((prev) => !prev);
    };

    const toggleSelecting = () => {
        setIsSelecting((prev) => !prev);
    };

    return {
        deniedUsers,
        loadingDeniedUsers,
        hasMoreDeniedUsers,
        nextDeniedUsers,
        isCountryVisible,
        toggleCountryVisibility,
        isSelecting,
        toggleSelecting,
        selectedUsers,
        handleCheckboxChange,
    };
}