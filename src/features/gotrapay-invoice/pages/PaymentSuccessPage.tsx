import React from 'react';
import { useSearchParams } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useGetPublicGotraPayInvoiceStatus } from '@/services/gotrapay-invoice/hooks/useGetPublicGotraPayInvoiceStatus';
import { GotraPayInvoiceEntity } from '@/services/gotrapay-invoice/schema/GotraPayInvoiceSchema';

const PaymentSuccessPage: React.FC = () => {
    const [searchParams] = useSearchParams();

    // Check for common identifier params from gateways (Midtrans uses order_id, Xendit might use external_id, etc.)
    const invoiceId = searchParams.get('order_id') || searchParams.get('invoice_id') || searchParams.get('id') || searchParams.get('reference') || '';

    const { data: response, isLoading, isError } = useGetPublicGotraPayInvoiceStatus(invoiceId, !!invoiceId);

    const invoice: GotraPayInvoiceEntity | undefined = response?.data;

    if (!invoiceId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <Card className="w-full max-w-md shadow-lg border-0">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Pembayaran Diterima</h2>
                        <p className="text-slate-500">
                            Terima kasih! Pembayaran Anda telah kami catat. (ID Invoice tidak ditemukan pada URL).
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

    if (isError || !invoice) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <Card className="w-full max-w-md shadow-lg border-0">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Pembayaran Diterima</h2>
                        <p className="text-slate-500 mb-4">
                            Sistem sedang memproses pembayaran Anda. Status terbaru akan segera diupdate.
                        </p>
                        <div className="bg-slate-100 px-4 py-2 rounded-md text-sm font-mono text-slate-600">
                            Ref: {invoiceId}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Check if the payment actually succeeded according to our API
    const isSuccess = invoice.payment_status === 'paid' || invoice.payment_status === 'settled' || invoice.payment_status === 'success' || invoice.status === 'paid';

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden">
                <div className={`h-2 w-full ${isSuccess ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        {isSuccess ? (
                            <div className="bg-emerald-100 p-3 rounded-full">
                                <CheckCircle className="w-12 h-12 text-emerald-600" />
                            </div>
                        ) : (
                            <div className="bg-amber-100 p-3 rounded-full">
                                <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
                            </div>
                        )}
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800">
                        {isSuccess ? 'Pembayaran Berhasil!' : 'Pembayaran Diproses'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-slate-500 mb-6">
                        {isSuccess 
                            ? 'Terima kasih, pembayaran Anda telah berhasil kami terima.' 
                            : 'Pembayaran Anda sedang kami verifikasi dengan pihak bank/gateway. Mohon tunggu beberapa saat.'}
                    </p>

                    <div className="bg-slate-50 border rounded-xl p-4 text-left space-y-3">
                        <div className="flex justify-between items-center pb-3 border-b border-dashed">
                            <span className="text-sm text-slate-500">ID Referensi</span>
                            <span className="font-semibold text-slate-700 font-mono text-sm">{invoice.reference || invoiceId}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-dashed">
                            <span className="text-sm text-slate-500">Total Pembayaran</span>
                            <span className="font-bold text-emerald-600">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: invoice.currency || 'IDR', minimumFractionDigits: 0 }).format(Number(invoice.total || invoice.amount_paid || 0))}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Tanggal</span>
                            <span className="font-medium text-slate-700 text-sm">
                                {invoice.paid_at ? new Date(invoice.paid_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pb-8">
                    {/* Add any public action button if needed, e.g., view public invoice if that exists.
                        Since we are public, we shouldn't link to internal dashboard. */}
                </CardFooter>
            </Card>
        </div>
    );
};

export default PaymentSuccessPage;
