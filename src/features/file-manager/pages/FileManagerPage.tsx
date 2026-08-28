import AdminLayout from '@/layouts/AdminLayout'
import React from 'react'
import FileManagerMainContent from '../components/FileManagerMainContent'

const FileManagerPage: React.FC = () => {
    return (
        <AdminLayout>
            <FileManagerMainContent />
        </AdminLayout>
    )
}

export default FileManagerPage
