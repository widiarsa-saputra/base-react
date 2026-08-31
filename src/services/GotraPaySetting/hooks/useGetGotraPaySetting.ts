import useBaseShow from "@/services/base/hooks/useBaseShow";
import { GotraPaySettingResponse, GotraPaySettingResponseSchema } from "../response/GotraPaySettingResponse";

export const gotraPaySettingQueryKey = "gotrapay-setting";
const API_VERSION = "v1";

export const useGetGotraPaySetting = () => {
    return useBaseShow<GotraPaySettingResponse>({
        request: {
            endpoint: `${API_VERSION}/gotrapay`,
            id: "setting"
        },
        schema: GotraPaySettingResponseSchema,
        query: {
            key: gotraPaySettingQueryKey
        }
    });
};
