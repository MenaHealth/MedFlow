'use client'

import { useSession } from 'next-auth/react'
import { UserProfile } from '@/components/user-profile/UserProfile'
import { UserProfileSkeleton } from '@/components/user-profile/userProfileSkeleton'

export default function MyProfilePage() {
    const { data: session, status } = useSession()

    // Display a loading indicator while the session status is loading
    if (status === 'loading') {
        return <UserProfileSkeleton />
    }

    // Check if the session is authenticated
    if (status === 'unauthenticated' || !session?.user) {
        return <div>Access Denied</div>
    }

    // Pass the session user directly to UserProfile
    return <UserProfile user={session.user} />;
}