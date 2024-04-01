"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { TextFormField } from "@/components/form/TextFormField"
import { z } from "zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import {
    Form,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"

import { MultiChoiceFormField } from "./MultiChoiceFormField"
import { CLINICS } from "@/data/data"
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
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

export function UserOnboarding() {

    let session = useSession().data as ExtendedSession;

    // const [session, setSession] = React.useState(useSession().data as ExtendedSession);

    const [accountType, setAccountType] = React.useState<string>("Unspecified");
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
        // setSession({ ...session, user: {...session.user, accountType: data.accountType, specialties: [data.specialties] }})
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

    async function getUserInfo() {
        const response = await fetch(`/api/user/${session?.user?.id}`, {
            method: "GET",
        });
        const data = response.json();
        alert(`user data ${JSON.stringify(data, null, 2)}`);
    }

    // log in -> select account 
    // account type is set
    // doc type is set -> display form

    function hasUserLoggedIn() {
        return session?.user ? true : false;
    }

    function isUserProfileSetUp() {
        if (!hasUserLoggedIn()) return false;

        return (session.user!.accountType === 'Doctor' && session.user!.specialties!.length > 0) || 
        (session.user!.accountType === 'Triage');
    }


    return (
        <>
            {/* {hasUserLoggedIn() ? 'user logged in' : 'user not logged in'}
            {isUserProfileSetUp() ? 'user set up' : 'user not set up'} */}

            {!hasUserLoggedIn() && providers ? (
                Object.values(providers).map((provider) => (
                    <div key={(provider as any).name} className="flex">
                        <button
                            type='submit'
                            key={(provider as any).name}
                            onClick={() => {
                                // setSession({user: {name: 'sunny', email: 'h@h.com', id:'hi', accountType:"Unspecified"}, expires: 'abc'});
                                signIn((provider as any).id);
                            }}
                            className='black_btn'
                        >
                            Log In
                        </button>
                    </div>
                ))
            ) : !isUserProfileSetUp() ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 align-middle">
                        <MultiChoiceFormField form={form} fieldName="accountType" fieldLabel="Account Type" custom={false} choices={['Doctor', 'Triage']} cols={1} onRadioChange={(value: string) => setAccountType(value)} />

                        {accountType === "Doctor" && (
                            <MultiChoiceFormField form={form} fieldName="specialties" fieldLabel="Specialty" custom={true} choices={CLINICS} cols={3} />
                        )}
                        <Button type="submit" className="justify-center">Submit Request</Button>
                    </form>
                </Form>
            ) : (
                <div className="space-y-8">
                    <div>Name: {session?.user?.name}</div>
                    <div>Account Type: {session?.user?.accountType}</div>
                    <div>Specialties: {session?.user?.specialties}</div>
                    {/* // message saying you're all set */}
                    <div>You are all set!</div>

                    {/* <button
                        onClick={() => {
                            updateProfile({ accountType: 'Unspecified', specialties: [] });
                        }}
                        className='black_btn'
                    >Edit Profile</button> */}
                    <a href="/patient/clinic"><button className='black_btn'>Go to Clinics</button></a>
                </div>
            )}
        </>
    );
};