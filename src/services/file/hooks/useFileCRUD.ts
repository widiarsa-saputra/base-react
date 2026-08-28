import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseShow from "@/services/base/hooks/useBaseShow";

import { FileUploadPayload, FileUpdatePayload, FileEntity } from "../schema/FileSchema";
import { 
    FileListResponse, FileListResponseSchema, 
    FileSingleResponse, FileSingleResponseSchema,
    FileStatisticsResponse, FileStatisticsResponseSchema,
    FileUsageResponse, FileUsageResponseSchema
} from "../response/FileResponse";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

const API_VERSION = "v1";

export const useFileIndex = (params?: any) => {
    return useBaseIndex<FileListResponse>({
        request: {
            endpoint: `${API_VERSION}/files`,
        },
        schema: FileListResponseSchema,
        query: {
            key: "file-list",
            ...params
        }
    });
};

export const useFileUpload = () => {
    return useBaseCreate<FileUploadPayload, FileSingleResponse, FileEntity>({
        queryKey: 'file-list',
        endpoint: `${API_VERSION}/files`,
        schema: FileSingleResponseSchema,
        contentType: "multipart/form-data",
    });
};

export const useFileUpdate = () => {
    return useBaseUpdate<FileUpdatePayload, FileSingleResponse, FileEntity>({
        queryKey: 'file-list',
        endpoint: (id) => `${API_VERSION}/files/${id}`,
        schema: FileSingleResponseSchema,
    });
};

export const useFileDelete = () => {
    return useBaseDelete<any, any>({
        queryKey: 'file-list',
        endpoint: (id) => `${API_VERSION}/files/${id}`,
        schema: z.any(),
    });
};

export const useFileRestore = () => {
    const queryClient = useQueryClient();
    return useBaseUpdate<any, any, any>({
        queryKey: 'file-list',
        endpoint: (id) => `${API_VERSION}/files/${id}/restore`,
        schema: z.any(),
        query: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['file-list'] });
            }
        }
    });
};

export const useFileForceDelete = () => {
    const queryClient = useQueryClient();
    return useBaseDelete<any, any>({
        queryKey: 'file-list',
        endpoint: (id) => `${API_VERSION}/files/${id}/force`,
        schema: z.any(),
        query: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['file-list'] });
            }
        }
    });
};

export const useFileStatistics = (params?: any) => {
    return useBaseShow<FileStatisticsResponse>({
        request: {
            endpoint: `${API_VERSION}/files/statistics`,
        },
        schema: FileStatisticsResponseSchema,
        query: {
            key: "file-statistics",
            ...params
        }
    });
};

export const useFileUsage = (params?: any) => {
    return useBaseShow<FileUsageResponse>({
        request: {
            endpoint: `${API_VERSION}/files/usage`,
        },
        schema: FileUsageResponseSchema,
        query: {
            key: "file-usage",
            ...params
        }
    });
};
