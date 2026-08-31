import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Save, Loader2, ShieldCheck, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FloatingInput } from '@/components/FloatingInput';
import { EmailSettingUpdateSchema, EmailSettingUpdatePayload } from '@/services/notification-service/schema/EmailSettingSchema';

import useShowEmailSetting from '@/services/notification-service/hooks/useShowEmailSetting';
import useUpdateEmailSetting from '@/services/notification-service/hooks/useUpdateEmailSetting';
import useSendEmail from '@/services/notification-service/hooks/useSendEmail';

const EmailSettings: React.FC = () => {
    const { data: settingData, isLoading: isLoadingFetch, refetch } = useShowEmailSetting();
    const updateSetting = useUpdateEmailSetting();
    const sendEmail = useSendEmail();

    const [testTarget, setTestTarget] = useState('');

    const form = useForm<EmailSettingUpdatePayload>({
        resolver: zodResolver(EmailSettingUpdateSchema),
        defaultValues: {
            host: 'mail.jasawebcreator.com',
            port: 587,
            username: 'developer@jasawebcreator.com',
            password: 'developer88',
            encryption: 'tls',
            from_address: 'developer@jasawebcreator.com',
            from_name: 'Booking System',
            reply_to_address: '',
            reply_to_name: '',
            timeout: 30
        }
    });

    const { register, handleSubmit, formState: { errors }, watch, reset } = form;

    useEffect(() => {
        if (settingData?.data?.json) {
            const json = settingData.data.json;
            reset({
                host: json.host || '',
                port: Number(json.port) || 587,
                username: json.username || '',
                password: '', // Password is never returned for security
                encryption: json.encryption || 'tls',
                from_address: json.from_address || '',
                from_name: json.from_name || '',
                reply_to_address: json.reply_to_address || '',
                reply_to_name: json.reply_to_name || '',
                timeout: Number(json.timeout) || 30
            });
        }
    }, [settingData, reset]);

    const handleSendTest = async () => {
        if (!testTarget) {
            toast.error("Alamat email tujuan harus diisi");
            return;
        }

        try {
            await sendEmail.mutateAsync({
                to: testTarget,
                subject: "app_name - Uji Coba Pengaturan SMTP",
                body: "<h1>Koneksi Berhasil!</h1><p>Email ini dikirimkan untuk memastikan konfigurasi SMTP Anda sudah berjalan dengan baik di sistem app_name Web Order.</p>",
                is_html: true
            });
            toast.success("Email percobaan berhasil dikirim ke " + testTarget);
        } catch {
            toast.error("Gagal mengirim email percobaan. Periksa kembali konfigurasi SMTP Anda.");
        }
    };

    const handleSave = async (data: EmailSettingUpdatePayload) => {
        try {
            // Only send password if it's been changed
            const { password, ...payload } = data;
            const finalPayload = password ? data : payload;

            await updateSetting.mutateAsync({
                id: '',
                data: finalPayload
            });
            toast.success("Pengaturan SMTP berhasil diperbarui");
            refetch();
        } catch {
            toast.error("Gagal memperbarui pengaturan");
        }
    };

    if (isLoadingFetch) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* SMTP Configuration */}
                <Card className="border-slate-100 shadow-sm overflow-hidden rounded !p-0">
                    <CardHeader className="bg-slate-50/50 border-b p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-sm font-black uppercase italic tracking-tight text-primary">SMTP Configuration</CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase text-slate-400 mt-1">Konfigurasi pengiriman email sistem</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-7 w-7 p-0 rounded-full">
                                <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                        <form id="email-settings-form" onSubmit={handleSubmit(handleSave)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FloatingInput
                                    id="host"
                                    label="SMTP Host"
                                    inputProps={{ ...register('host'), placeholder: "mail.jasawebcreator.com" }}
                                    error={errors.host?.message}
                                    watch={watch('host')}
                                />
                                <FloatingInput
                                    id="port"
                                    label="Port"
                                    type="number"
                                    inputProps={{ ...register('port'), placeholder: "587" }}
                                    error={errors.port?.message}
                                    watch={watch('port')?.toString()}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FloatingInput
                                    id="username"
                                    label="Username"
                                    inputProps={{ ...register('username'), placeholder: "developer@jasawebcreator.com" }}
                                    error={errors.username?.message}
                                    watch={watch('username')}
                                />
                                <FloatingInput
                                    id="encryption"
                                    label="Encryption"
                                    inputProps={{ ...register('encryption'), placeholder: "tls" }}
                                    error={errors.encryption?.message}
                                    watch={watch('encryption')}
                                />
                            </div>
                            <FloatingInput
                                id="password"
                                label="Password"
                                type="password"
                                inputProps={{
                                    ...register('password'),
                                    placeholder: settingData?.data?.json?.has_password ? "•••••••••••• (Tersimpan)" : "Masukkan Password"
                                }}
                                error={errors.password?.message}
                                watch={watch('password')}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FloatingInput
                                    id="from_address"
                                    label="From Address"
                                    type="email"
                                    inputProps={{ ...register('from_address'), placeholder: "developer@jasawebcreator.com" }}
                                    error={errors.from_address?.message}
                                    watch={watch('from_address')}
                                />
                                <FloatingInput
                                    id="from_name"
                                    label="From Name"
                                    inputProps={{ ...register('from_name'), placeholder: "Booking System" }}
                                    error={errors.from_name?.message}
                                    watch={watch('from_name')}
                                />
                            </div>
                        </form>

                        <div className="flex items-center gap-2 pt-2">
                            <Button
                                type="submit"
                                form="email-settings-form"
                                disabled={updateSetting.isPending}
                                className="bg-primary hover:bg-primary/90 h-8 text-[10px] font-black uppercase tracking-widest rounded shadow-sm gap-2"
                            >
                                {updateSetting.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                                Simpan Konfigurasi
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Email Testing */}
                <Card className="border-slate-100 shadow-sm overflow-hidden rounded !p-0">
                    <CardHeader className="bg-slate-50/50 border-b p-4">
                        <CardTitle className="text-sm font-black uppercase italic tracking-tight text-primary">Email Testing</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase text-slate-400 mt-1">Uji coba pengiriman email</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3 flex flex-col justify-between h-full">
                        <article>
                            <FloatingInput
                                id="testTarget"
                                label="Tujuan Email"
                                type="email"
                                inputProps={{
                                    value: testTarget,
                                    onChange: (e) => setTestTarget(e.target.value),
                                    placeholder: "admin@example.com"
                                }}
                                watch={testTarget}
                            />
                            <div className="p-3 bg-emerald-50 rounded border border-emerald-100 flex gap-3">
                                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Tips Keamanan</h5>
                                    <p className="text-[9px] text-emerald-600 font-bold uppercase mt-0.5 leading-relaxed">Gunakan App Password jika Anda menggunakan Gmail dengan 2FA aktif untuk keamanan maksimal.</p>
                                </div>
                            </div>
                        </article>
                        <Button
                            variant="outline"
                            onClick={handleSendTest}
                            disabled={sendEmail.isPending}
                            className="w-full h-9 text-[10px] font-black uppercase tracking-widest rounded border-slate-200 text-slate-600 gap-2 hover:bg-slate-50"
                        >
                            {sendEmail.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                            Kirim Email Percobaan
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EmailSettings;

