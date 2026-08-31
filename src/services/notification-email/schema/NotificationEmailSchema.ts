import { z } from "zod";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const NotificationEmailJsonSchema = z.object({
    mailer: z.string().optional().nullable(),
    host: z.string().optional().nullable(),
    port: z.union([z.string(), z.number()]).optional().nullable(),
    username: z.string().optional().nullable(),
    encryption: z.string().optional().nullable(),
    from_address: z.string().optional().nullable(),
    from_name: z.string().optional().nullable(),
    reply_to_address: z.string().optional().nullable(),
    reply_to_name: z.string().optional().nullable(),
    timeout: z.union([z.string(), z.number()]).optional().nullable(),
    has_password: z.boolean().optional().nullable(),
});

export const NotificationEmailIndexSchema = BaseEntitySchema.extend({
    type: z.string().optional().nullable(),
    json: NotificationEmailJsonSchema.optional().nullable(),
});

export const NotificationEmailCreateSchema = z.object({
    host: z.string().min(1, { message: "Host wajib diisi" }),
    port: z.coerce.number().min(1, { message: "Port wajib diisi" }),
    username: z.string().min(1, { message: "Username wajib diisi" }),
    password: z.string().optional().nullable(),
    encryption: z.string().optional().nullable(),
    from_address: z.string().min(1, { message: "From address wajib diisi" }),
    from_name: z.string().optional().nullable(),
    reply_to_address: z.string().optional().nullable(),
    reply_to_name: z.string().optional().nullable(),
    timeout: z.coerce.number().optional().nullable(),
});

export const NotificationEmailSendSchema = z.object({
    to: z.string().min(1, { message: "To address wajib diisi" }),
    subject: z.string().min(1, { message: "Subject wajib diisi" }),
    body: z.string().min(1, { message: "Body wajib diisi" }),
    is_html: z.boolean().optional().default(true),
    cc: z.array(z.string()).optional().nullable(),
    bcc: z.array(z.string()).optional().nullable(),
});

export type NotificationEmailJsonEntity = z.infer<typeof NotificationEmailJsonSchema>;
export type NotificationEmailEntity = z.infer<typeof NotificationEmailIndexSchema>;
export type NotificationEmailCreatePayload = z.infer<typeof NotificationEmailCreateSchema>;
export type NotificationEmailSendPayload = z.infer<typeof NotificationEmailSendSchema>;
