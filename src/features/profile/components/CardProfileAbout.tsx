import { useAuth } from '@/auth/context/AuthProvider'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

const CardProfileAbout: React.FC = () => {
    const { user } = useAuth()

    return (
        <Card>
            <CardContent className="p-6">
                <h3 className="mb-6 text-base font-bold text-slate-900 border-b pb-2">Informasi Akun</h3>
                
                <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
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

                    <div className="flex flex-col gap-1.5">
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