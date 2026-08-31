import { z } from "zod";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";
import { FileEntitySchema } from "@/services/file/schema/FileSchema";

export const PostCreateSchema = z.object({
    title: z.string().min(1, { message: "Judul wajib diisi" }),
    content: z.string().min(1, { message: "Konten wajib diisi" }),
    image_file_id: z.union([z.string(), z.number()]).optional().nullable(),
});

export const PostUpdateSchema = PostCreateSchema.partial();

export const PostIndexSchema = BaseEntitySchema.extend({
    title: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
    image_file_id: z.union([z.string(), z.number()]).optional().nullable(),
    file: FileEntitySchema.optional().nullable(),
});

export type PostCreatePayload = z.infer<typeof PostCreateSchema>;
export type PostUpdatePayload = z.infer<typeof PostUpdateSchema>;
export type PostEntity = z.infer<typeof PostIndexSchema>;
