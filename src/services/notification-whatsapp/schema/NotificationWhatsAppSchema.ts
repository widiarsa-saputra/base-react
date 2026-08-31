import { z } from "zod";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const NotificationWhatsAppJsonSchema = z.object({
    session_id: z.string().optional().nullable(),
    webhook_url: z.string().optional().nullable(),
});

export const NotificationWhatsAppIndexSchema = BaseEntitySchema.extend({
    type: z.string().optional().nullable(),
    json: NotificationWhatsAppJsonSchema.optional().nullable(),
});

export const NotificationWhatsAppCreateUpdateSchema = z.object({
    session_id: z.string().min(1, { message: "Session ID wajib diisi" }),
    webhook_url: z.union([z.string().url({ message: "Format URL tidak valid" }), z.literal('')]).optional().nullable(),
});

export const NotificationWhatsAppSendSchema = z.object({
    to: z.string().min(1, { message: "To address wajib diisi" }),
    message: z.string().min(1, { message: "Message wajib diisi" }),
});

export type NotificationWhatsAppJsonEntity = z.infer<typeof NotificationWhatsAppJsonSchema>;
export type NotificationWhatsAppEntity = z.infer<typeof NotificationWhatsAppIndexSchema>;
export type NotificationWhatsAppCreateUpdatePayload = z.infer<typeof NotificationWhatsAppCreateUpdateSchema>;
export type NotificationWhatsAppSendPayload = z.infer<typeof NotificationWhatsAppSendSchema>;
