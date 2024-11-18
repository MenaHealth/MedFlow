// app/api/rx-order-qr-code/patient/[uuid]/route.ts

import { NextResponse } from 'next/server';

export const GET = async (request: Request, { params }: { params: { uuid: string } }) => {
    try {
        const { uuid } = params;

        const redirectUrl = `/rx-order/pharmacist?uuid=${uuid}`;
        return NextResponse.redirect(redirectUrl);
    } catch (error) {
        console.error('Error redirecting to Pharmacist View:', error);
        return new NextResponse('Failed to redirect', { status: 500 });
    }
};