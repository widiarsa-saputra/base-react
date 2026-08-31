import { useBaseUpdateSingleton } from "@/services/base/hooks/useBaseUpdateSingleton";
import { GotraPaySettingPayload } from "../schema/GotraPaySettingSchema";
import { GotraPaySettingResponseSchema, GotraPaySettingResponse } from "../response/GotraPaySettingResponse";

export const gotraPaySettingQueryKey = "gotrapay-setting";
const API_VERSION = "v1";

export const useSaveGotraPaySetting = () => {
    return useBaseUpdateSingleton<GotraPaySettingPayload, GotraPaySettingResponse, GotraPaySettingPayload>({
        endpoint: () => `${API_VERSION}/gotrapay/settings`,
        schema: GotraPaySettingResponseSchema,
        queryKey: gotraPaySettingQueryKey,
    });
};
