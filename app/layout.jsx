import "@/styles/globals.css";
import Nav from "@/components/Nav";
import Provider from "@/components/Provider";
import { ToastProvider } from '@/components/ui/toast';

export const metadata = {
  title: "MedFlow",
  description: "Connecting patients with volunteers.",
};

const RootLayout = ({ children }) => (
  <html lang='en' className="h-screen">
    <body className="h-screen">
    <ToastProvider>
      <Provider>
        <div className='main'>
          <div className='gradient' />
        </div>

        <main className='h-screen app'>
          <Nav />
          {children}
        </main>
      </Provider>
    </ToastProvider>
    </body>
  </html>
);

export default RootLayout;
