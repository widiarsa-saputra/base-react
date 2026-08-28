import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FloatingInput, FloatingTextArea } from '@/components/FloatingInput';
import { RefreshCw, Send, Trash2, Smartphone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import useShowWhatsappSession from '@/services/notification-service/hooks/useShowWhatsappSession';
import useUpdateWhatsappSession from '@/services/notification-service/hooks/useUpdateWhatsappSession';
import useDeleteWhatsappSession from '@/services/notification-service/hooks/useDeleteWhatsappSession';
import useSendWhatsappMessage from '@/services/notification-service/hooks/useSendWhatsappMessage';
import useGetWhatsappQR from '@/services/notification-service/hooks/useGetWhatsappQR';
import useGetWhatsappStatus from '@/services/notification-service/hooks/useGetWhatsappStatus';

const WhatsappSettings: React.FC = () => {
    const [testPhone, setTestPhone] = useState('');
    const [testMessage, setTestMessage] = useState('Halo, ini adalah pesan uji coba dari app_name Web Order.');
    const [showQR, setShowQR] = useState(false);
    const [sessionIdInput, setSessionIdInput] = useState('main-session');

    const { data: sessionData, isLoading: isLoadingSession, refetch: refetchSession } = useShowWhatsappSession();
    const updateSession = useUpdateWhatsappSession();
    const deleteSession = useDeleteWhatsappSession();
    const sendMessage = useSendWhatsappMessage();

    useEffect(() => {
        if (sessionData?.data?.json?.session_id) {
            setSessionIdInput(sessionData.data.json.session_id);
        }
    }, [sessionData]);

    const currentSessionId = sessionData?.data?.json?.session_id || sessionIdInput;
    const { data: qrData, isLoading: isLoadingQR } = useGetWhatsappQR(currentSessionId, showQR);
    const { data: waStatus } = useGetWhatsappStatus(currentSessionId, showQR || !!sessionData?.success);

    useEffect(() => {
        if (waStatus?.status === 'ready' && showQR) {
            setShowQR(false);
            toast.success("WhatsApp Berhasil Terhubung!");
            refetchSession();
        }
    }, [waStatus, showQR, refetchSession]);

    const handleConnect = async () => {
        if (!sessionIdInput) {
            toast.error("Session ID tidak boleh kosong");
            return;
        }
        try {
            await updateSession.mutateAsync({ id: 'dummy', data: { session_id: sessionIdInput } });
            setShowQR(true);
            toast.success(`Menyiapkan sesi: ${sessionIdInput}`);
            refetchSession();
        } catch {
            toast.error("Gagal memulai sesi WhatsApp");
        }
    };

    const handleDeleteSession = async () => {
        if (confirm("Apakah Anda yakin ingin memutuskan koneksi WhatsApp?")) {
            try {
                await deleteSession.mutateAsync();
                setShowQR(false);
                toast.success("Koneksi WhatsApp diputuskan");
            } catch {
                toast.error("Gagal memutuskan koneksi");
            }
        }
    };

    const handleSendMessage = async () => {
        if (!testPhone) {
            toast.error("Masukkan nomor tujuan");
            return;
        }
        try {
            await sendMessage.mutateAsync({ to: testPhone, message: testMessage });
            toast.success("Pesan uji coba terkirim");
        } catch {
            toast.error("Gagal mengirim pesan");
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Connection Status Card */}
                <Card className="border-slate-100 shadow-sm overflow-hidden rounded">
                    <CardHeader className="bg-slate-50/50 border-b p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-sm font-black uppercase italic tracking-tight text-brand-navy">WhatsApp Connection</CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase text-slate-400 mt-1">Status koneksi notifikasi WhatsApp</CardDescription>
                            </div>
                            {sessionData?.success ? (
                                <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center gap-1.5 animate-pulse">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Connected</span>
                                </div>
                            ) : (
                                <div className="px-2 py-1 bg-slate-50 text-slate-400 rounded-full border border-slate-100 flex items-center gap-1.5">
                                    <AlertCircle className="h-3 w-3" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Disconnected</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        {isLoadingSession ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-brand-navy" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <FloatingInput 
                                        id="sessionIdInput"
                                        label="Session Identifier"
                                        inputProps={{
                                            value: sessionIdInput,
                                            onChange: (e) => setSessionIdInput(e.target.value),
                                            placeholder: "Contoh: main-session"
                                        }}
                                        watch={sessionIdInput}
                                    />
                                    <p className="text-[8px] font-bold text-slate-400 italic">ID sesi ini digunakan untuk identifikasi perangkat di server WhatsApp.</p>
                                </div>

                                {sessionData?.success ? (
                                    <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span>Active Session ID</span>
                                            <span className="text-brand-navy font-black italic">{sessionData.data.json.session_id}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span>Service Status</span>
                                            <span className={`font-black ${waStatus?.status === 'ready' ? 'text-emerald-600' : 'text-amber-500'}`}>
                                                {waStatus?.status?.toUpperCase() || 'CHECKING...'}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-2 space-y-2">
                                        <div className="mx-auto w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-300">
                                            <Smartphone className="h-5 w-5" />
                                        </div>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase italic">WhatsApp belum terhubung</p>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                    <Button 
                                        onClick={handleConnect}
                                        disabled={updateSession.isPending}
                                        className="flex-1 bg-brand-navy hover:bg-brand-navy/90 h-9 text-[10px] font-black uppercase tracking-widest rounded shadow-sm"
                                    >
                                        {updateSession.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : (sessionData?.success ? <RefreshCw className="h-3 w-3 mr-2" /> : null)}
                                        {sessionData?.success ? 'Update Sesi' : 'Hubungkan WhatsApp'}
                                    </Button>
                                    
                                    {sessionData?.success && (
                                        <Button 
                                            variant="ghost" 
                                            onClick={handleDeleteSession}
                                            className="h-9 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded px-4"
                                        >
                                            <Trash2 className="h-3 w-3 mr-2" />
                                            Disconnect
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}

                        {showQR && (
                            <div className="mt-4 p-4 border-2 border-dashed border-slate-100 rounded bg-white flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
                                <div className="text-center">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600">Scan QR Code</h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 italic">Buka WA &gt; Menu &gt; Perangkat Tertaut</p>
                                </div>
                                
                                {isLoadingQR ? (
                                    <div className="w-48 h-48 bg-slate-50 flex items-center justify-center rounded">
                                        <Loader2 className="h-8 w-8 animate-spin text-brand-navy/20" />
                                    </div>
                                ) : qrData?.qrImage ? (
                                    <div className="p-2 bg-white border border-slate-100 rounded shadow-sm">
                                        <img src={qrData.qrImage} alt="WhatsApp QR" className="w-48 h-48" />
                                    </div>
                                ) : (
                                    <div className="w-48 h-48 bg-rose-50 flex items-center justify-center rounded text-rose-300">
                                        <AlertCircle className="h-8 w-8" />
                                    </div>
                                )}
                                
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setShowQR(false)}
                                    className="text-[9px] font-black uppercase text-slate-400 hover:text-slate-600"
                                >
                                    Batalkan
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* WhatsApp Testing Card */}
                <Card className="border-slate-100 shadow-sm overflow-hidden rounded">
                    <CardHeader className="bg-slate-50/50 border-b p-4">
                        <CardTitle className="text-sm font-black uppercase italic tracking-tight text-brand-navy">WhatsApp Testing</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase text-slate-400 mt-1">Uji coba pengiriman pesan WhatsApp</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="space-y-3">
                            <FloatingInput 
                                id="testPhone"
                                label="Nomor Telepon (ID)"
                                inputProps={{
                                    value: testPhone,
                                    onChange: (e) => setTestPhone(e.target.value),
                                    placeholder: "628123456789"
                                }}
                                watch={testPhone}
                                tooltipMessage="Gunakan format internasional tanpa simbol (contoh: 6281...)"
                            />
                            
                            <FloatingTextArea 
                                id="testMessage"
                                label="Pesan Uji Coba"
                                inputProps={{
                                    value: testMessage,
                                    onChange: (e) => setTestMessage(e.target.value),
                                    rows: 4
                                }}
                                watch={testMessage}
                            />
                        </div>

                        <Button 
                            onClick={handleSendMessage}
                            disabled={sendMessage.isPending || !sessionData?.success}
                            className="w-full bg-brand-navy hover:bg-brand-navy/90 h-9 text-[10px] font-black uppercase tracking-widest rounded shadow-sm gap-2"
                        >
                            {sendMessage.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                            Kirim Pesan Uji Coba
                        </Button>
                        
                        {!sessionData?.success && (
                            <p className="text-[9px] font-bold text-rose-500 uppercase text-center italic">Hubungkan WhatsApp terlebih dahulu untuk melakukan pengujian.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default WhatsappSettings;
