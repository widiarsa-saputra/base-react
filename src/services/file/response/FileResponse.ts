import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { FileEntitySchema, FileStatisticsEntitySchema, FileUsageEntitySchema } from "../schema/FileSchema";

export const FileListResponseSchema = BaseResponseSchema(z.array(FileEntitySchema));
export type FileListResponse = z.infer<typeof FileListResponseSchema>;

export const FileSingleResponseSchema = BaseResponseSchema(FileEntitySchema);
export type FileSingleResponse = z.infer<typeof FileSingleResponseSchema>;

export const FileStatisticsResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: FileStatisticsEntitySchema,
});
export type FileStatisticsResponse = z.infer<typeof FileStatisticsResponseSchema>;

export const FileUsageResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: FileUsageEntitySchema,
});
export type FileUsageResponse = z.infer<typeof FileUsageResponseSchema>;
