"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import {
    Form,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"

import { MultiChoiceFormField } from "./form/MultiChoiceFormField"
import { CLINICS } from "@/data/data"
import { useSession, getProviders } from "next-auth/react";
import { Session } from "next-auth"
import { Radio } from "@radix-ui/react-radio-group"

const userFormSchema = z.object({
    accountType: z.string(),
    specialties: z.string(),
});

type UserFormValues = z.infer<typeof userFormSchema>
const defaultValues: Partial<UserFormValues> = {
    accountType: "",
    specialties: "",
}

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
    const [user, setUser] = React.useState<ExtendedSession["user"] | null>(null);
    const [providers, setProviders] = React.useState(null);

    React.useEffect(() => {
        (async () => {
            const res = await getProviders();
            setProviders(res as any);
        })();
    }, []);

    React.useEffect(() => {
        setUser(session?.user);
    }, [session?.user]);


    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues,
    });

    async function onSubmit(data: UserFormValues) {
        if (data.accountType === "Triage") {
            data.specialties = '';
        }
        await updateProfile({
            accountType: data.accountType,
            specialties: [data.specialties]
        });
    };


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
            }
        } catch (error) {
            console.log(error);
        }
    }
    const [customSpecialty, setCustomSpecialty] = React.useState('');

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
            {/* <Form {...form}> */}
                <form onSubmit={formSubmit} className="space-y-8">

                    <div className="text-2xl">Choose Account Type</div>

                    <div className="flex justify-center">
                        <div className="p-4 m-4 border border-black bg-orange-200 text-black rounded-md cursor-pointer" onClick={() => setLocalAccountType("Doctor")}>
                            <div>Doctor</div>
                            <input type="radio" name="accountType" value="Doctor" className="p-2" onChange={setAccountType} />
                        </div>
                        <div className="p-4 m-4 border border-black bg-blue-200 text-black rounded-md cursor-pointer" onClick={() => setLocalAccountType("Triage")}>
                            <div>Triage</div>
                            <input type="radio" name="accountType" value="Triage" className="p-2" onChange={setAccountType} />
                        </div>
                    </div>

                    {/* // create a 3 column multi-select checkbox with the different specialties
                    // only show if the user is a doctor */}
                    {localAccountType === "Doctor" && (
                        <>
                            <div className="text-2xl">Choose Specialty</div>

                            <div className="justify-center grid sm:grid-cols-3 grid-cols-2">
                                {CLINICS.map((clinic) => (
                                    <div key={clinic} className="p-1 m-1 border border-black bg-white text-black rounded-md cursor-pointer">
                                        <div>{clinic}</div>
                                        <input type="checkbox" name="specialties" value={clinic} className="p-2" />
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


                    {localAccountType === "Doctor" && (
                        <></>
                        // <MultiChoiceFormField
                        //     form={form}
                        //     fieldName="specialties"
                        //     fieldLabel="Specialty"
                        //     custom={true}
                        //     choices={CLINICS}
                        //     cols={3}
                        // />
                    )}
                    <Button type="submit" className="justify-center">Submit Request</Button>
                </form>
            {/* </Form> */}
        </div>
    );
};