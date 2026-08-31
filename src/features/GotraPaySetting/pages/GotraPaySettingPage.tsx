import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import GotraPaySettingPageContent from '../components/GotraPaySettingPageContent';

const GotraPaySettingPage: React.FC = () => {
    return (
        <AdminLayout>
            <GotraPaySettingPageContent />
        </AdminLayout>
    );
};

export default GotraPaySettingPage;
