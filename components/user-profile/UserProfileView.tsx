// components/user-profile/UserProfileView.tsx
'use client'

import React from "react";
import { FormProvider } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, X, Copy, Check, Info } from 'lucide-react';
import { CountriesList } from '@/data/countries.enum';
import { LanguagesList } from '@/data/languages.enum';
import { DoctorSpecialties } from "@/data/doctorSpecialty.enum";
import { MultiChoiceFormField } from "@/components/form/MultiChoiceFormField";
import { SingleChoiceFormField } from "@/components/form/SingleChoiceFormField";
import { DatePickerFormField } from "@/components/form/DatePickerFormField";
import { useUserProfileViewModel, UserProfileFormValues } from './UserProfileViewModel';
import { UserProfileSkeleton } from '@/components/user-profile/userProfileSkeleton';
import Tooltip from '@/components/form/Tooltip';

const formatTooltipMessage = (email: string) => {
    return `If you need to update your account type, please contact an admin with the email address you signed up with: (${email})`;
};

export function UserProfileView() {
    const vm = useUserProfileViewModel();

    if (vm.status === 'loading' || !vm.myProfile) {
        return <UserProfileSkeleton />;
    }

    if (vm.status === 'unauthenticated') {
        return <div>Access Denied</div>;
    }

    const initials = `${vm.myProfile.firstName?.[0] || ''}${vm.myProfile.lastName?.[0] || ''}`;

    return (
        <FormProvider {...vm.methods}>
            <form onSubmit={vm.methods.handleSubmit(vm.handleSubmit)}>
                <Card className="w-full max-w-3xl mx-auto mt-8">
                    <CardHeader className="relative">
                        <CardTitle className="text-center">My Profile</CardTitle>
                        {!vm.isEditing ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={vm.handleEdit}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={vm.handleCancelEdit}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar
                                src={vm.myProfile.image}
                                alt={`${vm.myProfile.firstName} ${vm.myProfile.lastName}`}
                                initials={initials}
                                className="w-24 h-24 text-2xl"
                            />
                            <div className="text-center">
                                <h2 className="text-xl font-semibold">{vm.myProfile.firstName} {vm.myProfile.lastName}</h2>
                                <p className="text-sm text-gray-500">{vm.myProfile.email}</p>
                                <div className="flex items-center justify-center mt-2">
                                    <p className="text-sm bg-darkBlue text-white px-2 py-1 rounded">ID: {vm.myProfile._id}</p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={vm.copyToClipboard}
                                        className="ml-2"
                                    >
                                        {vm.isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProfileField
                                label="First Name"
                                value={vm.myProfile.firstName}
                                isEditing={vm.isEditing}
                                fieldName="firstName"
                                register={vm.methods.register}
                                email={vm.myProfile.email}
                            />
                            <ProfileField
                                label="Last Name"
                                value={vm.myProfile.lastName}
                                isEditing={vm.isEditing}
                                fieldName="lastName"
                                register={vm.methods.register}
                                email={vm.myProfile.email}
                            />
                            <div className="flex items-center">
                                <ProfileField label="Account Type" value={vm.myProfile.accountType} isEditing={false} email={vm.myProfile.email} />
                                <Tooltip tooltipText={formatTooltipMessage(vm.myProfile.email || '')} showTooltip={true}>
                                    <Info className="h-4 w-4 ml-2 text-gray-500 cursor-help" />
                                </Tooltip>
                            </div>
                            {vm.myProfile.accountType === 'Doctor' && (
                                <>
                                    {vm.isEditing ? (
                                        <SingleChoiceFormField
                                            fieldName="doctorSpecialty"
                                            fieldLabel="Specialty"
                                            choices={DoctorSpecialties}
                                        />
                                    ) : (
                                        <ProfileField label="Specialty" value={vm.myProfile.doctorSpecialty} isEditing={vm.isEditing} email={vm.myProfile.email}/>
                                    )}
                                    <div className="col-span-2">
                                        {vm.isEditing ? (
                                            <MultiChoiceFormField
                                                fieldName="languages"
                                                fieldLabel="Languages"
                                                choices={LanguagesList}
                                            />
                                        ) : (
                                            <ProfileField label="Languages" value={vm.myProfile.languages?.join(', ')} isEditing={false} email={vm.myProfile.email} />
                                        )}
                                    </div>
                                </>
                            )}
                            <div className="col-span-2">
                                {vm.isEditing ? (
                                    <MultiChoiceFormField
                                        fieldName="countries"
                                        fieldLabel="Countries"
                                        choices={CountriesList}
                                    />
                                ) : (
                                    <ProfileField label="Countries" value={vm.myProfile.countries?.join(', ')} isEditing={false} email={vm.myProfile.email} />
                                )}
                            </div>
                            {vm.isEditing ? (
                                <SingleChoiceFormField
                                    fieldName="gender"
                                    fieldLabel="Gender"
                                    choices={["male", "female"]}
                                />
                            ) : (
                                <ProfileField label="Gender" value={vm.myProfile.gender} isEditing={false} email={vm.myProfile.email} />
                            )}
                            {vm.isEditing ? (
                                <DatePickerFormField
                                    name="dob"
                                    label="Date of Birth"
                                    type="past"
                                />
                            ) : (
                                <ProfileField
                                    label="Date of Birth"
                                    value={vm.myProfile.dob ? new Date(vm.myProfile.dob).toLocaleDateString() : 'N/A'}
                                    isEditing={false}
                                    email={vm.myProfile.email}
                                />
                            )}
                        </div>
                        {vm.isEditing && (
                            <div className="mt-6 flex justify-end">
                                <Button type="submit" variant="submit" disabled={vm.isLoading}>
                                    {vm.isLoading ? 'Updating...' : 'Submit Changes'}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </form>
        </FormProvider>
    );
}

interface ProfileFieldProps {
    label: string;
    value?: string;
    isEditing: boolean;
    fieldName?: string;
    register?: any;
    email?: string;
}

function ProfileField({ label, value, isEditing, fieldName, register, email }: ProfileFieldProps) {
    const tooltipMessage = label === "Account Type" ? formatTooltipMessage(email || '') : "";

    if (!isEditing) {
        return (
            <div>
                <Label className="font-medium">{label}</Label>
                <Tooltip tooltipText={tooltipMessage} showTooltip={label === "Account Type"}>
                    <p className="mt-1 cursor-help">{value || 'N/A'}</p>
                </Tooltip>
            </div>
        );
    }

    if (fieldName) {
        return (
            <div>
                <Label className="font-medium" htmlFor={fieldName}>
                    {label}
                </Label>
                <Input
                    id={fieldName}
                    {...(register && fieldName ? register(fieldName) : {})}
                    defaultValue={value}
                    className="mt-1"
                />
            </div>
        );
    }

    return null;
}