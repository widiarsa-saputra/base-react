import { z } from "zod";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const GotraPaySettingPayloadSchema = z.object({
    is_enabled: z.boolean(),
    base_url: z.string().url("Format URL tidak valid"),
    key_id: z.string().min(1, "Key ID wajib diisi"),
    secret: z.string().optional().nullable(),
    webhook_secret: z.string().optional().nullable(),
    default_gateway: z.string().min(1, "Gateway wajib diisi"),
    default_currency: z.string().min(1, "Currency wajib diisi"),
    default_due_days: z.coerce.number().min(0, "Due days minimal 0"),
    timeout_seconds: z.coerce.number().min(1, "Timeout minimal 1 detik"),
    default_expires_in: z.coerce.number().min(1, "Expires in minimal 1 detik"),
});

export const GotraPaySettingEntitySchema = BaseEntitySchema.extend({
    is_enabled: z.boolean(),
    configured: z.boolean(),
    base_url: z.string(),
    key_id: z.string(),
    has_secret: z.boolean(),
    has_webhook_secret: z.boolean(),
    default_gateway: z.string(),
    default_currency: z.string(),
    default_due_days: z.number(),
    timeout_seconds: z.number(),
    default_expires_in: z.number(),
    last_tested_at: z.string().nullable().optional(),
    last_test_success: z.boolean().nullable().optional(),
    last_test_message: z.string().nullable().optional(),
});

export type GotraPaySettingPayload = z.infer<typeof GotraPaySettingPayloadSchema>;
export type GotraPaySettingEntity = z.infer<typeof GotraPaySettingEntitySchema>;
