import { signIn } from 'next-auth/react';

export function HomePage({ provider }: { provider: any }) {
    return (
        <>
            <div className='w-full h-screen flex-col justify-center items-center'>
                <div>
                    <section>
                        <h1 className='orange_gradient head_text text-center'>
                            MedFlow
                            <br className='max-md:hidden' />
                        </h1>
                        <p className='head_text_2 py-10 text-center'>
                            Connect patients with volunteers.
                        </p>
                    </section>
                </div>
                <div key={(provider as any).name} className="flex h-[50vh] items-center justify-center align-middle">
                    <button
                        type='submit'
                        key={(provider as any).name}
                        onClick={() => {
                            signIn((provider as any).id);
                        }}
                        className='login_btn'
                    >
                        Log In
                    </button>
                </div>
            </div>
        </>
    )
}    