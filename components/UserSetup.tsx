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

export function UserSetup({accountType, setAccountType}: {accountType: string, setAccountType: any}) {

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

    return (
        <div className="h-screen text-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <MultiChoiceFormField 
                        form={form} 
                        fieldName="accountType" 
                        fieldLabel="Account Type" 
                        custom={false} 
                        choices={['Doctor', 'Triage']}  
                        onRadioChange={(value: string) => setLocalAccountType(value)} 
                    />

                    {localAccountType === "Doctor" && (
                        <MultiChoiceFormField 
                            form={form} 
                            fieldName="specialties" 
                            fieldLabel="Specialty" 
                            custom={true} 
                            choices={CLINICS} 
                            cols={3}
                        />
                    )}
                    <Button type="submit" className="justify-center">Submit Request</Button>
                </form>
            </Form>
        </div>
    );
};