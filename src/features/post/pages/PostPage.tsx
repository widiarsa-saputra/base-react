import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import PostMainContent from '../components/PostMainContent';
import TabsSections from '@/components/TabsSections';

export const PostPage: React.FC = () => {
    return (
        <AdminLayout>
            <TabsSections
                tabObjects={[
                    { trigger: 'Daftar Postingan', content: <PostMainContent /> },
                ]}
            />
        </AdminLayout>
    );
};
