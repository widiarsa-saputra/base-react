import AdminLayout from '@/layouts/AdminLayout'
import React from 'react'
import UserMainContent from '../components/UserMainContent'

const UserPage: React.FC = () => {
    return (
        <AdminLayout>
            <UserMainContent />
        </AdminLayout>
    )
}

export default UserPage