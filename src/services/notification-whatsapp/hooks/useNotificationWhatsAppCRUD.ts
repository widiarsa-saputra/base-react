import useBaseShow from "@/services/base/hooks/useBaseShow";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    NotificationWhatsAppShowResponseSchema,
    NotificationWhatsAppCreateUpdateResponseSchema,
    NotificationWhatsAppShowResponse,
    NotificationWhatsAppCreateUpdateResponse
} from "../response/NotificationWhatsAppResponse";
import {
    NotificationWhatsAppCreateUpdatePayload,
    NotificationWhatsAppSendPayload,
    NotificationWhatsAppEntity
} from "../schema/NotificationWhatsAppSchema";

export const notificationWhatsAppQueryKey = "notification-services/whatsapp";
const API_VERSION = "v1";

export const useIndexWhatsAppSession = (params?: object) => {
    return useBaseShow<NotificationWhatsAppShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${notificationWhatsAppQueryKey}`,
            id: "session",
            params
        },
        schema: NotificationWhatsAppShowResponseSchema,
        query: {
            key: notificationWhatsAppQueryKey,
        },
    });
};

export const useCreateUpdateWhatsAppSession = () => {
    return useBaseCreate<NotificationWhatsAppCreateUpdatePayload, NotificationWhatsAppCreateUpdateResponse, NotificationWhatsAppEntity>({
        endpoint: `${API_VERSION}/${notificationWhatsAppQueryKey}/session`,
        schema: NotificationWhatsAppCreateUpdateResponseSchema,
        queryKey: notificationWhatsAppQueryKey,
    });
};

export const useDeleteWhatsAppSession = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, { id: string | number }>({
        endpoint: () => `${API_VERSION}/${notificationWhatsAppQueryKey}/session`,
        schema: GeneralResponseSchema,
        queryKey: notificationWhatsAppQueryKey,
    });
};

export const useSendWhatsAppMessage = () => {
    return useBaseCreate<NotificationWhatsAppSendPayload, GeneralRes, { id: string | number }>({
        endpoint: `${API_VERSION}/${notificationWhatsAppQueryKey}/send`,
        schema: GeneralResponseSchema,
        queryKey: `${notificationWhatsAppQueryKey}-send`,
    });
};
