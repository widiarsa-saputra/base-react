import { z } from "zod";

export const EmailSettingSchema = z.object({
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

export type EmailSetting = z.infer<typeof EmailSettingSchema>;

export const EmailSettingUpdateSchema = z.object({
    host: z.string().min(1, { message: "Wajib diisi" }),
    port: z.coerce.number().min(1, { message: "Wajib diisi" }),
    username: z.string().min(1, { message: "Wajib diisi" }),
    password: z.string().optional(),
    encryption: z.string().min(1, { message: "Wajib diisi" }),
    from_address: z.string().email({ message: "Email tidak valid" }),
    from_name: z.string().min(1, { message: "Wajib diisi" }),
    reply_to_address: z.string().email({ message: "Email tidak valid" }).optional().or(z.literal('')),
    reply_to_name: z.string().optional(),
    timeout: z.coerce.number().optional()
});

export type EmailSettingUpdatePayload = z.infer<typeof EmailSettingUpdateSchema>;
