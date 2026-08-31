import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { GotraPaySettingPayload } from "../schema/GotraPaySettingSchema";
import { GotraPaySettingResponseSchema, GotraPaySettingResponse } from "../response/GotraPaySettingResponse";

export const gotraPaySettingQueryKey = "gotrapay-setting";
const API_VERSION = "v1";

export const useSaveGotraPaySetting = () => {
    return useBaseUpdate<GotraPaySettingPayload, GotraPaySettingResponse, { id: string | number }>({
        endpoint: () => `${API_VERSION}/gotrapay/setting`,
        schema: GotraPaySettingResponseSchema,
        queryKey: gotraPaySettingQueryKey,
    });
};
