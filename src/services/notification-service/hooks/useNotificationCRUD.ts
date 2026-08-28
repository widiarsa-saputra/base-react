import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseExternalShow from "@/services/base/hooks/useBaseExternalShow";
import { z } from "zod";
import { GeneralRes, GeneralResponseSchema } from "@/services/base/response/BaseResponseSchema";

import { 
    NotificationEmailUpdatePayload, 
    NotificationEmailSendPayload,
    NotificationWhatsappSendPayload,
    NotificationWhatsappStatusResponsePayload,
    NotificationWhatsappStatusResponseSchema,
    NotificationCronTestCreatePayload
} from "../schema/NotificationSchema";

import { 
    NotificationEmailSettingShowResponse, NotificationEmailSettingShowResponseSchema,
    NotificationWhatsappSessionShowResponse, NotificationWhatsappSessionShowResponseSchema,
    NotificationCronTestIndexResponseSchema,
} from "../response/NotificationResponse";

const API_VERSION = "v1";

// --- Email Settings ---
export const useNotificationEmailSettingShow = () => {
    return useBaseShow<NotificationEmailSettingShowResponse>({
        request: {
            endpoint: `${API_VERSION}/notification-services/email/setting`,
            id: '',
        },
        schema: NotificationEmailSettingShowResponseSchema,
        query: {
            key: "email-setting",
        }
    });
};

export const useNotificationEmailSettingUpdate = () => {
    return useBaseUpdate<NotificationEmailUpdatePayload, GeneralRes, { id: string }>({
        queryKey: 'email-setting',
        endpoint: () => `${API_VERSION}/notification-services/email/setting`,
        schema: GeneralResponseSchema,
    });
};

export const useNotificationEmailSend = () => {
    return useBaseCreate<NotificationEmailSendPayload, GeneralRes, { id: string }>({
        queryKey: 'email-setting',
        endpoint: `${API_VERSION}/notification-services/email/send`,
        schema: GeneralResponseSchema,
    });
};


// --- WhatsApp Settings ---
export const useNotificationWhatsappSessionShow = () => {
    return useBaseShow<NotificationWhatsappSessionShowResponse>({
        request: {
            endpoint: `${API_VERSION}/notification-services/whatsapp/session`,
            id: '',
        },
        schema: NotificationWhatsappSessionShowResponseSchema,
        query: {
            key: "whatsapp-session",
        }
    });
};

export const useNotificationWhatsappSessionUpdate = () => {
    return useBaseUpdate<Record<string, never>, GeneralRes, { id: string }>({
        queryKey: 'whatsapp-session',
        endpoint: () => `${API_VERSION}/notification-services/whatsapp/session`,
        schema: GeneralResponseSchema,
    });
};

export const useNotificationWhatsappSessionDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, { id: string }>({
        queryKey: 'whatsapp-session',
        endpoint: () => `${API_VERSION}/notification-services/whatsapp/session`,
        schema: GeneralResponseSchema,
    });
};

export const useNotificationWhatsappMessageSend = () => {
    return useBaseCreate<NotificationWhatsappSendPayload, GeneralRes, { id: string }>({
        queryKey: 'whatsapp-session',
        endpoint: `${API_VERSION}/notification-services/whatsapp/send`,
        schema: GeneralResponseSchema,
    });
};

export const useNotificationWhatsappQRGet = (sessionId: string, enabled: boolean = true) => {
    const WA_API_URL = import.meta.env.VITE_WA_API_URL;
    const WA_API_KEY = import.meta.env.VITE_WA_API_KEY;
    const WA_USER = import.meta.env.VITE_WA_USER;

    return useBaseExternalShow<unknown>({
        request: {
            baseURL: WA_API_URL,
            endpoint: "api/auth/qr",
            id: sessionId,
            headers: {
                "x-api-key": WA_API_KEY,
                "x-user": WA_USER
            }
        },
        query: {
            key: "whatsapp-qr",
            enabled: enabled && !!sessionId,
            refetchInterval: (query) => {
                const data = query.state.data as { status?: string } | undefined;
                if (data?.status === 'ready') return false;
                return 10000;
            }
        },
        schema: z.unknown() as z.ZodSchema<unknown>,
    });
};

export const useNotificationWhatsappStatusGet = (sessionId: string, enabled: boolean = true) => {
    const WA_API_URL = import.meta.env.VITE_WA_API_URL;
    const WA_API_KEY = import.meta.env.VITE_WA_API_KEY;
    const WA_USER = import.meta.env.VITE_WA_USER;

    return useBaseExternalShow<NotificationWhatsappStatusResponsePayload>({
        request: {
            baseURL: WA_API_URL,
            endpoint: "api/auth/status",
            id: sessionId,
            headers: {
                "Content-Type": "application/json",
                "x-api-key": WA_API_KEY,
                "x-user": WA_USER
            }
        },
        query: {
            key: "whatsapp-status",
            enabled: enabled && !!sessionId,
            refetchInterval: (query) => {
                if (query.state.data?.status === 'ready') return false;
                return 10000;
            }
        },
        schema: NotificationWhatsappStatusResponseSchema,
    });
};


// --- Cron Test ---
type NotificationCronTestIndexResponse = z.infer<typeof NotificationCronTestIndexResponseSchema>;

export const useNotificationCronTestIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<NotificationCronTestIndexResponse>({
        request: {
            endpoint: `${API_VERSION}/notif-cron-test`,
        },
        schema: NotificationCronTestIndexResponseSchema,
        query: {
            key: "cron-test-list",
            ...params
        }
    });
};

export const useNotificationCronTestShow = (id: string) => {
    return useBaseShow<unknown>({
        request: {
            endpoint: `${API_VERSION}/notif-cron-test`,
            id
        },
        schema: z.unknown() as z.ZodSchema<unknown>,
        query: {
            key: "cron-test-detail",
            enabled: !!id
        }
    });
};

export const useNotificationCronTestCreate = () => {
    return useBaseCreate<NotificationCronTestCreatePayload, GeneralRes, { id: string }>({
        queryKey: 'cron-test-list',
        endpoint: `${API_VERSION}/notif-cron-test`,
        schema: GeneralResponseSchema,
    });
};
