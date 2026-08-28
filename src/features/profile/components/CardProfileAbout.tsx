import { useAuth } from '@/auth/context/AuthProvider'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDateToLong } from '@/lib/utils'
import { CalendarDays } from 'lucide-react'
import React from 'react'

const CardProfileAbout: React.FC = () => {
    const { user } = useAuth()

    return (
        <Card>
            <CardContent className="p-6">
                <h3 className="mb-6 text-base font-bold text-slate-900 border-b pb-2">Informasi Akun</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</span>
                        <span className="text-sm font-medium text-slate-900">{user?.name || '-'}</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</span>
                        <span className="text-sm font-medium text-slate-900">{user?.email || '-'}</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">No. HP</span>
                        <span className="text-sm font-medium text-slate-900">{user?.phone || '-'}</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bergabung Pada</span>
                        <div className="flex items-center text-sm font-medium text-slate-900">
                            <CalendarDays className="mr-1.5 h-4 w-4 text-slate-400" />
                            {user?.created_at ? formatDateToLong(user.created_at) : '-'}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Peran (Roles)</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {user?.roles?.length ? (
                                user.roles.map((role) => (
                                    <Badge key={role.id} variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                                        {role.display_name}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-sm text-slate-500">-</span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hak Akses (Permissions)</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {user?.permissions?.length ? (
                                user.permissions.map((permission) => (
                                    <Badge key={permission.id} variant="outline" className="text-slate-600 bg-slate-50 border-slate-200">
                                        {permission.display_name}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-sm text-slate-500">Tidak ada hak akses spesifik</span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CardProfileAbout