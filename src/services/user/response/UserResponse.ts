import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { UserIndexSchema } from "../schema/UserSchema";

export const UserListResponseSchema = BaseResponseSchema(z.array(UserIndexSchema));
export type UserListResponse = z.infer<typeof UserListResponseSchema>;

export const UserCreateResponseSchema = BaseResponseSchema(UserIndexSchema);
export type UserCreateResponse = z.infer<typeof UserCreateResponseSchema>;

export const UserUpdateResponseSchema = BaseResponseSchema(UserIndexSchema);
export type UserUpdateResponse = z.infer<typeof UserUpdateResponseSchema>;

export const UserShowResponseSchema = BaseResponseSchema(UserIndexSchema);
export type UserShowResponse = z.infer<typeof UserShowResponseSchema>;
