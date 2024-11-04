// app/layout.jsx
import "@/styles/globals.css";
import Provider from "@/components/Provider";
import { ToastProvider } from '@/components/ui/toast';
import LayoutWrapper from "@/components/LayoutWrapper";
import Head from 'next/head';

export const metadata = {
  title: "MedFlow",
  description: "Connecting patients with volunteers.",
};

const RootLayout = ({ children }) => {
  return (
      <html lang='en' className="h-full w-full">
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <body className="h-full w-full flex flex-col">
      <ToastProvider>
        <Provider>
          {/* Background Gradient */}
          <div className='relative w-full'>
            <div className='gradient absolute inset-0' />
          </div>

          {/* Client-Side Layout Wrapper */}
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Provider>
      </ToastProvider>
      </body>
      </html>
  );
};

export default RootLayout;