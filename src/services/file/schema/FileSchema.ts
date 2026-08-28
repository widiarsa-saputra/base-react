import { z } from "zod";

export const FileUploadPayloadSchema = z.object({
    file: z.instanceof(File),
    folder_id: z.number().optional(),
    user_id: z.number().optional(),
    is_compressed: z.boolean().optional().nullable(),
    title: z.string().max(255).optional(),
    description: z.string().max(500).optional().nullable(),
});

export const FileUpdatePayloadSchema = z.object({
    user_id: z.number().optional(),
    title: z.string().max(255).optional(),
    description: z.string().max(500).optional().nullable(),
    visibility: z.enum(["public", "private"]).optional(),
});

export const FileEntitySchema = z.object({
    id: z.string(),
    folder_id: z.number().nullable().optional(),
    user_id: z.string(),
    visibility: z.enum(["public", "private"]).optional(),
    title: z.string().nullable().optional(),
    name: z.string(),
    description: z.string().nullable().optional(),
    size: z.number(),
    mime_type: z.string(),
    ext: z.string(),
    url: z.string(),
    is_compressed: z.boolean().nullable().optional(),
    created_at: z.string(),
    updated_at: z.string(),
    deleted_at: z.string().nullable().optional(),
    size_for_human: z.string().optional(),
    // Relations
    folder: z.any().optional(),
    file_items: z.array(z.any()).optional(),
    posts: z.array(z.any()).optional(),
});

export const FileStatisticsEntitySchema = z.object({
    total_files: z.number(),
    usage_limit: z.number(),
    usage_limit_mb: z.number(),
    usage_limit_formatted: z.string(),
    current_usage: z.number(),
    current_usage_formatted: z.string(),
    current_usage_mb: z.number(),
    usage_percentage: z.number(),
    remaining_space: z.number(),
    remaining_space_formatted: z.string(),
    remaining_space_mb: z.number(),
    is_over_limit: z.boolean(),
    files_by_type: z.array(z.any()),
    files_by_extension: z.array(z.any()),
    storage_usage: z.array(z.any()),
    recent_uploads: z.array(z.any()),
    large_files: z.array(z.any()),
    scope: z.string(),
    user_id: z.string().nullable().optional(),
});

export const FileUsageEntitySchema = z.object({
    usage_limit: z.number(),
    usage_limit_mb: z.number(),
    usage_limit_formatted: z.string(),
    current_usage: z.number(),
    current_usage_formatted: z.string(),
    current_usage_mb: z.number(),
    usage_percentage: z.number(),
    remaining_space: z.number(),
    remaining_space_formatted: z.string(),
    remaining_space_mb: z.number(),
    is_over_limit: z.boolean(),
    scope: z.string(),
    user_id: z.string().nullable().optional(),
});

export type FileUploadPayload = z.infer<typeof FileUploadPayloadSchema>;
export type FileUpdatePayload = z.infer<typeof FileUpdatePayloadSchema>;
export type FileEntity = z.infer<typeof FileEntitySchema>;
export type FileStatisticsEntity = z.infer<typeof FileStatisticsEntitySchema>;
export type FileUsageEntity = z.infer<typeof FileUsageEntitySchema>;
