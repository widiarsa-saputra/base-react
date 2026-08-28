import { z } from "zod";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const NotificationEmailSettingSchema = z.object({
    id: z.string(),
    type: z.string(),
    json: z.object({
        mailer: z.string().optional(),
        host: z.string(),
        port: z.union([z.string(), z.number()]),
        username: z.string(),
        encryption: z.string(),
        from_address: z.string(),
        from_name: z.string(),
        reply_to_address: z.string().optional().nullable(),
        reply_to_name: z.string().optional().nullable(),
        timeout: z.union([z.string(), z.number()]).optional(),
        has_password: z.boolean().optional()
    })
});

export const NotificationEmailUpdatePayloadSchema = z.object({
    host: z.string(),
    port: z.number(),
    username: z.string(),
    password: z.string().optional(),
    encryption: z.string(),
    from_address: z.string(),
    from_name: z.string(),
    reply_to_address: z.string().optional(),
    reply_to_name: z.string().optional(),
    timeout: z.number().optional(),
});

export const NotificationEmailSendPayloadSchema = z.object({
    to: z.string(),
    subject: z.string(),
    body: z.string(),
    is_html: z.boolean().optional(),
    cc: z.array(z.string()).optional(),
    bcc: z.array(z.string()).optional(),
});

export const NotificationWhatsappSessionSchema = z.object({
    id: z.string(),
    type: z.string(),
    json: z.object({
        session_id: z.string()
    })
});

export const NotificationWhatsappSendPayloadSchema = z.object({
    phone: z.string(),
    message: z.string(),
});

export const NotificationWhatsappStatusResponseSchema = z.object({
    success: z.boolean().optional(),
    exists: z.boolean().optional(),
    status: z.string().optional(),
    authenticated: z.boolean().optional(),
    message: z.string().optional(),
}).passthrough();

export const NotificationCronTestEntitySchema = z.object({
    id: z.string(),
    whatsapp_to: z.string().nullable(),
    email_to: z.string().nullable(),
    message: z.string(),
    send_at: z.string(),
    status: z.string(),
    processed_at: z.string().nullable(),
    result: z.any().nullable(),
    created_at: z.string(),
    updated_at: z.string()
});

export const NotificationCronTestCreatePayloadSchema = z.object({
    whatsapp_to: z.string().optional(),
    email_to: z.string().optional(),
    message: z.string(),
    minute_to_sent: z.number(),
});

export type NotificationEmailSettingEntity = z.infer<typeof NotificationEmailSettingSchema>;
export type NotificationEmailUpdatePayload = z.infer<typeof NotificationEmailUpdatePayloadSchema>;
export type NotificationEmailSendPayload = z.infer<typeof NotificationEmailSendPayloadSchema>;
export type NotificationWhatsappSessionEntity = z.infer<typeof NotificationWhatsappSessionSchema>;
export type NotificationWhatsappSendPayload = z.infer<typeof NotificationWhatsappSendPayloadSchema>;
export type NotificationWhatsappStatusResponsePayload = z.infer<typeof NotificationWhatsappStatusResponseSchema>;
export type NotificationCronTestEntity = z.infer<typeof NotificationCronTestEntitySchema>;
export type NotificationCronTestCreatePayload = z.infer<typeof NotificationCronTestCreatePayloadSchema>;
