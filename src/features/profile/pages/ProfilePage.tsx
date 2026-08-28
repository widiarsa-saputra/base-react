import AdminLayout from '@/layouts/AdminLayout'
import React from 'react'
import ProfileMainContent from '../components/ProfileMainContent'

const ProfilePage: React.FC = () => {
    return (
        <AdminLayout>
            <ProfileMainContent />
        </AdminLayout>
    )
}

export default ProfilePage