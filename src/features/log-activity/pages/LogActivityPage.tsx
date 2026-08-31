import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import LogActivityUserContent from '../components/LogActivityUserContent';
import LogActivitySystemContent from '../components/LogActivitySystemContent';
import TabsSections from '@/components/TabsSections';

export const LogActivityPage: React.FC = () => {
    return (
        <AdminLayout>
            <TabsSections
                tabObjects={[
                    { trigger: 'Aktivitas Pengguna', content: <LogActivityUserContent /> },
                    { trigger: 'Aktivitas Sistem', content: <LogActivitySystemContent /> },
                ]}
            />
        </AdminLayout>
    );
};
