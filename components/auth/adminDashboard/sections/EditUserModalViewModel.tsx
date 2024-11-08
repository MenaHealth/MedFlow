// components/auth/adminDashboard/sections/EditUserModalViewModel.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from './ExistingDoctorsAndTriageViewModel';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';
import useToast from '@/components/hooks/useToast';

const userSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    gender: z.enum(['male', 'female']),
    dob: z.string().refine((value) => {
        const date = new Date(value);
        return !isNaN(date.getTime()) && date < new Date();
    }, {
        message: "Please enter a valid date of birth in the past",
    }),
    countries: z.array(z.string()).min(1, "At least one country is required"),
    languages: z.array(z.string()).min(1, "At least one language is required"),
    doctorSpecialty: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;

export function useEditUserModalViewModel(user: User, onClose: () => void) {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const { setToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            dob: formatDate(user.dob),
            countries: user.countries || [],
            languages: user.languages || [],
            doctorSpecialty: user.doctorSpecialty,
        },
    });

    const editUserMutation = useMutation(
        async (data: UserFormData) => {
            const res = await fetch(`/api/user/${user._id}`, {
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
            onSuccess: () => {
                setToast({
                    title: 'Success',
                    description: 'User updated successfully.',
                    variant: 'default',
                });
                queryClient.invalidateQueries('existingUsers');
                onClose();
            },
            onError: (error: any) => {
                setToast({
                    title: 'Error',
                    description: error.message || 'Failed to update user.',
                    variant: 'destructive',
                });
            },
            onSettled: () => {
                setIsSubmitting(false);
            },
        }
    );

    const onSubmit = async (data: UserFormData) => {
        if (!session?.user?.isAdmin) {
            setToast({
                title: 'Error',
                description: 'You do not have permission to perform this action.',
                variant: 'destructive',
            });
            return;
        }
        setIsSubmitting(true);
        editUserMutation.mutate(data);
    };

    return {
        form,
        onSubmit,
        isSubmitting,
    };
}

function formatDate(date: string | Date): string {
    if (typeof date === 'string') {
        return date.split('T')[0]; // Assuming the date string is in ISO format
    }
    if (date instanceof Date) {
        return date.toISOString().split('T')[0];
    }
    return '';
}