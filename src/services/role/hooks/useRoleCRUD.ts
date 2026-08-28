import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    RoleCreatePayload,
    RoleEntity,
    RoleUpdatePayload
} from "../schema/RoleSchema";
import {
    RoleListResponseSchema,
    RoleCreateResponseSchema,
    RoleUpdateResponseSchema,
    RoleShowResponseSchema,
    RoleListResponse,
    RoleShowResponse,
    RoleCreateResponse,
    RoleUpdateResponse
} from "../response/RoleResponse";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";

const queryKey = "roles";
const API_VERSION = "v1";

export const useRoleIndex = (params?: object) => {
    return useBaseIndex<RoleListResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: RoleListResponseSchema,
        query: {
            key: queryKey,
        },
    });
};

export const useRoleShow = (id: string | number, params?: object) => {
    return useBaseShow<RoleShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
            params
        },
        schema: RoleShowResponseSchema,
        query: {
            key: `${queryKey}-${id}`,
        },
    });
};

export const useRoleCreate = () => {
    return useBaseCreate<RoleCreatePayload, RoleCreateResponse, RoleEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: RoleCreateResponseSchema,
        queryKey,
    });
};

export const useRoleUpdate = () => {
    return useBaseUpdate<RoleUpdatePayload, RoleUpdateResponse, RoleEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: RoleUpdateResponseSchema,
        queryKey,
    });
};

export const useRoleDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, RoleEntity>({
        endpoint: (params) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey,
    });
};
