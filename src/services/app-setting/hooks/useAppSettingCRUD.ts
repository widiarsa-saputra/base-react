import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";

import { 
    AppSettingCreatePayload, 
    AppSettingUpdatePayload,
    AppSettingEntity
} from "../schema/AppSettingSchema";

import { 
    AppSettingListResponseSchema, 
    AppSettingListResponse,
    AppSettingShowResponse,
    AppSettingShowResponseSchema,
    AppSettingCreateResponseSchema,
    AppSettingCreateResponse,
    AppSettingUpdateResponseSchema,
    AppSettingUpdateResponse
} from "../response/AppSettingResponse";

export const appSettingQueryKey = "app-settings";
const API_VERSION = "v1";

export const useIndexAppSettings = (params?: object) => {
    return useBaseIndex<AppSettingListResponse>({
        request: {
            endpoint: `${API_VERSION}/${appSettingQueryKey}`,
            params,
        },
        schema: AppSettingListResponseSchema,
        query: {
            key: appSettingQueryKey,
        },
    });
};

export const useShowAppSetting = (id: string | number) => {
    return useBaseShow<AppSettingShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${appSettingQueryKey}`,
            id: id.toString(),
        },
        schema: AppSettingShowResponseSchema,
        query: {
            key: appSettingQueryKey,
        },
    });
};

export const useCreateAppSetting = () => {
    return useBaseCreate<AppSettingCreatePayload, AppSettingCreateResponse, AppSettingEntity>({
        endpoint: `${API_VERSION}/${appSettingQueryKey}`,
        schema: AppSettingCreateResponseSchema,
        queryKey: appSettingQueryKey,
    });
};

export const useUpdateAppSetting = () => {
    return useBaseUpdate<AppSettingUpdatePayload, AppSettingUpdateResponse, AppSettingEntity>({
        endpoint: `${API_VERSION}/${appSettingQueryKey}`,
        schema: AppSettingUpdateResponseSchema,
        queryKey: appSettingQueryKey,
    });
};

export const useDeleteAppSetting = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, AppSettingEntity>({
        endpoint: `${API_VERSION}/${appSettingQueryKey}`,
        schema: GeneralResponseSchema,
        queryKey: appSettingQueryKey,
    });
};
