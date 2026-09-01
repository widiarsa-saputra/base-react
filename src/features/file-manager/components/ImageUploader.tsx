import React, { useState, useCallback, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { Upload, X, CheckCircle, Loader2, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/services/file/hooks/useFileCRUD';

const VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ImageUploader: React.FC = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [compressedFile, setCompressedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);

    const uploadMutation = useFileUpload();

    const handleFile = async (file: File) => {
        if (!VALID_TYPES.includes(file.type)) {
            toast.error('Format file tidak didukung. Harap gunakan JPG, PNG, atau WebP.');
            return;
        }

        setOriginalFile(file);
        setIsCompressing(true);
        setCompressedFile(null);

        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            };

            const compressedBlob = await imageCompression(file, options);
            const newCompressedFile = new File([compressedBlob], file.name, {
                type: compressedBlob.type,
                lastModified: Date.now(),
            });

            setCompressedFile(newCompressedFile);
            setPreviewUrl(URL.createObjectURL(newCompressedFile));
            toast.success('Kompresi gambar berhasil');
        } catch (error) {
            console.error('Error compressing image:', error);
            toast.error('Gagal melakukan kompresi gambar');
            setOriginalFile(null);
        } finally {
            setIsCompressing(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFile(file);
        }
        // Reset input value to allow selecting the same file again
        if (event.target) {
            event.target.value = '';
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFile(file);
        }
    }, []);

    const resetState = () => {
        setOriginalFile(null);
        setCompressedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const handleUpload = async () => {
        if (!compressedFile) return;

        try {
            await uploadMutation.mutateAsync({
                file: compressedFile,
                title: compressedFile.name,
            });
            toast.success('Gambar berhasil di-upload!');
            resetState();
        } catch (error) {
            console.error('Error uploading:', error);
            toast.error('Gagal meng-upload gambar');
        }
    };

    // Cleanup object URL to avoid memory leaks
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Upload Gambar</h2>
                <p className="text-sm text-gray-500">
                    Hanya JPG, PNG, atau WebP (Otomatis dikompres &lt;= 1MB)
                </p>
            </div>

            {!originalFile && !isCompressing && (
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                        isDragging
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                        Tarik & lepas gambar di sini
                    </p>
                    <p className="text-xs text-gray-400 mb-4">Atau klik tombol di bawah</p>
                    <input
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="image-upload"
                    />
                    <label htmlFor="image-upload">
                        <Button type="button" variant="outline" asChild>
                            <span className="cursor-pointer">Pilih Gambar</span>
                        </Button>
                    </label>
                </div>
            )}

            {isCompressing && (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-3" />
                    <p className="text-sm font-medium text-gray-700">Sedang mengompres gambar...</p>
                </div>
            )}

            {compressedFile && !isCompressing && previewUrl && (
                <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-48 object-contain"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                            onClick={resetState}
                            disabled={uploadMutation.isPending}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <ImageIcon className="h-4 w-4 text-blue-500" />
                            <span className="font-medium text-gray-700 truncate" title={originalFile?.name}>
                                {originalFile?.name}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex flex-col">
                                <span className="text-gray-500">Ukuran Asli:</span>
                                <span className="font-medium">{formatFileSize(originalFile?.size || 0)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500">Setelah Kompresi:</span>
                                <span className="font-medium text-green-600 flex items-center gap-1">
                                    {formatFileSize(compressedFile.size)}
                                    <CheckCircle className="h-3 w-3" />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetState}
                            disabled={uploadMutation.isPending}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={uploadMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
                        >
                            {uploadMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Upload
                                </>
                            ) : (
                                'Upload'
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
