import React, { useState } from 'react';
import { GotraPayInvoiceEntity } from '@/services/gotrapay-invoice/schema/GotraPayInvoiceSchema';
import {
    useShowGotraPayInvoice,
    useGetGotraPayInvoiceStatus,
    useCreateGotraPayInvoiceCheckout,
    useCreateGotraPayInvoicePayment,
    useSendGotraPayInvoice,
    gotraPayInvoiceQueryKey,
} from '@/services/gotrapay-invoice/hooks/useGotraPayInvoiceCRUD';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
    ExternalLink, 
    RefreshCw, 
    Send, 
    CreditCard, 
    MessageSquare, 
    Mail, 
    AlertCircle,
    CheckCircle2,
    Clock,
    ChevronLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { FloatingInput } from '@/components/FloatingInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    GotraPayInvoicePaymentSchema,
    GotraPayInvoicePaymentPayload,
    GotraPayInvoiceSendPayload,
} from '@/services/gotrapay-invoice/schema/GotraPayInvoiceSchema';

interface Props {
    selectedInvoice: GotraPayInvoiceEntity;
    onBack: () => void;
}

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
    if (status === 'paid') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === 'pending') return <Clock className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
};

const getPaymentBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (status === 'paid') return 'default';
    if (status === 'partial') return 'secondary';
    if (status === 'unpaid') return 'destructive';
    return 'outline';
};

