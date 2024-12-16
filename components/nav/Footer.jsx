"use client";
import { useSession } from "next-auth/react";
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
    const { data: session } = useSession();
    return (
        <footer>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className={`flex justify-center ${session ? '' : 'py-4 md:py-8 flex-col md:justify-between'}`}>
                    <a href="/about" className={`text-gray-500 text-center ${session ? 'text-sm px-8' : ''}`}>About MedFlow</a>
                    <span className={`${session ? 'px-8' : 'flex justify-center'}`}>
                        <EmailIcon className="text-gray-500 h-4 w-4" /> 
                        <a href="mailto:support@menahealth.org" className="text-gray-500 text-center text-sm">support@menahealth.org</a>
                    </span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
