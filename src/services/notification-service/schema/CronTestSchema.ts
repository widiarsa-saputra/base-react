import { z } from "zod";

export const CronTestCreateSchema = z.object({
    whatsapp_to: z.string().optional().nullable(),
    email_to: z.string().optional().nullable(),
    message: z.string().min(1, { message: "Pesan tidak boleh kosong" }),
    minute_to_sent: z.coerce.number().min(0, { message: "Minimal 0" })
}).refine(data => data.whatsapp_to || data.email_to, {
    message: "Setidaknya isi satu saluran tujuan (WA atau Email)",
    path: ["whatsapp_to"]
});

export type CronTestCreatePayload = z.infer<typeof CronTestCreateSchema>;
