// app/layout.tsx
'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import '../styles/globals.css'; // Adjust the path as needed

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html lang="en">
      <body>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </GoogleOAuthProvider>
      </body>
      </html>
  );
}