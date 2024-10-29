import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from './../../components/ui/card';
import { Avatar } from './../../components/ui/avatar';
import { Label } from './../../components/ui/label';
import { Button } from './../../components/ui/button';
import { Input } from './../../components/ui/input';
import { Pencil, X, Copy, Check } from 'lucide-react';
import { CountriesList } from '@/data/countries.enum';
import { LanguagesList } from '@/data/languages.enum';
import { MultiChoiceFormField } from "./../../components/form/MultiChoiceFormField";
import { SingleChoiceFormField } from "./../../components/form/SingleChoiceFormField";
import { DatePickerFormField } from "./../../components/form/DatePickerFormField";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface UserProfileProps {
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        dob: Date;
        languages: string[];
        countries: string[];
        gender: 'male' | 'female';
        image?: string;
        email?: string;
        accountType?: 'Doctor' | 'Triage';
        doctorSpecialty?: string;
    }
}

const userProfileSchema = z.object({
    _id: z.string(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.string().refine((value) => {
        const date = new Date(value);
        return !isNaN(date.getTime()) && date < new Date();
    }, {
        message: "Please enter a valid date of birth in the past",
    }),
    languages: z.array(z.string()).min(1, "At least one language is required"),
    countries: z.array(z.string()).min(1, "At least one country is required"),
    gender: z.enum(['male', 'female'], { errorMap: () => ({ message: "Gender is required" }) }),
    image: z.string().optional(),
    email: z.string().optional(),
    accountType: z.enum(['Doctor', 'Triage'], { errorMap: () => ({ message: "Account type is required" }) }),
    doctorSpecialty: z.string().optional(),
});

type UserProfileFormValues = z.infer<typeof userProfileSchema>;

export function UserProfile({ user }: UserProfileProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    console.log(user)

    const methods = useForm<UserProfileFormValues>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            dob: user.dob instanceof Date ? user.dob.toISOString().split('T')[0] : user.dob || '', // Format the Date
            languages: user.languages || [],
            countries: user.countries || [],
            gender: user.gender || undefined,
            image: user.image || undefined,
            email: user.email || undefined,
            accountType: user.accountType || undefined,
            doctorSpecialty: user.doctorSpecialty || undefined,
        },
    });

    if (!user) {
        return <div>Profile not found. Try refreshing the page.</div>;
    }

    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;

    const handleEdit = () => {
        setIsEditing(true); // Only set to editing mode, no reset needed
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        methods.reset(); // Reset the form when cancelling edit mode
    };

    const handleSubmit = async (data: UserProfileFormValues) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/user/${user._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setIsEditing(false); // Save and exit editing mode
            } else {
                console.error('Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
        setIsLoading(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(user._id).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
                <Card className="w-full max-w-3xl mx-auto mt-8">
                    <CardHeader className="relative">
                        <CardTitle className="text-center">My Profile</CardTitle>
                        {!isEditing ? (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={handleEdit}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={handleCancelEdit}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar
                                src={user.image || undefined}
                                alt={`${user.firstName} ${user.lastName}`}
                                initials={initials}
                                className="w-24 h-24 text-2xl"
                            />
                            <div className="text-center">
                                <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <div className="flex items-center justify-center mt-2">
                                    <p className="text-sm bg-darkBlue text-white px-2 py-1 rounded">ID: {user._id}</p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={copyToClipboard}
                                        className="ml-2"
                                    >
                                        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProfileField
                                label="First Name"
                                value={user.firstName}
                                isEditing={isEditing}
                                fieldName="firstName"
                            />
                            <ProfileField
                                label="Last Name"
                                value={user.lastName}
                                isEditing={isEditing}
                                fieldName="lastName"
                            />
                            <ProfileField label="Account Type" value={user.accountType} isEditing={false} />
                            {user.accountType === 'Doctor' && (
                                <>
                                    <ProfileField label="Specialty" value={user.doctorSpecialty} isEditing={false} />
                                    <div className="col-span-2">
                                        {isEditing ? (
                                            <MultiChoiceFormField
                                                fieldName="languages"
                                                fieldLabel="Languages"
                                                choices={LanguagesList}
                                            />
                                        ) : (
                                            <ProfileField label="Languages" value={user.languages?.join(', ')} isEditing={false} />
                                        )}
                                    </div>
                                </>
                            )}
                            <div className="col-span-2">
                                {isEditing ? (
                                    <MultiChoiceFormField
                                        fieldName="countries"
                                        fieldLabel="Countries"
                                        choices={CountriesList}
                                    />
                                ) : (
                                    <ProfileField label="Countries" value={user.countries?.join(', ')} isEditing={false} />
                                )}
                            </div>
                            {isEditing ? (
                                <SingleChoiceFormField
                                    fieldName="gender"
                                    fieldLabel="Gender"
                                    choices={["male", "female"]}
                                />
                            ) : (
                                <ProfileField label="Gender" value={user.gender} isEditing={false} />
                            )}
                            {isEditing ? (
                                <DatePickerFormField
                                    name="dob"
                                    label="Date of Birth"
                                    type="past"
                                />
                            ) : (
                                <ProfileField
                                    label="Date of Birth"
                                    value={user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}
                                    isEditing={false}
                                />
                            )}
                        </div>
                        {isEditing && (
                            <div className="mt-6 flex justify-end">
                                <Button type="submit" variant="submit" disabled={isLoading}>
                                    {isLoading ? 'Updating...' : 'Submit Changes'}
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
}

function ProfileField({ label, value, isEditing, fieldName }: ProfileFieldProps) {
    const { register } = useForm();

    if (!isEditing) {
        return (
            <div>
                <Label className="font-medium">{label}</Label>
                <p className="mt-1">{value || 'N/A'}</p>
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
                    {...register(fieldName)}
                    defaultValue={value}
                    className="mt-1"
                />
            </div>
        );
    }

    return null;
}