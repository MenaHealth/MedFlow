// components/PatientSubmenu.jsx
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import MedicalInformation from '@mui/icons-material/MedicalInformation';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import Notes from '@mui/icons-material/Notes';
import Collections from '@mui/icons-material/Collections';
import LocalPharmacy from '@mui/icons-material/LocalPharmacy';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';

const CustomBottomNavigationAction = styled(BottomNavigationAction)(({ theme }) => ({
    '&.Mui-selected': {
        color: '#FF5722', // Your desired color
    },
}));

const PatientSubmenu = () => {
    const params = useParams();
    const id = params.id || 'default-id';
    const pathname = usePathname();
    const router = useRouter();
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        switch (pathname) {
            case `/patient-info/${id}`:
                setValue(1);
                break;
            case `/lab-visits/${id}`:
                setValue(2);
                break;
            case `/notes/${id}`:
                setValue(3);
                break;
            case `/image-gallery/${id}`:
                setValue(4);
                break;
            case `/rx/${id}`:
                setValue(5);
                break;
            default:
                setValue(1);
        }
    }, [pathname, id]);

    return (
        <div className="fixed inset-x-0 bottom-0 bg-gray-100 px-0" style={{ zIndex: 1000 }}>
            {/* Patient Information Header */}

            {/* Bottom Navigation */}
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    if (newValue === 0) {
                        router.back();
                    }
                }}
                showLabels
                className="w-full bg-gray-100"
            >
                <CustomBottomNavigationAction icon={<ArrowBack />} />
                <CustomBottomNavigationAction icon={<MedicalInformation />} component={Link} href={id ? `/fajr/patient/${id}` : '#'} />
                <CustomBottomNavigationAction icon={<CalendarMonth />} component={Link} href={`/lab-visits/${id}`} />
                <CustomBottomNavigationAction icon={<Notes />} component={Link} href={`/notes/${id}`} />
                <CustomBottomNavigationAction icon={<Collections />} component={Link} href={`/image-gallery/${id}`} />
                <CustomBottomNavigationAction icon={<LocalPharmacy />} component={Link} href={`/medications/${id}`} />
            </BottomNavigation>
        </div>
    );
};

export default PatientSubmenu;