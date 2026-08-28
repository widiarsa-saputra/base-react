import { privateApi } from "@/api/api";
import { useMutation } from "@tanstack/react-query";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { z } from "zod";
import { User } from "@/shared/components/facebook-style-chat/types";

const API_VERSION = "v1";

export const useDownloadImportTemplate = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await privateApi.get(`/${API_VERSION}/users/import-template`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'users-import-template.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            return response.data;
        }
    });
};

export const useExportUsers = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await privateApi.get(`/${API_VERSION}/users/export`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            return response.data;
        }
    });
};

export interface ImportUsersPayload {
    file?: File;
    preview_token?: string;
}

export const useImportUsers = () => {
    return useBaseCreate<ImportUsersPayload, any, any>({
        queryKey: 'import-user',
        endpoint: `${API_VERSION}/users/import`,
        contentType: "multipart/form-data",
        schema: z.any(),
    });
};

export interface PreviewImportPayload {
    file: File;
}

export const usePreviewUserImport = () => {
    return useBaseCreate<PreviewImportPayload, any, User>({
        queryKey: 'preview-import-user',
        endpoint: `${API_VERSION}/users/import-preview`,
        contentType: "multipart/form-data",
        schema: z.any(),
    });
};
