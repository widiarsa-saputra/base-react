import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { PostIndexSchema } from "../schema/PostSchema";

export const PostListResponseSchema = BaseResponseSchema(z.array(PostIndexSchema));
export type PostListResponse = z.infer<typeof PostListResponseSchema>;

export const PostShowResponseSchema = BaseResponseSchema(PostIndexSchema);
export type PostShowResponse = z.infer<typeof PostShowResponseSchema>;

export const PostCreateResponseSchema = BaseResponseSchema(PostIndexSchema);
export type PostCreateResponse = z.infer<typeof PostCreateResponseSchema>;

export const PostUpdateResponseSchema = BaseResponseSchema(PostIndexSchema);
export type PostUpdateResponse = z.infer<typeof PostUpdateResponseSchema>;
