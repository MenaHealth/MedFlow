// components/auth/adminDashboard/sections/EditUserModalView.tsx

'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from './ExistingDoctorsAndTriageViewModel';
import { useEditUserModalViewModel } from './EditUserModalViewModel';
import { MultiChoiceFormField } from '@/components/form/MultiChoiceFormField';
import { FormProvider } from 'react-hook-form';
import { CountriesList } from '@/data/countries.enum';
import { LanguagesList } from '@/data/languages.enum';

interface EditUserModalProps {
    user: User;
    onClose: () => void;
}

export function EditUserModal({ user, onClose }: EditUserModalProps) {
    const { form, onSubmit, isSubmitting } = useEditUserModalViewModel(user, onClose);

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" {...form.register('firstName')} />
                            {form.formState.errors.firstName && (
                                <p className="text-red-500">{form.formState.errors.firstName.message}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" {...form.register('lastName')} />
                            {form.formState.errors.lastName && (
                                <p className="text-red-500">{form.formState.errors.lastName.message}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="gender">Gender</Label>
                            <Select onValueChange={(value) => form.setValue('gender', value as 'male' | 'female')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.gender && (
                                <p className="text-red-500">{form.formState.errors.gender.message}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input id="dob" type="date" {...form.register('dob')} />
                            {form.formState.errors.dob && (
                                <p className="text-red-500">{form.formState.errors.dob.message}</p>
                            )}
                        </div>
                        <MultiChoiceFormField
                            fieldName="countries"
                            fieldLabel="Countries"
                            choices={CountriesList}
                        />
                        <MultiChoiceFormField
                            fieldName="languages"
                            fieldLabel="Languages"
                            choices={LanguagesList}
                        />
                        {user.accountType === 'Doctor' && (
                            <div>
                                <Label htmlFor="doctorSpecialty">Doctor Specialty</Label>
                                <Input id="doctorSpecialty" {...form.register('doctorSpecialty')} />
                                {form.formState.errors.doctorSpecialty && (
                                    <p className="text-red-500">{form.formState.errors.doctorSpecialty.message}</p>
                                )}
                            </div>
                        )}
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}