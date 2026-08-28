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
import { useQueryClient } from "@tanstack/react-query";
import { GeneralRes, GeneralResponseSchema } from "@/services/base/response/BaseResponseSchema";
const API_VERSION = "v1";

export const useFileIndex = (params?: Record<string, unknown>) => {
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
    return useBaseDelete<{ id: string | number }, GeneralRes, FileEntity>({
        queryKey: 'file-list',
        endpoint: (params) => `${API_VERSION}/files/${params.id}`,
        schema: GeneralResponseSchema,
    });
};

export const useFileRestore = () => {
    const queryClient = useQueryClient();
    return useBaseUpdate<Record<string, never>, GeneralRes, FileEntity>({
        queryKey: 'file-list',
        endpoint: (params) => `${API_VERSION}/files/${params.id}/restore`,
        schema: GeneralResponseSchema,
        query: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['file-list'] });
            }
        }
    });
};

export const useFileForceDelete = () => {
    const queryClient = useQueryClient();
    return useBaseDelete<{ id: string | number }, GeneralRes, FileEntity>({
        queryKey: 'file-list',
        endpoint: (params) => `${API_VERSION}/files/${params.id}/force`,
        schema: GeneralResponseSchema,
        query: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['file-list'] });
            }
        }
    });
};

export const useFileStatistics = (params?: Record<string, unknown>) => {
    return useBaseShow<FileStatisticsResponse>({
        request: {
            endpoint: `${API_VERSION}/files/statistics`,
            id: '',
        },
        schema: FileStatisticsResponseSchema,
        query: {
            key: "file-statistics",
            ...params
        }
    });
};

export const useFileUsage = (params?: Record<string, unknown>) => {
    return useBaseShow<FileUsageResponse>({
        request: {
            endpoint: `${API_VERSION}/files/usage`,
            id: '',
        },
        schema: FileUsageResponseSchema,
        query: {
            key: "file-usage",
            ...params
        }
    });
};
