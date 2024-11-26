// components/auth/adminDashboard/sections/ChangeAccountTypeView.tsx
'use client';

import { useEffect, useState} from 'react';
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';

export default function ChangeAccountTypeView() {
    const { data: session, update } = useSession();
    const [accountType, setAccountType] = useState(session?.user?.accountType);

    useEffect(() => {
        setAccountType(session?.user?.accountType);
    }, [session?.user?.accountType]);

    const handleSave = () => {
        fetch(`/api/user/${session?.user?._id}`, {
            method: 'PATCH',
            body: JSON.stringify({ accountType }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(() => {
                update({ ...session, user: { ...session?.user, accountType } });
                alert(`Account type updated successfully to ${accountType}!`);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-end mb-12">
                <Button
                    variant="outline"
                    onClick={handleSave}
                >
                    Save
                </Button>
            </div>
            <div className="flex flex-wrap justify-center items-center mb-4 gap-4">
                <Button
                    variant={accountType === 'Triage' ? 'default' : 'outline'}
                    style={{ transform: 'scale(1.5)', marginRight: '5rem' }}
                    onClick={() => setAccountType('Triage')}
                >
                    Triage
                </Button>

                <Button
                    variant={accountType === 'Doctor' ? 'default' : 'outline'}
                    style={{ transform: 'scale(1.5)', marginLeft: '5rem' }}
                    onClick={() => setAccountType('Doctor')}
                >
                    Doctor
                </Button>
            </div>

        </div>
    );
}