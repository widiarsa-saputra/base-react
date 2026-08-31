import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    CourseCreatePayload,
    CourseEntity,
    CourseUpdatePayload
} from "../schema/CourseSchema";
import {
    CourseListResponseSchema,
    CourseCreateResponseSchema,
    CourseUpdateResponseSchema,
    CourseShowResponseSchema,
    CourseListResponse,
    CourseShowResponse,
    CourseCreateResponse,
    CourseUpdateResponse
} from "../response/CourseResponse";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";

export const courseQueryKey = "courses";
const API_VERSION = "v1";

export const useCourseIndex = (params?: object) => {
    return useBaseIndex<CourseListResponse>({
        request: {
            endpoint: `${API_VERSION}/${courseQueryKey}`,
            params,
        },
        schema: CourseListResponseSchema,
        query: {
            key: courseQueryKey,
        },
    });
};

export const useCourseShow = (id: string | number, params?: object) => {
    return useBaseShow<CourseShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${courseQueryKey}`,
            id: String(id),
            params
        },
        schema: CourseShowResponseSchema,
        query: {
            key: `${courseQueryKey}-${id}`,
        },
    });
};

export const useCourseCreate = () => {
    return useBaseCreate<CourseCreatePayload, CourseCreateResponse, CourseEntity>({
        endpoint: `${API_VERSION}/${courseQueryKey}`,
        schema: CourseCreateResponseSchema,
        queryKey: courseQueryKey,
    });
};

export const useCourseUpdate = () => {
    return useBaseUpdate<CourseUpdatePayload, CourseUpdateResponse, CourseEntity>({
        endpoint: `${API_VERSION}/${courseQueryKey}`,
        schema: CourseUpdateResponseSchema,
        queryKey: courseQueryKey,
    });
};

export const useCourseDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, CourseEntity>({
        endpoint: (params) => `${API_VERSION}/${courseQueryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey: courseQueryKey,
    });
};
