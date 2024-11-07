'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from './ExistingDoctorsAndTriageViewModel';

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

type UserFormData = z.infer<typeof userSchema>;

interface EditUserModalProps {
    user: User;
    onClose: () => void;
    onSave: (userId: string, data: UserFormData) => Promise<void>;
}

export function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
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

    const onSubmit = async (data: UserFormData) => {
        await onSave(user._id, data);
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" {...register('firstName')} />
                        {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" {...register('lastName')} />
                        {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select onValueChange={(value) => register('gender').onChange({ target: { value } })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" type="date" {...register('dob')} />
                        {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="countries">Countries</Label>
                        <Input id="countries" {...register('countries')} />
                        {errors.countries && <p className="text-red-500">{errors.countries.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="languages">Languages</Label>
                        <Input id="languages" {...register('languages')} />
                        {errors.languages && <p className="text-red-500">{errors.languages.message}</p>}
                    </div>
                    {user.accountType === 'Doctor' && (
                        <div>
                            <Label htmlFor="doctorSpecialty">Doctor Specialty</Label>
                            <Input id="doctorSpecialty" {...register('doctorSpecialty')} />
                            {errors.doctorSpecialty && <p className="text-red-500">{errors.doctorSpecialty.message}</p>}
                        </div>
                    )}
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
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