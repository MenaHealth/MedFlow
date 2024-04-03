"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

import { CLINICS } from "@/data/data"
import { useSession, getProviders } from "next-auth/react";
import { Session } from "next-auth"

interface ExtendedSession extends Session {
    user?: {
        name?: string | null
        email?: string | null
        image?: string | null
        accountType?: string | null
        specialties?: string[] | null
        id?: string | null
    }
}

export function UserSetup({ accountType, setAccountType }: { accountType: string, setAccountType: any }) {

    let session = useSession().data as ExtendedSession;

    const [localAccountType, setLocalAccountType] = React.useState<string>(accountType);
    const [customSpecialty, setCustomSpecialty] = React.useState('');
    const [localSpecialties, setLocalSpecialties] = React.useState<string[]>(session?.user?.specialties || []);

    React.useEffect(() => {
        if (session?.user) {
            setLocalAccountType(session.user.accountType || "Unspecified");
            setLocalSpecialties(session.user.specialties || []);
        }
    }, [session?.user]);

    async function updateProfile({ accountType, specialties }: { accountType: string, specialties: string[] }) {
        try {
            if (!session) {
                alert("You must be signed in to update your profile");
                return;
            }
            if (accountType === "Triage") {
                specialties = [];
            }
            const response = await fetch(`/api/user/${session?.user?.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    accountType: accountType,
                    specialties: specialties,
                }),
            });

            // if the response is ok, update the session
            if (response.ok && session?.user) {
                session.user.accountType = accountType;
                session.user.specialties = specialties;
                setAccountType(accountType);
                setLocalSpecialties(specialties);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function formSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const accountType = formData.get("accountType") as string;
        const specialties = formData.getAll("specialties") as string[];
        if (accountType === "Triage") {
            specialties.length = 0;
        }
        updateProfile({ accountType, specialties });
    }

    return (
        <div className="h-screen text-center">
            <form onSubmit={formSubmit} className="space-y-8">

                <div className="text-2xl">Choose Account Type</div>

                <div className="flex justify-center">
                    <div className="p-4 m-4 border border-black bg-orange-200 text-black rounded-md cursor-pointer" onClick={() => setLocalAccountType("Doctor")}>
                        <div>Doctor</div>
                        <input type="radio" name="accountType" checked={localAccountType === 'Doctor'} value={localAccountType} className="p-2" onChange={setAccountType} />
                    </div>
                    <div className="p-4 m-4 border border-black bg-blue-200 text-black rounded-md cursor-pointer" onClick={() => setLocalAccountType("Triage")}>
                        <div>Triage</div>
                        <input type="radio" name="accountType" checked={localAccountType === 'Triage'} value={localAccountType} className="p-2" onChange={setAccountType} />
                    </div>
                </div>

                {localAccountType === "Doctor" && (
                    <>
                        <div className="text-2xl">Choose Specialty</div>

                        <div className="justify-center grid sm:grid-cols-3 grid-cols-2">
                            {CLINICS.map((clinic) => (
                                <div key={clinic} className="p-1 m-1 border border-black bg-white text-black rounded-md cursor-pointer" onClick={(e) => !localSpecialties.includes(clinic) && setLocalSpecialties([...localSpecialties, clinic])}>
                                    <div>{clinic}</div>
                                    <input type="checkbox" name="specialties" checked={localSpecialties.includes(clinic)} value={clinic} className="p-2" />
                                </div>
                            ))}
                            <div className="p-1 m-1 border border-black bg-white text-black rounded-md cursor-pointer">
                                <input
                                    type="text"
                                    value={customSpecialty}
                                    onChange={(e) => setCustomSpecialty(e.target.value)}
                                    placeholder="Type your specialty"
                                    className="p-2"
                                />
                                <input
                                    type="checkbox"
                                    name="specialties"
                                    value={customSpecialty}
                                    checked={customSpecialty !== ''}
                                    readOnly
                                    className="p-2"
                                />
                            </div>
                        </div>
                    </>
                )}

                <Button type="submit" className="justify-center">Submit Request</Button>
            </form>
        </div>
    );
};