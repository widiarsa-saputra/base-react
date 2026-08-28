import { useAuth } from '@/auth/context/AuthProvider';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useChangePassword } from '@/services/profile/hooks/useChangePassword';
import { ChangePassword, ChangePasswordSchema } from '@/services/profile/schema/ChangePasswordSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';

const ChangePasswordCard: React.FC = () => {
    const { logout } = useAuth();
    const { mutateAsync, isPending } = useChangePassword();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ChangePassword>({
        resolver: zodResolver(ChangePasswordSchema),
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [pendingFormData, setPendingFormData] = useState<ChangePassword | null>(null);

    // Step 1: form valid → simpan data & tampilkan dialog konfirmasi
    const handleValidSubmit = (formData: ChangePassword) => {
        setPendingFormData(formData);
        setIsConfirmDialogOpen(true);
    };

    // Step 2: user konfirmasi → panggil API → langsung logout
    const handleConfirm = async () => {
        if (!pendingFormData) return;
        try {
            await mutateAsync({ id: 'me', data: pendingFormData });
            reset();
            logout();
        } catch {
            setIsConfirmDialogOpen(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Set a new password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit(handleValidSubmit)} className='flex flex-col gap-4'>
                    <div className="grid gap-2">
                        <label htmlFor="old_password" className="text-sm font-medium">
                            Old Password
                        </label>
                        <div className="relative">
                            <input
                                id="old_password"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder='********'
                                type={showOldPassword ? 'text' : 'password'}
                                {...register("old_password")}
                                disabled={isPending}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                tabIndex={-1}
                            >
                                {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.old_password && (
                            <span className="text-red-500 text-sm">{errors.old_password.message}</span>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="new_password" className="text-sm font-medium">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                id="new_password"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder='********'
                                type={showNewPassword ? 'text' : 'password'}
                                {...register("new_password")}
                                disabled={isPending}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                tabIndex={-1}
                            >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.new_password && (
                            <span className="text-red-500 text-sm">{errors.new_password.message}</span>
                        )}
                    </div>
                    <Button disabled={isPending}>Save Changes</Button>
                </form>
            </CardContent>

            <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Ganti Password</AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda akan mengganti password. Setelah berhasil, Anda akan otomatis logout dan perlu login kembali menggunakan password baru.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
                            {isPending ? 'Memproses...' : 'Ya, Ganti Password'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}

export default ChangePasswordCard