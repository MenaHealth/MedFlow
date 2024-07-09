// components/PatientSubmenu.jsx
import Link from "next/link";
import { useRouter } from 'next/router';

const PatientSubmenu = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className="flex justify-around bg-gray-100 p-4">
            <Link href={`/patient-info/${id}`}>Patient Info</Link>
            <Link href={`/lab-visits/${id}`}>Lab Visits</Link>
            <Link href={`/notes/${id}`}>Notes</Link>
            <Link href={`/image-gallery/${id}`}>Image Gallery</Link>
        </div>
    );
};

export default PatientSubmenu;