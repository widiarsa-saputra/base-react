import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    UserCreatePayload,
    UserEntity,
    UserUpdatePayload
} from "../schema/UserSchema";
import {
    UserListResponseSchema,
    UserCreateResponseSchema,
    UserUpdateResponseSchema,
    UserShowResponseSchema,
    UserListResponse,
    UserShowResponse,
    UserCreateResponse,
    UserUpdateResponse
} from "../response/UserResponse";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";

const queryKey = "users";
const API_VERSION = "v1";

export const useUserIndex = (params?: object) => {
    return useBaseIndex<UserListResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params: {
                ...params
            },
        },
        schema: UserListResponseSchema,
        query: {
            key: queryKey,
        },
    });
};

export const useUserShow = (id: string | number, params?: object) => {
    return useBaseShow<UserShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
            params
        },
        schema: UserShowResponseSchema,
        query: {
            key: `${queryKey}-${id}`,
        },
    });
};

export const useUserCreate = () => {
    return useBaseCreate<UserCreatePayload, UserCreateResponse, UserEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: UserCreateResponseSchema,
        queryKey,
    });
};

export const useUserUpdate = () => {
    return useBaseUpdate<UserUpdatePayload, UserUpdateResponse, UserEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: UserUpdateResponseSchema,
        queryKey,
    });
};

export const useUserDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, UserEntity>({
        endpoint: (params) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey,
    });
};
