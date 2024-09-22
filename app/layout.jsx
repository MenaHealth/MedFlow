import "@/styles/globals.css";
import Provider from "@/components/Provider";
import { ToastProvider } from '@/components/ui/toast';
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata = {
  title: "MedFlow",
  description: "Connecting patients with volunteers.",
};

const RootLayout = ({ children }) => {
  
  return (
    <html lang='en' className="h-full w-full">
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
)};
export default RootLayout;
