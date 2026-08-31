import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";

import { 
    LabelCreatePayload, 
    LabelUpdatePayload,
    LabelEntity
} from "../schema/LabelSchema";

import { 
    LabelListResponseSchema, 
    LabelListResponse,
    LabelShowResponse,
    LabelShowResponseSchema,
    LabelCreateResponseSchema,
    LabelCreateResponse,
    LabelUpdateResponseSchema,
    LabelUpdateResponse
} from "../response/LabelResponse";

export const labelQueryKey = "labels";
const API_VERSION = "v1";

export const useIndexLabels = (params?: object) => {
    return useBaseIndex<LabelListResponse>({
        request: {
            endpoint: `${API_VERSION}/${labelQueryKey}`,
            params,
        },
        schema: LabelListResponseSchema,
        query: {
            key: labelQueryKey,
        },
    });
};

export const useShowLabel = (id: string | number) => {
    return useBaseShow<LabelShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${labelQueryKey}`,
            id: id.toString(),
        },
        schema: LabelShowResponseSchema,
        query: {
            key: labelQueryKey,
        },
    });
};

export const useCreateLabel = () => {
    return useBaseCreate<LabelCreatePayload, LabelCreateResponse, LabelEntity>({
        endpoint: `${API_VERSION}/${labelQueryKey}`,
        schema: LabelCreateResponseSchema,
        queryKey: labelQueryKey,
    });
};

export const useUpdateLabel = (id: string | number) => {
    return useBaseUpdate<LabelUpdatePayload, LabelUpdateResponse, LabelEntity>({
        endpoint: `${API_VERSION}/${labelQueryKey}/${id}`,
        schema: LabelUpdateResponseSchema,
        queryKey: labelQueryKey,
    });
};

export const useDeleteLabel = (id: string | number) => {
    return useBaseDelete<{ id: string | number }, GeneralRes, LabelEntity>({
        endpoint: `${API_VERSION}/${labelQueryKey}/${id}`,
        schema: GeneralResponseSchema,
        queryKey: labelQueryKey,
    });
};
