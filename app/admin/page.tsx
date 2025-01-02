// app/adminDashboard/page.tsx
'use client';

import AdminDashboardView from '@/components/adminDashboard/AdminDashboardView';

const AdminPage = () => {
    return (
        <div className={'mt-12'}>
            <AdminDashboardView />
        </div>
    );
};

export default AdminPage;