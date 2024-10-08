import User, { IUser } from '@/models/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import React from "react";

import { Session } from 'next-auth';

interface UserProfileProps {
    user: Session["user"];
}

export function UserProfile({ user }: UserProfileProps) {
    if (!user) {
        return <div>Profile not found. Try refreshing the page.</div>;
    }

    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;

    return (
        <Card className="w-full max-w-3xl mx-auto mt-8">
            <CardHeader>
                <CardTitle className="text-center">My Profile</CardTitle>
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
                    </div>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileField label="Account Type" value={user.accountType} />
                    {user.accountType === 'Doctor' && (
                        <>
                            <ProfileField label="Specialty" value={user.doctorSpecialty} />
                            <ProfileField label="Languages" value={user.languages?.join(', ')} />
                        </>
                    )}
                    <ProfileField label="Countries" value={user.countries?.join(', ')} />
                    <ProfileField label="Gender" value={user.gender} />
                    <ProfileField label="Date of Birth" value={user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'} />
                </div>
            </CardContent>
        </Card>
    );
}

function ProfileField({ label, value }: { label: string; value?: string }) {
    return (
        <div>
            <Label className="font-medium">{label}</Label>
            <p className="mt-1">{value || 'N/A'}</p>
        </div>
    )
}