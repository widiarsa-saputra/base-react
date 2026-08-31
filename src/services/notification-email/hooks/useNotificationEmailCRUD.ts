import useBaseShow from "@/services/base/hooks/useBaseShow";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    NotificationEmailShowResponseSchema,
    NotificationEmailCreateResponseSchema,
    NotificationEmailShowResponse,
    NotificationEmailCreateResponse
} from "../response/NotificationEmailResponse";
import {
    NotificationEmailCreatePayload,
    NotificationEmailSendPayload,
    NotificationEmailEntity
} from "../schema/NotificationEmailSchema";

export const notificationEmailQueryKey = "notification-services/email";
const API_VERSION = "v1";

export const useShowSMPTConfig = (id: string | number = "setting", params?: object) => {
    return useBaseShow<NotificationEmailShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${notificationEmailQueryKey}`,
            id: String(id),
            params
        },
        schema: NotificationEmailShowResponseSchema,
        query: {
            key: `${notificationEmailQueryKey}-${id}`,
        },
    });
};

export const useCreateSMTPConfig = () => {
    return useBaseCreate<NotificationEmailCreatePayload, NotificationEmailCreateResponse, NotificationEmailEntity>({
        endpoint: `${API_VERSION}/${notificationEmailQueryKey}`,
        schema: NotificationEmailCreateResponseSchema,
        queryKey: notificationEmailQueryKey,
    });
};

export const useSendEmail = () => {
    return useBaseCreate<NotificationEmailSendPayload, GeneralRes, { id: string | number }>({
        endpoint: `${API_VERSION}/${notificationEmailQueryKey}/send`,
        schema: GeneralResponseSchema,
        queryKey: `${notificationEmailQueryKey}-send`,
    });
};
