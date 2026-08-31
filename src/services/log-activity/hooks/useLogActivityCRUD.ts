import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import {
    LogActivityListResponseSchema,
    LogActivityShowResponseSchema,
    LogActivityListResponse,
    LogActivityShowResponse
} from "../response/LogActivityResponse";

export const logActivityQueryKey = "log-activities";
const API_VERSION = "v1";

export const useIndexLogs = (params?: object) => {
    return useBaseIndex<LogActivityListResponse>({
        request: {
            endpoint: `${API_VERSION}/${logActivityQueryKey}`,
            params,
        },
        schema: LogActivityListResponseSchema,
        query: {
            key: logActivityQueryKey,
        },
    });
};

export const useShowLogs = (id: string | number, params?: object) => {
    return useBaseShow<LogActivityShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${logActivityQueryKey}`,
            id: String(id),
            params
        },
        schema: LogActivityShowResponseSchema,
        query: {
            key: `${logActivityQueryKey}-${id}`,
        },
    });
};
