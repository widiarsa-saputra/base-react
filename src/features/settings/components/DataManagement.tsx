import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, FileSpreadsheet, AlertTriangle, CheckCircle2, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';

import { useExportUsers, useDownloadImportTemplate, usePreviewUserImport, useImportUsers } from '@/services/user/hooks/useUserImportExport';

interface PreviewData {
    preview_token?: string;
    data?: {
        summary?: {
            create?: number;
            update?: number;
            error?: number;
        };
    };
}

const DataManagement: React.FC = () => {
    const exportUsers = useExportUsers();
    const downloadTemplate = useDownloadImportTemplate();
    const previewImport = usePreviewUserImport();
    const importUsers = useImportUsers();

    const [previewData, setPreviewData] = useState<PreviewData | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleExport = async () => {
        try {
            await exportUsers.mutateAsync();
            toast.success("Data berhasil diekspor");
        } catch {
            toast.error("Gagal mengekspor data");
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            await downloadTemplate.mutateAsync();
        } catch {
            toast.error("Gagal mengunduh template");
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        try {
            toast.info("Menganalisis file...");
            const result = await previewImport.mutateAsync({ file });
            setPreviewData(result as PreviewData);
            toast.success("Analisis selesai");
        } catch {
            toast.error("Gagal menganalisis file");
            setSelectedFile(null);
        }
    };

    const handleConfirmImport = async () => {
        if (!previewData?.preview_token) return;

        try {
            await importUsers.mutateAsync({ preview_token: previewData.preview_token });
            toast.success("Impor data berhasil diselesaikan");
            setPreviewData(null);
            setSelectedFile(null);
        } catch {
            toast.error("Gagal menyelesaikan impor");
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Export Data */}
                <Card className="border-slate-100 shadow-sm overflow-hidden rounded">
                    <CardHeader className="bg-slate-50/50 border-b p-4">
                        <CardTitle className="text-sm font-black uppercase italic tracking-tight text-brand-navy">Export System Data</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase text-slate-400 mt-1">Unduh seluruh data sistem dalam format Spreadsheet</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-100 rounded bg-slate-50/30 gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 text-blue-500">
                                <FileSpreadsheet className="h-6 w-6" />
                            </div>
                            <div className="text-center px-4">
                                <p className="text-[11px] font-black uppercase tracking-widest text-slate-600">Download User & Customer Data</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 leading-relaxed">Data akan diekspor dalam format .xlsx (Excel) untuk kebutuhan laporan dan CRM.</p>
                            </div>
                            <Button 
                                onClick={handleExport}
                                disabled={exportUsers.isPending}
                                className="h-9 px-8 text-[10px] font-black uppercase tracking-widest rounded shadow-sm gap-2 "
                            >
                                {exportUsers.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                                Export to Excel (.xlsx)
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Import Data */}
                <Card className="border-slate-100 shadow-sm overflow-hidden rounded">
                    <CardHeader className="bg-slate-50/50 border-b p-4">
                        <CardTitle className="text-sm font-black uppercase italic tracking-tight text-brand-navy">Import User Data</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase text-slate-400 mt-1">Perbarui data pelanggan secara massal</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        {!previewData ? (
                            <div className="space-y-4">
                                <div className="p-3 bg-amber-50 rounded border border-amber-100 flex gap-3">
                                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-700">Perhatian Penting</h5>
                                        <p className="text-[9px] text-amber-600 font-bold uppercase mt-0.5 leading-relaxed">Sistem akan melakukan *upsert* berdasarkan email. Data baru akan dibuat, data lama akan diperbarui.</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Button 
                                        variant="outline" 
                                        onClick={handleDownloadTemplate}
                                        disabled={downloadTemplate.isPending}
                                        className="h-8 text-[9px] font-black uppercase tracking-widest rounded border-slate-200 text-slate-500 italic bg-white shadow-none hover:bg-slate-50 gap-2"
                                    >
                                        {downloadTemplate.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                                        Unduh Template Impor (.xlsx)
                                    </Button>
                                    
                                    <div className="relative group">
                                        <input 
                                            type="file" 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                            accept=".xlsx, .xls, .csv"
                                            onChange={handleFileChange}
                                            disabled={previewImport.isPending}
                                        />
                                        <div className={`border-2 border-dashed ${previewImport.isPending ? 'bg-slate-100 border-slate-200' : 'border-slate-100 bg-slate-50/20 group-hover:bg-slate-50 group-hover:border-brand-navy/20'} rounded p-6 flex flex-col items-center justify-center gap-3 transition-all`}>
                                            {previewImport.isPending ? (
                                                <Loader2 className="h-6 w-6 animate-spin text-brand-navy/40" />
                                            ) : (
                                                <Upload className="h-6 w-6 text-slate-300 group-hover:text-brand-navy/40" />
                                            )}
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {previewImport.isPending ? 'Menganalisis file...' : 'Klik atau seret file ke sini'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <div className="p-4 bg-emerald-50 rounded border border-emerald-100 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Info className="h-4 w-4 text-emerald-600" />
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 italic">Preview Analisis: {selectedFile?.name}</h5>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="bg-white/50 p-2 rounded border border-emerald-100 text-center">
                                            <p className="text-[16px] font-black text-emerald-600 leading-none">{previewData.data?.summary?.create || 0}</p>
                                            <p className="text-[8px] font-black uppercase text-emerald-500 mt-1">Baru</p>
                                        </div>
                                        <div className="bg-white/50 p-2 rounded border border-emerald-100 text-center">
                                            <p className="text-[16px] font-black text-blue-600 leading-none">{previewData.data?.summary?.update || 0}</p>
                                            <p className="text-[8px] font-black uppercase text-blue-500 mt-1">Update</p>
                                        </div>
                                        <div className="bg-white/50 p-2 rounded border border-emerald-100 text-center">
                                            <p className="text-[16px] font-black text-rose-600 leading-none">{previewData.data?.summary?.error || 0}</p>
                                            <p className="text-[8px] font-black uppercase text-rose-500 mt-1">Error</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => { setPreviewData(null); setSelectedFile(null); }}
                                        className="flex-1 h-9 text-[10px] font-black uppercase tracking-widest rounded border-slate-200"
                                    >
                                        Batalkan
                                    </Button>
                                    <Button 
                                        onClick={handleConfirmImport}
                                        disabled={importUsers.isPending}
                                        className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-[10px] font-black uppercase tracking-widest rounded shadow-sm gap-2"
                                    >
                                        {importUsers.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                                        Konfirmasi Impor
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DataManagement;

