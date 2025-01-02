// components/user-profile/UserProfileView.tsx
'use client'

import React, { useState } from "react";
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
import { useUserProfileViewModel, UserProfileFormValues, UserProfileViewModel } from './UserProfileViewModel';
import { useUserProfileAdminViewModel } from '@/components/adminDashboard/sections/userProfileAdminViewModel';
import { UserProfileSkeleton } from '@/components/user-profile/userProfileSkeleton';
import Tooltip from '@/components/form/Tooltip';
import { LinkGoogleAccount } from "@/components/user-profile/LinkGoogleAccount";
import Image from "next/image";

interface UserProfileViewProps {
    isAdmin?: boolean;
    userId?: string;
}

const formatTooltipMessage = (email: string) => {
    return `If you need to update your account type, please contact an admin with the email address you signed up with: (${email})`;
};

export function UserProfileView({ isAdmin = false, userId }: UserProfileViewProps) {
    const vmUser: UserProfileViewModel = useUserProfileViewModel();
    const vmAdmin: UserProfileViewModel = useUserProfileAdminViewModel(userId);
    const vm: UserProfileViewModel = isAdmin ? vmAdmin : vmUser;
    const [isGoogleDrawerOpen, setIsGoogleDrawerOpen] = useState(false);

    if (vm.status === 'loading' || !vm.profile) {
        return <UserProfileSkeleton />;
    }

    if (vm.status === 'unauthenticated') {
        return <div>Access Denied</div>;
    }

    if (vm.status === 'error') {
        return <div>Error loading profile.</div>;
    }

    const initials = `${vm.profile.firstName?.[0] || ''}${vm.profile.lastName?.[0] || ''}`;

    const handleGoogleLinkSuccess = (updatedUser: UserProfileFormValues) => {
        vm.setProfile(updatedUser);
        setIsGoogleDrawerOpen(false);
    };

    const handleGoogleUnlinkSuccess = () => {
        if (vm.profile) {
            vm.setProfile({
                ...vm.profile,
                googleId: undefined,
                googleEmail: undefined,
                googleImage: undefined,
            });
        }
    };

    // Use Google profile image if available, otherwise use the default image
    const avatarSrc = vm.profile.image || vm.profile.googleImage;
    return (
        <FormProvider {...vm.methods}>
            <form onSubmit={vm.methods.handleSubmit(vm.handleSubmit)}>
                <Card
                    className="w-full max-w-3xl mx-auto mt-8"
                    backgroundColor="bg-white"
                    shadowSize="lg"
                >
                    <CardHeader className="relative">
                        <CardTitle className="text-center">{isAdmin ? 'User Profile' : 'My Profile'}</CardTitle>
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
                                src={avatarSrc}
                                alt={`${vm.profile.firstName} ${vm.profile.lastName}`}
                                initials={initials}
                                className="w-24 h-24 text-2xl" // Use className for sizing
                            />
                            <div className="text-center">
                                <h2 className="text-xl font-semibold">{vm.profile.firstName} {vm.profile.lastName}</h2>
                                <p className="text-sm text-gray-500">{vm.profile.email}</p>
                                {vm.profile.googleEmail && (
                                    <p className="text-sm text-gray-500">Google Email: {vm.profile.googleEmail}</p>
                                )}
                                <div className="flex items-center mt-2">
                                    <p className="text-sm bg-darkBlue text-white px-2 py-1 rounded">ID: {vm.profile._id}</p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={vm.copyToClipboard}
                                        className="ml-2"
                                    >
                                        {vm.isCopied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}
                                    </Button>
                                </div>
                                {isAdmin ? (
                                    <div className="mt-4">
                                        {vm.profile.googleId ? (
                                            <div className="text-sm">
                                                <p><strong>Google Account:</strong> {vm.profile.googleEmail}</p>
                                                {vm.profile.googleImage && (
                                                    <Image
                                                        src={vm.profile.googleImage}
                                                        alt="Google Profile"
                                                        className="object-cover"
                                                        width={40}
                                                        height={40}
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm">No linked Google account</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex mt-4 justify-center">
                                        <Button
                                            variant="orangeOutline"
                                            onClick={() => setIsGoogleDrawerOpen(true)}>
                                            {vm.profile.googleId ? 'Manage Google Account' : 'Link Google Account'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProfileField
                                label="First Name"
                                value={vm.profile.firstName}
                                isEditing={vm.isEditing}
                                fieldName="firstName"
                                register={vm.methods.register}
                                email={vm.profile.email}
                            />
                            <ProfileField
                                label="Last Name"
                                value={vm.profile.lastName}
                                isEditing={vm.isEditing}
                                fieldName="lastName"
                                register={vm.methods.register}
                                email={vm.profile.email}
                            />
                            <div className="flex items-center">
                                {vm.isEditing ? (
                                    <SingleChoiceFormField
                                        fieldName="accountType"
                                        fieldLabel="Account Type"
                                        choices={["Doctor", "Triage","Evac"]}
                                    />
                                ) : (
                                    <ProfileField
                                        label="Account Type"
                                        value={vm.profile.accountType}
                                        isEditing={false}
                                        email={vm.profile.email}
                                    />
                                )}
                                {isAdmin && (
                                    <Tooltip tooltipText={formatTooltipMessage(vm.profile.email || '')}
                                             showTooltip={true}>
                                        <Info className="h-4 w-4 ml-2 text-gray-500 cursor-help"/>
                                    </Tooltip>
                                )}
                            </div>
                            {vm.profile.accountType === 'Doctor' && (
                                <>
                                    {vm.isEditing ? (
                                        <SingleChoiceFormField
                                            fieldName="doctorSpecialty"
                                            fieldLabel="Specialty"
                                            choices={DoctorSpecialties}
                                        />
                                    ) : (
                                        <ProfileField label="Specialty" value={vm.profile.doctorSpecialty}
                                                      isEditing={vm.isEditing} email={vm.profile.email}/>
                                    )}
                                    <div className="col-span-2">
                                        {vm.isEditing ? (
                                            <MultiChoiceFormField
                                                fieldName="languages"
                                                fieldLabel="Languages"
                                                choices={LanguagesList}
                                            />
                                        ) : (
                                            <ProfileField label="Languages" value={vm.profile.languages?.join(', ')}
                                                          isEditing={false} email={vm.profile.email}/>
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
                                    <ProfileField label="Countries" value={vm.profile.countries?.join(', ')}
                                                  isEditing={false} email={vm.profile.email}/>
                                )}
                            </div>
                            {vm.isEditing ? (
                                <SingleChoiceFormField
                                    fieldName="gender"
                                    fieldLabel="Gender"
                                    choices={["male", "female"]}
                                />
                            ) : (
                                <ProfileField label="Gender" value={vm.profile.gender} isEditing={false}
                                              email={vm.profile.email}/>
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
                                    value={vm.profile.dob ? new Date(vm.profile.dob).toLocaleDateString() : 'N/A'}
                                    isEditing={false}
                                    email={vm.profile.email}
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
            {!isAdmin && (
                <LinkGoogleAccount
                    isOpen={isGoogleDrawerOpen}
                    onClose={() => setIsGoogleDrawerOpen(false)}
                    onLinkSuccess={handleGoogleLinkSuccess}
                    onUnlinkSuccess={handleGoogleUnlinkSuccess}
                    userId={vm.profile._id}
                    googleId={vm.profile.googleId}
                    googleEmail={vm.profile.googleEmail}
                    googleImage={vm.profile.googleImage}
                />
            )}
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

function ProfileField({label, value, isEditing, fieldName, register, email}: ProfileFieldProps) {
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

