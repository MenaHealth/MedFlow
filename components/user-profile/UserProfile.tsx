import React, { useState } from "react";
import { Session } from 'next-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, X } from 'lucide-react';
import { Countries } from '../../data/countries.enum';
import { Languages } from '../../data/languages.enum';

interface UserProfileProps {
    user: Session["user"];
}

export function UserProfile({ user }: UserProfileProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(user);
    const [isLoading, setIsLoading] = useState(false);

    if (!user) {
        return <div>Profile not found. Try refreshing the page.</div>;
    }

    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedUser(user);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/user/${user._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedUser),
            });

            if (response.ok) {
                setIsEditing(false);
                // You might want to update the user state in the parent component here
            } else {
                console.error('Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
        setIsLoading(false);
    };

    return (
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
                        <p className="text-sm text-orange-500">{user.email}</p>
                        <p className="text-sm text-orange-500">ID: {user._id}</p>
                    </div>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileField
                        label="First Name"
                        value={editedUser.firstName}
                        isEditing={isEditing}
                        onChange={handleInputChange}
                        name="firstName"
                    />
                    <ProfileField
                        label="Last Name"
                        value={editedUser.lastName}
                        isEditing={isEditing}
                        onChange={handleInputChange}
                        name="lastName"
                    />
                    <ProfileField label="Account Type" value={user.accountType} isEditing={false} />
                    {user.accountType === 'Doctor' && (
                        <>
                            <ProfileField label="Specialty" value={user.doctorSpecialty} isEditing={false} />
                            <ProfileField
                                label="Languages"
                                value={editedUser.languages?.join(', ')}
                                isEditing={isEditing}
                                isMultiSelect={true}
                                options={Object.values(Languages)}
                                onChange={(value) => handleSelectChange('languages', value)}
                            />
                        </>
                    )}
                    <ProfileField
                        label="Countries"
                        value={editedUser.countries?.join(', ')}
                        isEditing={isEditing}
                        isMultiSelect={true}
                        options={Object.values(Countries)}
                        onChange={(value) => handleSelectChange('countries', value)}
                    />
                    <ProfileField
                        label="Gender"
                        value={editedUser.gender}
                        isEditing={isEditing}
                        options={['male', 'female']}
                        onChange={(value) => handleSelectChange('gender', value)}
                    />
                    <ProfileField
                        label="Date of Birth"
                        value={editedUser.dob ? new Date(editedUser.dob).toLocaleDateString() : 'N/A'}
                        isEditing={isEditing}
                        onChange={handleInputChange}
                        name="dob"
                        type="date"
                    />
                </div>
                {isEditing && (
                    <div className="mt-6 flex justify-end">
                        <Button onClick={handleSubmit} variant="submit" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Submit Changes'}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

interface ProfileFieldProps {
    label: string;
    value?: string;
    isEditing: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    type?: string;
    options?: string[];
    isMultiSelect?: boolean;
}

function ProfileField({ label, value, isEditing, onChange, name, type = "text", options, isMultiSelect }: ProfileFieldProps) {
    if (!isEditing) {
        return (
            <div>
                <Label className="font-medium">{label}</Label>
                <p className="mt-1">{value || 'N/A'}</p>
            </div>
        );
    }

    if (options) {
        return (
            <div>
                <Label className="font-medium">{label}</Label>
                <Select onValueChange={(value) => onChange(value)} value={value}>
                    <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    }

    return (
        <div>
            <Label className="font-medium" htmlFor={name}>
                {label}
            </Label>
            <Input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="mt-1"
            />
        </div>
    );
}