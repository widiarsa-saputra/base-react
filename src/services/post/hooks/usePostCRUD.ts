import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    PostListResponseSchema,
    PostShowResponseSchema,
    PostCreateResponseSchema,
    PostUpdateResponseSchema,
    PostListResponse,
    PostShowResponse,
    PostCreateResponse,
    PostUpdateResponse
} from "../response/PostResponse";
import {
    PostCreatePayload,
    PostUpdatePayload,
    PostEntity
} from "../schema/PostSchema";

export const postQueryKey = "posts";
const API_VERSION = "v1";

export const usePostIndex = (params?: object) => {
    return useBaseIndex<PostListResponse>({
        request: {
            endpoint: `${API_VERSION}/${postQueryKey}`,
            params,
        },
        schema: PostListResponseSchema,
        query: {
            key: postQueryKey,
        },
    });
};

export const usePostShow = (id: string | number, params?: object) => {
    return useBaseShow<PostShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${postQueryKey}`,
            id: String(id),
            params
        },
        schema: PostShowResponseSchema,
        query: {
            key: `${postQueryKey}-${id}`,
        },
    });
};

export const usePostCreate = () => {
    return useBaseCreate<PostCreatePayload, PostCreateResponse, PostEntity>({
        endpoint: `${API_VERSION}/${postQueryKey}`,
        schema: PostCreateResponseSchema,
        queryKey: postQueryKey,
    });
};

export const usePostUpdate = () => {
    return useBaseUpdate<PostUpdatePayload, PostUpdateResponse, PostEntity>({
        endpoint: `${API_VERSION}/${postQueryKey}`,
        schema: PostUpdateResponseSchema,
        queryKey: postQueryKey,
    });
};

export const usePostDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, PostEntity>({
        endpoint: (params) => `${API_VERSION}/${postQueryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey: postQueryKey,
    });
};

export const useDeletePostGallery = () => {
    return useBaseDelete<{ id: string | number; post_id: string | number; file_id: string | number }, GeneralRes, { id: string | number }>({
        endpoint: (params) => `${API_VERSION}/post/${params.post_id}/gallery/${params.file_id}`,
        schema: GeneralResponseSchema,
        queryKey: postQueryKey,
    });
};
