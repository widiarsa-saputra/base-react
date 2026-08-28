import AdminLayout from '@/layouts/AdminLayout'
import React from 'react'
import PermissionMainContent from '../components/PermissionMainContent'

const PermissionsPage: React.FC = () => {
    return (
        <AdminLayout>
            <PermissionMainContent />
        </AdminLayout>
    )
}

export default PermissionsPage