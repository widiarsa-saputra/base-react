import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import AppSettingMainContent from '../components/AppSettingMainContent';

export const AppSettingPage: React.FC = () => {
    return (
        <AdminLayout>
            <AppSettingMainContent />
        </AdminLayout>
    );
};

export default AppSettingPage;
