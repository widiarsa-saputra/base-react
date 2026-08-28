import { useAuth } from '@/auth/context/AuthProvider';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useChangePassword } from '@/services/profile/hooks/useChangePassword';
import { ChangePassword, ChangePasswordSchema } from '@/services/profile/schema/ChangePasswordSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { FloatingInput } from '@/components/FloatingInput';
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
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ChangePassword>({
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
                <form onSubmit={handleSubmit(handleValidSubmit)} className='flex flex-col gap-5 pt-3'>
                    <FloatingInput
                        id="old_password"
                        label="Old Password"
                        type={showOldPassword ? 'text' : 'password'}
                        icon={Lock}
                        inputProps={register('old_password')}
                        error={errors.old_password?.message}
                        watch={watch('old_password')}
                        disabled={isPending}
                        required
                        rightSlot={
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-1"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                tabIndex={-1}
                            >
                                {showOldPassword ? <EyeOff className="h-4 w-4 text-slate-500 hover:text-slate-700" /> : <Eye className="h-4 w-4 text-slate-500 hover:text-slate-700" />}
                            </button>
                        }
                    />
                    <FloatingInput
                        id="new_password"
                        label="New Password"
                        type={showNewPassword ? 'text' : 'password'}
                        icon={Lock}
                        inputProps={register('new_password')}
                        error={errors.new_password?.message}
                        watch={watch('new_password')}
                        disabled={isPending}
                        required
                        rightSlot={
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-1"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                tabIndex={-1}
                            >
                                {showNewPassword ? <EyeOff className="h-4 w-4 text-slate-500 hover:text-slate-700" /> : <Eye className="h-4 w-4 text-slate-500 hover:text-slate-700" />}
                            </button>
                        }
                    />
                    <Button disabled={isPending} className="mt-2">Save Changes</Button>
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