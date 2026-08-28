import AdminLayout from '@/layouts/AdminLayout'
import React from 'react'
import RoleMainContent from '../components/RoleMainContent'

const RolePage: React.FC = () => {
    return (
        <AdminLayout>
            <RoleMainContent />
        </AdminLayout>
    )
}

export default RolePage