import { useAuth } from '@/auth/context/AuthProvider'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
} from '@/components/ui/dialog'
import { truncateText } from '@/lib/utils'
import { LogOut, User2Icon } from 'lucide-react'
import { userSections } from '@/router/AppRouter'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface SidebarUserSectionProps {
    collapsed: boolean
    setCollapsed: (value: boolean) => void
}

// export interface MenuItem {
//     icon: React.ElementType;
//     text: string;
//     url: string;
//     roles?: string[];
//     permissions?: string[];
// }

export const UserSection = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <button className="w-full max-[510px]:!px-0 flex items-center  rounded text-sidebar-foreground h-auto group">
                        <div className="flex items-center gap-x-2 flex-1 pl-1.5 py-1 rounded-md hover:bg-sidebar-accent/50">
                            <div className="w-7 h-7 rounded-full bg-sidebar-accent overflow-hidden border border-sidebar-border flex justify-center items-center">
                                {/* <img src={"/profile.jpg"} alt={user?.name} className="w-full h-full object-cover" /> */}
                                {
                                    user?.photo_url
                                        ? <img src={user?.photo_url} alt={user?.name} className="w-full h-full object-cover" />
                                        : <User2Icon />
                                }
                            </div>
                            <div className="text-left max-[510px]:hidden">
                                <p className="text-[11px] max-md:text-primary text-white font-black uppercase tracking-tight">{truncateText(user?.name ?? '', 20, '...')}</p>
                                <p className="text-[9px] text-white max-md:text-primary font-bold tracking-tight">{truncateText(user?.email ?? '', 25, '...')}</p>
                            </div>
                        </div>
                        <div
                            className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/8 transition-colors group"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowLogoutDialog(true);
                            }}
                        >
                            <div className="w-7 h-7 rounded-md bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                                <LogOut className="h-3.5 w-3.5 text-destructive" />
                            </div>
                        </div>
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-0 shadow-2xl rounded-md">
                    <div className="relative bg-gradient-to-br from-primary to-primary/80 p-4 flex justify-between items-end">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 overflow-hidden flex items-center justify-center shadow-lg flex-shrink-0">
                                {user?.photo_url
                                    ? <img src={user.photo_url} alt={user.name} className="w-full h-full object-cover" />
                                    : <User2Icon className="h-6 w-6 text-white" />
                                }
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-white truncate">{user?.name ?? '—'}</p>
                                <p className="text-[11px] text-white/70 truncate">{user?.email ?? ''}</p>
                            </div>
                        </div>
                        <div
                            className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/8 transition-colors group mr-12 bg-red-50 hover:bg-red-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowLogoutDialog(true);
                            }}
                        >
                            <div className="w-fit h-fit rounded-md flex items-center justify-center">
                                <LogOut className="h-3.5 w-3.5 text-destructive" />
                            </div>
                            Keluar dari Aplikasi
                        </div>
                    </div>

                    <div className="bg-white -mt-2 rounded-t-2xl relative grid grid-cols-2 divide-x divide-slate-100">
                        <div className="px-3 pt-3 pb-2 flex flex-col">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 pt-1 pb-0.5">
                                {userSections[0]?.label}
                            </p>
                            {userSections[0]?.items.map((item, idx) => (
                                <button
                                    key={idx}
                                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-primary/8 hover:text-primary transition-colors group"
                                    onClick={() => navigate(item.url)}
                                >
                                    <div className="w-7 h-7 rounded-md bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                                        <item.icon className="h-3.5 w-3.5 text-slate-500 group-hover:text-primary" />
                                    </div>
                                    {item.text}
                                </button>
                            ))}

                            <hr className="my-2 border-slate-100" />

                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 pt-1 pb-0.5">
                                {userSections[1]?.label}
                            </p>
                            {userSections[1]?.items.map((item, idx) => (
                                <button
                                    key={idx}
                                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-primary/8 hover:text-primary transition-colors group"
                                    onClick={() => navigate(item.url)}
                                >
                                    <div className="w-7 h-7 rounded-md bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                                        <item.icon className="h-3.5 w-3.5 text-slate-500 group-hover:text-primary" />
                                    </div>
                                    {item.text}
                                </button>
                            ))}
                        </div>
                        <div className="px-3 pt-3 pb-2 flex flex-col">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 pt-1 pb-0.5">
                                {userSections[2]?.label}
                            </p>
                            {userSections[2]?.items.map((item, idx) => (
                                <button
                                    key={idx}
                                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-primary/8 hover:text-primary transition-colors group"
                                    onClick={() => navigate(item.url)}
                                >
                                    <div className="w-7 h-7 rounded-md bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                                        <item.icon className="h-3.5 w-3.5 text-slate-500 group-hover:text-primary" />
                                    </div>
                                    {item.text}
                                </button>
                            ))}
                        </div>

                        {/* Column 2: Manajemen Sistem */}

                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin keluar dari aplikasi? Anda perlu login kembali untuk mengakses sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => logout()} className="bg-destructive hover:bg-destructive/90 text-white">
                            Ya, Keluar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export const SidebarUserSection: React.FC<SidebarUserSectionProps> = ({ collapsed, setCollapsed }) => {
    const { user } = useAuth()

    return (
        <div className={`w-full bottom-0 p-2 border-t`}>
            {collapsed ? (
                <Button
                    variant="ghost"
                    className="w-full px-1.5 py-1 flex items-center justify-center hover:bg-white/5"
                    onClick={() => setCollapsed(false)}
                >
                    <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                            <img src={user?.photo_url || "/profile.jpg"} alt="User" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </Button>
            ) : (
                <UserSection />
            )}
        </div>
    )
}