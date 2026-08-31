import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import {
    NotificationCronTestListResponseSchema,
    NotificationCronTestShowResponseSchema,
    NotificationCronTestCreateResponseSchema,
    NotificationCronTestListResponse,
    NotificationCronTestShowResponse,
    NotificationCronTestCreateResponse
} from "../response/NotificationCronTestResponse";
import {
    NotificationCronTestCreatePayload,
    NotificationCronTestEntity
} from "../schema/NotificationCronTestSchema";

export const notificationCronTestQueryKey = "notif-cron-test";
const API_VERSION = "v1";

export const useIndexNotificationCronTest = (params?: object) => {
    return useBaseIndex<NotificationCronTestListResponse>({
        request: {
            endpoint: `${API_VERSION}/${notificationCronTestQueryKey}`,
            params,
        },
        schema: NotificationCronTestListResponseSchema,
        query: {
            key: notificationCronTestQueryKey,
        },
    });
};

export const useShowNotificationCronTest = (id: string | number, params?: object) => {
    return useBaseShow<NotificationCronTestShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${notificationCronTestQueryKey}`,
            id: String(id),
            params
        },
        schema: NotificationCronTestShowResponseSchema,
        query: {
            key: `${notificationCronTestQueryKey}-${id}`,
        },
    });
};

export const useCreateNotificationCronTest = () => {
    return useBaseCreate<NotificationCronTestCreatePayload, NotificationCronTestCreateResponse, NotificationCronTestEntity>({
        endpoint: `${API_VERSION}/${notificationCronTestQueryKey}`,
        schema: NotificationCronTestCreateResponseSchema,
        queryKey: notificationCronTestQueryKey,
    });
};
