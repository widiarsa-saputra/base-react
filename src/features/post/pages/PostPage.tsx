import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import PostMainContent from '../components/PostMainContent';

export const PostPage: React.FC = () => {
    return (
        <AdminLayout>
            <PostMainContent />
        </AdminLayout>
    );
};
