import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import SettingsPageContent from '../components/SettingsPageContent';

const SettingsPage: React.FC = () => {
    return (
        <AdminLayout>
            <SettingsPageContent />
        </AdminLayout>
    );
};

export default SettingsPage;
