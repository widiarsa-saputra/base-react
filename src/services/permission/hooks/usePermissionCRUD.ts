import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    PermissionCreatePayload,
    PermissionEntity,
    PermissionUpdatePayload
} from "../schema/PermissionSchema";
import {
    PermissionListResponseSchema,
    PermissionCreateResponseSchema,
    PermissionUpdateResponseSchema,
    PermissionShowResponseSchema,
    PermissionListResponse,
    PermissionShowResponse,
    PermissionCreateResponse,
    PermissionUpdateResponse
} from "../response/PermissionResponse";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";

const queryKey = "permissions";
const API_VERSION = "v1";

export const usePermissionIndex = (params?: object) => {
    return useBaseIndex<PermissionListResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: PermissionListResponseSchema,
        query: {
            key: queryKey,
        },
    });
};

export const usePermissionShow = (id: string | number, params?: object) => {
    return useBaseShow<PermissionShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
            params
        },
        schema: PermissionShowResponseSchema,
        query: {
            key: `${queryKey}-${id}`,
        },
    });
};

export const usePermissionCreate = () => {
    return useBaseCreate<PermissionCreatePayload, PermissionCreateResponse, PermissionEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: PermissionCreateResponseSchema,
        queryKey,
    });
};

export const usePermissionUpdate = () => {
    return useBaseUpdate<PermissionUpdatePayload, PermissionUpdateResponse, PermissionEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: PermissionUpdateResponseSchema,
        queryKey,
    });
};

export const usePermissionDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, PermissionEntity>({
        endpoint: (params) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey,
    });
};
