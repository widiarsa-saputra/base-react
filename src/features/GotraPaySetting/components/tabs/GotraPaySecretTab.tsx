import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { GotraPaySettingPayload } from '@/services/GotraPaySetting/schema/GotraPaySettingSchema';
import { FloatingInput } from '@/components/FloatingInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { KeyRound, ShieldAlert, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    form: UseFormReturn<GotraPaySettingPayload>;
    // Since we don't have a GET hook, we assume the parent might pass the current backend state if it somehow receives it, 
    // or we just rely on form default values. For now, we will just use the form.
    hasSecret?: boolean;
    hasWebhookSecret?: boolean;
    onSubmit: (data: GotraPaySettingPayload) => Promise<void>;
    isPending: boolean;
}

const GotraPaySecretTab: React.FC<Props> = ({ form, hasSecret, hasWebhookSecret, onSubmit, isPending }) => {
    const { formState: { errors } } = form;

    return (
        <div className="space-y-4 p-4 !pt-0">
            <Card className="border-slate-100 shadow-sm overflow-hidden rounded">
                <CardHeader className="bg-slate-50/50 border-b p-4">
                    <CardTitle className="text-sm font-black uppercase italic tracking-tight text-brand-navy flex items-center gap-2">
                        <KeyRound className="w-4 h-4" />
                        Konfigurasi Rahasia
                    </CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase text-slate-400 mt-1">
                        Kredensial keamanan untuk autentikasi API
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-6">
                    <div className="p-3 bg-amber-50 rounded border border-amber-100 flex gap-3">
                        <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-700">Penting</h5>
                            <p className="text-[9px] text-amber-600 font-bold uppercase mt-0.5 leading-relaxed">
                                Secret Key dan Webhook Secret tidak akan ditampilkan di layar untuk alasan keamanan.
                                Kosongkan kolom jika Anda tidak ingin mengubah rahasia saat ini.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <FloatingInput
                            id="key_id"
                            label="Key ID"
                            watch={form.watch('key_id')}
                            error={errors.key_id?.message}
                            inputProps={{
                                ...form.register('key_id')
                            }}
                            required
                        />

                        <div className="space-y-1">
                            <FloatingInput
                                id="secret"
                                label="Secret Key (Opsional)"
                                watch={form.watch('secret') || ''}
                                error={errors.secret?.message}
                                inputProps={{
                                    ...form.register('secret'),
                                    type: 'password',
                                    placeholder: hasSecret ? "******** (Sudah Diatur)" : "Masukkan Secret Key Baru"
                                }}
                            />
                            {hasSecret && (
                                <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 ml-1">
                                    ✓ Secret Key saat ini sudah terkonfigurasi.
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <FloatingInput
                                id="webhook_secret"
                                label="Webhook Secret (Opsional)"
                                watch={form.watch('webhook_secret') || ''}
                                error={errors.webhook_secret?.message}
                                inputProps={{
                                    ...form.register('webhook_secret'),
                                    type: 'password',
                                    placeholder: hasWebhookSecret ? "******** (Sudah Diatur)" : "Masukkan Webhook Secret Baru"
                                }}
                            />
                            {hasWebhookSecret && (
                                <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 ml-1">
                                    ✓ Webhook Secret saat ini sudah terkonfigurasi.
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-slate-50/50 border-t p-4 flex justify-end">
                    <Button 
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isPending}
                        className="h-9 px-8 text-[10px] font-black uppercase tracking-widest rounded shadow-sm gap-2"
                    >
                        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        Simpan Konfigurasi Rahasia
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default GotraPaySecretTab;
