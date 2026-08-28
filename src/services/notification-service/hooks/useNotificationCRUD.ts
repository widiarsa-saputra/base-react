import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseExternalShow from "@/services/base/hooks/useBaseExternalShow";
import { z } from "zod";

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
    NotificationCronTestIndexResponse, NotificationCronTestIndexResponseSchema,
} from "../response/NotificationResponse";

const API_VERSION = "v1";

// --- Email Settings ---
export const useNotificationEmailSettingShow = () => {
    return useBaseShow<NotificationEmailSettingShowResponse>({
        request: {
            endpoint: `${API_VERSION}/notification-services/email/setting`,
        },
        schema: NotificationEmailSettingShowResponseSchema,
        query: {
            key: "email-setting",
        }
    });
};

export const useNotificationEmailSettingUpdate = () => {
    return useBaseUpdate<NotificationEmailUpdatePayload, any, any>({
        queryKey: 'email-setting',
        endpoint: () => `${API_VERSION}/notification-services/email/setting`,
        schema: z.any(),
    });
};

export const useNotificationEmailSend = () => {
    return useBaseCreate<NotificationEmailSendPayload, any, any>({
        queryKey: 'email-setting',
        endpoint: `${API_VERSION}/notification-services/email/send`,
        schema: z.any(),
    });
};


// --- WhatsApp Settings ---
export const useNotificationWhatsappSessionShow = () => {
    return useBaseShow<NotificationWhatsappSessionShowResponse>({
        request: {
            endpoint: `${API_VERSION}/notification-services/whatsapp/session`,
        },
        schema: NotificationWhatsappSessionShowResponseSchema,
        query: {
            key: "whatsapp-session",
        }
    });
};

export const useNotificationWhatsappSessionUpdate = () => {
    return useBaseUpdate<Record<string, never>, any, any>({
        queryKey: 'whatsapp-session',
        endpoint: () => `${API_VERSION}/notification-services/whatsapp/session`,
        schema: z.any(),
    });
};

export const useNotificationWhatsappSessionDelete = () => {
    return useBaseDelete<any, any>({
        queryKey: 'whatsapp-session',
        endpoint: () => `${API_VERSION}/notification-services/whatsapp/session`,
        schema: z.any(),
    });
};

export const useNotificationWhatsappMessageSend = () => {
    return useBaseCreate<NotificationWhatsappSendPayload, any, any>({
        queryKey: 'whatsapp-session',
        endpoint: `${API_VERSION}/notification-services/whatsapp/send`,
        schema: z.any(),
    });
};

export const useNotificationWhatsappQRGet = (sessionId: string, enabled: boolean = true) => {
    const WA_API_URL = import.meta.env.VITE_WA_API_URL;
    const WA_API_KEY = import.meta.env.VITE_WA_API_KEY;
    const WA_USER = import.meta.env.VITE_WA_USER;

    return useBaseExternalShow<any>({
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
                if (query.state.data?.status === 'ready') return false;
                return 10000;
            }
        },
        schema: z.any(),
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
export const useNotificationCronTestIndex = (params?: any) => {
    return useBaseIndex<any>({
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
    return useBaseShow<any>({
        request: {
            endpoint: `${API_VERSION}/notif-cron-test`,
            id
        },
        schema: z.any(),
        query: {
            key: "cron-test-detail",
            enabled: !!id
        }
    });
};

export const useNotificationCronTestCreate = () => {
    return useBaseCreate<NotificationCronTestCreatePayload, any, any>({
        queryKey: 'cron-test-list',
        endpoint: `${API_VERSION}/notif-cron-test`,
        schema: z.any(),
    });
};
