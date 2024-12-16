'use client'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'
import { UserProfile } from '../../../components/user-profile/UserProfile'
import { UserProfileSkeleton } from '../../../components/user-profile/userProfileSkeleton'
import { image } from 'html2canvas/dist/types/css/types/image';

export default function MyProfilePage() {
    const { data: session, status } = useSession();
    const [myProfile, setMyProfile] = useState({
        _id: '',
        firstName: '',
        lastName: '',
        isAdmin: false,
        dob: new Date(),
        languages: [],
        countries: [],
        gender: '' as 'male' | 'female',
        image: '',
        accountType: '' as 'Doctor' | 'Triage',
        doctorSpecialty: ''
    });

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            fetch(`/api/user/${session.user?._id}`)
                .then(res => res.json())
                .then(data => setMyProfile(data));
        }
    }, [status, session?.user]);

    if (status === 'loading' || Object.keys(myProfile).length === 0) {
        return <UserProfileSkeleton />;
    }

    if (status === 'unauthenticated' || !session?.user) {
        return <div>Access Denied</div>;
    }

    return <UserProfile user={myProfile} setMyProfile={setMyProfile} />;
}
