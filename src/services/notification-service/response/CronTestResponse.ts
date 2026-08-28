import { z } from "zod";

export const SingleCronTestSchema = z.object({
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

export const CronTestListSchema = z.array(SingleCronTestSchema);
export type CronTestEntity = z.infer<typeof SingleCronTestSchema>;
