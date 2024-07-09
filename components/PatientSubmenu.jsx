// components/PatientSubmenu.jsx
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import MedicalInformation from '@mui/icons-material/MedicalInformation';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import Notes from '@mui/icons-material/Notes';
import Collections from '@mui/icons-material/Collections';
import { useTheme } from '@mui/material/styles';  // Import useTheme if needed

const PatientSubmenu = () => {
    const params = useParams();
    const id = params.id || 'default-id';
    const pathname = usePathname();
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        switch (pathname) {
            case `/patient-info/${id}`:
                setValue(0);
                break;
            case `/lab-visits/${id}`:
                setValue(1);
                break;
            case `/notes/${id}`:
                setValue(2);
                break;
            case `/image-gallery/${id}`:
                setValue(3);
                break;
            default:
                setValue(0); // Default to Patient Info
        }
    }, [pathname, id]);

    return (
        <div className="fixed inset-x-0 bottom-0 bg-gray-100 px-0">
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                className="w-full"
                sx={{
                    '& .Mui-selected': {
                        color: '#FF5722', // Orange color for the selected icon
                    }
                }}
            >
                <BottomNavigationAction
                    label=""
                    icon={<MedicalInformation />}
                    component={Link}
                    href={id ? `/fajr/patient/${id}` : '#'}
                />
                <BottomNavigationAction
                    label=""
                    icon={<CalendarMonth />}
                    component={Link}
                    href={`/lab-visits/${id}`}
                />
                <BottomNavigationAction
                    label=""
                    icon={<Notes />}
                    component={Link}
                    href={`/notes/${id}`}
                />
                <BottomNavigationAction
                    label=""
                    icon={<Collections />}
                    component={Link}
                    href={`/image-gallery/${id}`}
                />
            </BottomNavigation>
        </div>
    );
};

export default PatientSubmenu;