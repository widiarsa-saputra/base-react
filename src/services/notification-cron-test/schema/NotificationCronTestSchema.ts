import { z } from "zod";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const NotificationCronTestResultSchema = z.object({
    whatsapp: z.object({
        status: z.string().optional().nullable(),
    }).optional().nullable(),
    email: z.object({
        status: z.string().optional().nullable(),
    }).optional().nullable(),
});

export const NotificationCronTestIndexSchema = BaseEntitySchema.extend({
    whatsapp_to: z.string().optional().nullable(),
    email_to: z.string().optional().nullable(),
    message: z.string().optional().nullable(),
    send_at: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
    processed_at: z.string().optional().nullable(),
    result: NotificationCronTestResultSchema.optional().nullable(),
});

export const NotificationCronTestCreateSchema = z.object({
    whatsapp_to: z.string().optional().nullable(),
    email_to: z.string().optional().nullable(),
    message: z.string().min(1, { message: "Pesan tidak boleh kosong" }),
    minute_to_sent: z.coerce.number().min(0, { message: "Minimal 0" })
}).refine(data => data.whatsapp_to || data.email_to, {
    message: "Setidaknya isi satu saluran tujuan (WA atau Email)",
    path: ["whatsapp_to"]
});

export type NotificationCronTestResultEntity = z.infer<typeof NotificationCronTestResultSchema>;
export type NotificationCronTestEntity = z.infer<typeof NotificationCronTestIndexSchema>;
export type NotificationCronTestCreatePayload = z.infer<typeof NotificationCronTestCreateSchema>;
