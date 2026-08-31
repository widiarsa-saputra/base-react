import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { GotraPaySettingPayload, GotraPaySettingEntity } from '@/services/GotraPaySetting/schema/GotraPaySettingSchema';
import { FloatingInput } from '@/components/FloatingInput';
import { Switch } from '@/components/ui/switch';
import Combobox from '@/components/Combobox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings2, Save, Loader2, CheckCircle2, XCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useTestGotraPaySetting } from '@/services/GotraPaySetting/hooks/useTestGotraPaySetting';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { onCopy } from '@/lib/utils';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Props {
    form: UseFormReturn<GotraPaySettingPayload>;
    onSubmit: (data: GotraPaySettingPayload) => Promise<void>;
    isPending: boolean;
    entity?: GotraPaySettingEntity | null;
}

const GotraPayGeneralTab: React.FC<Props> = ({ form, onSubmit, isPending, entity }) => {
    const { control, formState: { errors } } = form;
    const { data: testResponse, mutateAsync: testConnection, isPending: isTesting } = useTestGotraPaySetting();

    const currentEntity = testResponse?.data || entity;
    const constructedUrl = (BASE_URL as string).replace('/api', '/gotrapay/webhook');

    return (
        <div className="space-y-4">
            <Card className="border-slate-100 shadow-sm overflow-hidden rounded !gap-0 !p-0">
                <CardHeader className="bg-slate-50/50 border-b p-4 flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle className="text-sm font-black uppercase italic tracking-tight text-brand-navy flex items-center gap-2">
                            <Settings2 className="w-4 h-4" />
                            Konfigurasi Umum
                        </CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase text-slate-400 mt-1">
                            Pengaturan utama untuk integrasi GotraPay
                        </CardDescription>
                    </div>
                    <article className="flex items-center gap-4">
                        <Badge className='bg-slate-100 cursor-pointer hover:bg-slate-100 text-slate-900 p-2 space-x-2' onClick={() => onCopy(constructedUrl)}>
                            <Copy className='w-3.5 h-3.5' />
                            <span>{constructedUrl}</span>
                        </Badge>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={async () => {
                                try {
                                    await testConnection();
                                    toast.success("Uji koneksi berhasil dijalankan.");
                                } catch (e) {
                                    console.error(e)
                                    toast.error("Uji koneksi gagal dijalankan.");
                                }
                            }}
                            disabled={isTesting}
                            className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest gap-2 bg-white"
                        >
                            {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                            Uji Koneksi
                        </Button>
                    </article>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {isTesting ? (
                        <article className="p-4 rounded-lg border mb-6 flex gap-3 bg-slate-50 border-slate-100">
                            <Skeleton className="h-5 w-5 rounded-full shrink-0 mt-0.5 bg-slate-200" />
                            <div className="w-full space-y-2">
                                <Skeleton className="h-3 w-1/3 bg-slate-200" />
                                <Skeleton className="h-2 w-2/3 mt-1 bg-slate-200" />
                                <Skeleton className="h-2 w-1/4 mt-2 bg-slate-200" />
                            </div>
                        </article>
                    ) : currentEntity?.last_tested_at ? (
                        <article className={`p-4 rounded-lg border mb-6 flex gap-3 ${currentEntity.last_test_success
                                ? 'bg-emerald-50 border-emerald-100'
                                : 'bg-rose-50 border-rose-100'
                            }`}>
                            {currentEntity.last_test_success ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                                <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                            )}
                            <div>
                                <h5 className={`text-[10px] font-black uppercase tracking-widest ${currentEntity.last_test_success ? 'text-emerald-700' : 'text-rose-700'
                                    }`}>
                                    Hasil Uji Coba Terakhir
                                </h5>
                                <p className={`text-[9px] font-bold uppercase mt-0.5 leading-relaxed ${currentEntity.last_test_success ? 'text-emerald-600' : 'text-rose-600'
                                    }`}>
                                    {currentEntity.last_test_message || 'Tidak ada pesan pengujian.'}
                                </p>
                                <p className="text-[8px] font-medium text-slate-400 mt-1 uppercase">
                                    {format(new Date(currentEntity.last_tested_at), "d MMMM yyyy 'Pukul' HH:mm", { locale: id })}
                                </p>
                            </div>
                        </article>
                    ) : null}

                    <article className="p-4 bg-slate-50/50 rounded-lg border border-slate-100 mb-6">
                        <div className="flex flex-row items-center justify-between">
                            <div className="space-y-1 mr-4">
                                <label htmlFor="is_enabled" className="text-sm font-black uppercase italic tracking-tight text-brand-navy">
                                    Aktifkan GotraPay
                                </label>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-lg">
                                    Aktifkan opsi ini untuk mengizinkan aplikasi menggunakan GotraPay dalam pemrosesan pembayaran dan pembuatan invoice. Jika dinonaktifkan, GotraPay tidak akan digunakan untuk transaksi pembayaran apa pun di dalam sistem.
                                </p>
                            </div>
                            <Controller
                                control={control}
                                name="is_enabled"
                                render={({ field }) => (
                                    <Switch
                                        id="is_enabled"
                                        checked={!!field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    </article>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingInput
                            id="base_url"
                            label="Base URL"
                            watch={form.watch('base_url')}
                            error={errors.base_url?.message}
                            inputProps={{
                                ...form.register('base_url'),
                                placeholder: "https://invoice.gotrasoft.com"
                            }}
                            required
                        />

                        <Combobox
                            id="default_gateway"
                            label="Default Gateway"
                            options={[
                                { label: 'Midtrans', value: 'midtrans' },
                                { label: 'Xendit', value: 'xendit' }
                            ]}
                            value={form.watch('default_gateway')}
                            onChange={(opt) => form.setValue('default_gateway', opt.value)}
                            error={errors.default_gateway?.message}
                            required
                        />

                        <Combobox
                            id="default_currency"
                            label="Mata Uang Default"
                            options={(Intl.supportedValuesOf('currency') as string[]).map((c: string) => ({ label: c, value: c }))}
                            value={form.watch('default_currency')}
                            onChange={(opt) => form.setValue('default_currency', opt.value)}
                            error={errors.default_currency?.message}
                            required
                        />

                        <FloatingInput
                            id="default_due_days"
                            label="Default Due Days"
                            watch={form.watch('default_due_days')?.toString()}
                            error={errors.default_due_days?.message}
                            inputProps={{
                                ...form.register('default_due_days'),
                                type: "number",
                                min: 0
                            }}
                            required
                        />

                        <FloatingInput
                            id="timeout_seconds"
                            label="Timeout (Detik)"
                            watch={form.watch('timeout_seconds')?.toString()}
                            error={errors.timeout_seconds?.message}
                            inputProps={{
                                ...form.register('timeout_seconds'),
                                type: "number",
                                min: 1
                            }}
                            required
                        />

                        <FloatingInput
                            id="default_expires_in"
                            label="Default Expires In"
                            watch={form.watch('default_expires_in')?.toString()}
                            error={errors.default_expires_in?.message}
                            inputProps={{
                                ...form.register('default_expires_in'),
                                type: "number",
                                min: 1
                            }}
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter className="bg-slate-50/50 border-t p-4 flex justify-end">
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isPending}
                        className="h-9 px-8 text-[10px] font-black uppercase tracking-widest rounded shadow-sm gap-2"
                    >
                        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        Simpan Konfigurasi Umum
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default GotraPayGeneralTab;
