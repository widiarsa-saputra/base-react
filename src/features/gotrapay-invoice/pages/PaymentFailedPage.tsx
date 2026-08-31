import React from 'react';
import { useSearchParams } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Loader2, RefreshCcw, CheckCircle } from 'lucide-react';
import { useGetPublicGotraPayInvoiceStatus } from '@/services/gotrapay-invoice/hooks/useGetPublicGotraPayInvoiceStatus';
import { GotraPayInvoiceEntity } from '@/services/gotrapay-invoice/schema/GotraPayInvoiceSchema';

const PaymentFailedPage: React.FC = () => {
    const [searchParams] = useSearchParams();

    // Check for common identifier params from gateways
    const invoiceId = searchParams.get('order_id') || searchParams.get('invoice_id') || searchParams.get('id') || searchParams.get('reference') || '';

    const { data: response, isLoading } = useGetPublicGotraPayInvoiceStatus(invoiceId, !!invoiceId);

    const invoice: GotraPayInvoiceEntity | undefined = response?.data;

    if (!invoiceId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <Card className="w-full max-w-md shadow-lg border-0">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <XCircle className="w-16 h-16 text-rose-500 mb-4" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Pembayaran Gagal</h2>
                        <p className="text-slate-500">
                            Terjadi kesalahan pada pembayaran Anda. (ID Invoice tidak ditemukan pada URL).
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm font-medium text-slate-500">Memverifikasi status pembayaran...</p>
                </div>
            </div>
        );
    }

    // Determine the failure state
    // Even if isError is true, we display a generic failure.
    // If we have an invoice, we check its status.
    const isActuallyPaid = invoice && (invoice.payment_status === 'paid' || invoice.payment_status === 'settled' || invoice.payment_status === 'success' || invoice.status === 'paid');

    if (isActuallyPaid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden">
                    <div className="h-2 w-full bg-emerald-500"></div>
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <div className="bg-emerald-100 p-3 rounded-full mb-4">
                            <CheckCircle className="w-12 h-12 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Pembayaran Ternyata Berhasil</h2>
                        <p className="text-slate-500 mb-6">
                            Sistem mendeteksi bahwa pembayaran Anda telah berhasil kami terima meskipun sebelumnya ada indikasi gagal.
                        </p>
                        <div className="bg-slate-50 border rounded-xl p-4 text-left w-full space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">ID Referensi</span>
                                <span className="font-semibold text-slate-700 font-mono text-sm">{invoice?.reference || invoiceId}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden">
                <div className="h-2 w-full bg-rose-500"></div>
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="bg-rose-100 p-3 rounded-full">
                            <XCircle className="w-12 h-12 text-rose-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800">
                        Pembayaran Gagal
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-slate-500 mb-6">
                        Mohon maaf, transaksi Anda tidak dapat diselesaikan atau telah dibatalkan.
                        Silakan periksa kembali metode pembayaran Anda.
                    </p>

                    <div className="bg-slate-50 border rounded-xl p-4 text-left space-y-3">
                        <div className="flex justify-between items-center pb-3 border-b border-dashed">
                            <span className="text-sm text-slate-500">ID Referensi</span>
                            <span className="font-semibold text-slate-700 font-mono text-sm">{invoice?.reference || invoiceId}</span>
                        </div>
                        {invoice?.total && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">Total Tagihan</span>
                                <span className="font-bold text-slate-700">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: invoice.currency || 'IDR', minimumFractionDigits: 0 }).format(Number(invoice.total || 0))}
                                </span>
                            </div>
                        )}
                        {invoice?.last_error && (
                            <div className="pt-3 mt-3 border-t border-rose-100">
                                <span className="text-xs text-rose-500 block mb-1">Keterangan Error:</span>
                                <span className="text-sm text-slate-600 block bg-rose-50 p-2 rounded">{invoice.last_error}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pb-8">
                    {invoice?.checkout_url && (
                        <Button 
                            className="w-full" 
                            size="lg"
                            onClick={() => window.location.href = invoice.checkout_url!}
                        >
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Coba Bayar Lagi
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default PaymentFailedPage;