const GotraPayInvoiceDetailContent: React.FC<Props> = ({ selectedInvoice, onBack }) => {
    const queryClient = useQueryClient();
    const invoiceId = selectedInvoice.id;

    const { data: detailData, isLoading: isLoadingDetail } = useShowGotraPayInvoice(invoiceId);
    const { data: statusData, isLoading: isLoadingStatus, refetch: refetchStatus } = useGetGotraPayInvoiceStatus(invoiceId);

    const checkoutMutation = useCreateGotraPayInvoiceCheckout(invoiceId);
    const paymentMutation = useCreateGotraPayInvoicePayment(invoiceId);
    const sendMutation = useSendGotraPayInvoice(invoiceId);

    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showSendDialog, setShowSendDialog] = useState(false);
    const [sendChannels, setSendChannels] = useState({ whatsapp: false, email: false });

    const paymentForm = useForm<GotraPayInvoicePaymentPayload>({
        resolver: zodResolver(GotraPayInvoicePaymentSchema),
        defaultValues: {
            amount: 0,
            paid_at: '',
            method: '',
            reference: '',
            proof_file_id: '',
            note: '',
        },
    });

    const invoice = detailData?.data ?? selectedInvoice;
    const statusInvoice = statusData?.data;

    const handleRefreshStatus = async () => {
        await refetchStatus();
        toast.success('Status diperbarui dari sumber data GotraPay.');
    };

    const handleCreateCheckout = async () => {
        try {
            await checkoutMutation.mutateAsync({
                gateway: '',
                success_redirect_url: '',
                failure_redirect_url: '',
                metadata: [],
                expires_in: 60,
            });
            queryClient.invalidateQueries({ queryKey: [gotraPayInvoiceQueryKey] });
            toast.success('Link pembayaran berhasil dibuat.');
        } catch {
            toast.error('Gagal membuat link pembayaran.');
        }
    };

    const handleSubmitPayment = async (payload: GotraPayInvoicePaymentPayload) => {
        try {
            await paymentMutation.mutateAsync(payload);
            toast.success('Pembayaran manual berhasil dicatat.');
            setShowPaymentDialog(false);
            paymentForm.reset();
        } catch {
            toast.error('Gagal mencatat pembayaran.');
        }
    };

    const handleSend = async () => {
        const channels: string[] = [];
        if (sendChannels.whatsapp) channels.push('whatsapp');
        if (sendChannels.email) channels.push('email');

        if (channels.length === 0) {
            toast.warning('Pilih minimal satu saluran pengiriman.');
            return;
        }

        const payload: GotraPayInvoiceSendPayload = { channels };
        try {
            await sendMutation.mutateAsync(payload);
            toast.success('Invoice berhasil dikirim.');
            setShowSendDialog(false);
        } catch {
            toast.error('Gagal mengirim invoice.');
        }
    };

    return (
        <div className="space-y-6 p-4">
            {/* Back + Header */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
                    <ChevronLeft className="w-4 h-4" /> Kembali
                </Button>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        {invoice.invoice_number || selectedInvoice.invoice_number}
                    </h2>
                    <p className="text-sm text-slate-500">Ref: {invoice.reference || selectedInvoice.reference}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Status Card (source of truth) */}
                <Card className="lg:col-span-1">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Status Terkini</CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleRefreshStatus}
                                disabled={isLoadingStatus}
                                title="Refresh status dari GotraPay"
                            >
                                <RefreshCw className={`w-4 h-4 ${isLoadingStatus ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>
                        <CardDescription className="text-xs">Sumber: GotraPay (authoritative)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {isLoadingStatus ? (
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-5 w-24" />
                            </div>
                        ) : statusInvoice ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <StatusIcon status={statusInvoice.payment_status} />
                                    <Badge variant={getPaymentBadgeVariant(statusInvoice.payment_status)} className="capitalize">
                                        {statusInvoice.payment_status}
                                    </Badge>
                                </div>
                                <div className="text-sm text-slate-600 space-y-1">
                                    <p><span className="font-medium">Status:</span> {statusInvoice.status}</p>
                                    <p><span className="font-medium">Sinkronisasi:</span> {statusInvoice.sync_status}</p>
                                    {statusInvoice.paid_at && (
                                        <p><span className="font-medium">Dibayar:</span> {new Date(statusInvoice.paid_at).toLocaleString('id-ID')}</p>
                                    )}
                                    {statusInvoice.last_error && (
                                        <p className="text-red-500 text-xs"><span className="font-medium">Error:</span> {statusInvoice.last_error}</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-slate-400">Status tidak tersedia.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Invoice Detail Card */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Detail Invoice (Cermin Lokal)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingDetail ? (
                            <div className="space-y-2">
                                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                <div>
                                    <p className="text-slate-500">Customer</p>
                                    <p className="font-medium">{invoice.customer_name}</p>
                                    <p className="text-xs text-slate-500">{invoice.customer_email}</p>
                                    <p className="text-xs text-slate-500">{invoice.customer_phone}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Nominal</p>
                                    <p className="font-bold text-lg">{invoice.currency} {invoice.total}</p>
                                    <p className="text-xs text-slate-500">Dibayar: {invoice.currency} {invoice.amount_paid}</p>
                                    <p className="text-xs text-slate-500">Sisa: {invoice.currency} {invoice.amount_due}</p>
                                </div>
                                <div className="col-span-2 mt-2">
                                    <Separator />
                                </div>
                                {invoice.checkout_url && (
                                    <div className="col-span-2">
                                        <p className="text-slate-500 mb-1">Link Pembayaran</p>
                                        <a
                                            href={invoice.checkout_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary text-xs flex items-center gap-1 hover:underline break-all"
                                        >
                                            {invoice.checkout_url}
                                            <ExternalLink className="w-3 h-3 shrink-0" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Action Buttons */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Aksi Invoice</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    <Button
                        variant="outline"
                        onClick={handleCreateCheckout}
                        disabled={checkoutMutation.isPending}
                        className="gap-2"
                    >
                        <CreditCard className="w-4 h-4" />
                        {checkoutMutation.isPending ? 'Memproses...' : 'Buat Link Pembayaran'}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => setShowPaymentDialog(true)}
                        className="gap-2"
                    >
                        <CreditCard className="w-4 h-4" />
                        Catat Pembayaran Manual
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => setShowSendDialog(true)}
                        className="gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Kirim / Kirim Ulang Invoice
                    </Button>

                    {invoice.checkout_url && (
                        <a href={invoice.checkout_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="default" className="gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Buka Link Pembayaran
                            </Button>
                        </a>
                    )}
                </CardContent>
            </Card>

            {/* Manual Payment Dialog */}
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Catat Pembayaran Manual</DialogTitle>
                        <DialogDescription>
                            Rekam pembayaran manual untuk invoice {invoice.invoice_number}.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={paymentForm.handleSubmit(handleSubmitPayment)} className="space-y-4">
                        <FloatingInput
                            id="pay_amount"
                            label="Jumlah Pembayaran"
                            watch={String(paymentForm.watch('amount'))}
                            error={paymentForm.formState.errors.amount?.message}
                            inputProps={{ ...paymentForm.register('amount', { valueAsNumber: true }), type: 'number' }}
                            required
                        />
                        <FloatingInput
                            id="pay_paid_at"
                            label="Tanggal Pembayaran"
                            watch={paymentForm.watch('paid_at')}
                            error={paymentForm.formState.errors.paid_at?.message}
                            inputProps={{ ...paymentForm.register('paid_at'), type: 'datetime-local' }}
                            required
                        />
                        <FloatingInput
                            id="pay_method"
                            label="Metode Pembayaran"
                            watch={paymentForm.watch('method')}
                            error={paymentForm.formState.errors.method?.message}
                            inputProps={{ ...paymentForm.register('method') }}
                        />
                        <FloatingInput
                            id="pay_reference"
                            label="Nomor Referensi"
                            watch={paymentForm.watch('reference')}
                            error={paymentForm.formState.errors.reference?.message}
                            inputProps={{ ...paymentForm.register('reference') }}
                        />
                        <FloatingInput
                            id="pay_note"
                            label="Catatan"
                            watch={paymentForm.watch('note')}
                            error={paymentForm.formState.errors.note?.message}
                            inputProps={{ ...paymentForm.register('note') }}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowPaymentDialog(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={paymentMutation.isPending}>
                                {paymentMutation.isPending ? 'Menyimpan...' : 'Simpan Pembayaran'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Send Invoice Dialog */}
            <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Kirim Invoice</DialogTitle>
                        <DialogDescription>
                            Pilih saluran pengiriman untuk invoice {invoice.invoice_number}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={sendChannels.whatsapp}
                                onChange={(e) => setSendChannels(prev => ({ ...prev, whatsapp: e.target.checked }))}
                                className="w-4 h-4"
                            />
                            <MessageSquare className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">WhatsApp</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={sendChannels.email}
                                onChange={(e) => setSendChannels(prev => ({ ...prev, email: e.target.checked }))}
                                className="w-4 h-4"
                            />
                            <Mail className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">Email</span>
                        </label>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSendDialog(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleSend} disabled={sendMutation.isPending} className="gap-2">
                            <Send className="w-4 h-4" />
                            {sendMutation.isPending ? 'Mengirim...' : 'Kirim'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default GotraPayInvoiceDetailContent;
