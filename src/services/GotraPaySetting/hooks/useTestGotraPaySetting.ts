import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/api/api";
import { GotraPaySettingResponse, GotraPaySettingResponseSchema } from "../response/GotraPaySettingResponse";
import { gotraPaySettingQueryKey } from "./useGetGotraPaySetting";

export const useTestGotraPaySetting = () => {
    const queryClient = useQueryClient();

    return useMutation<GotraPaySettingResponse, Error, void>({
        mutationFn: async () => {
            const response = await privateApi.post(`/v1/gotrapay/settings/test`);
            
            const validationResult = GotraPaySettingResponseSchema.safeParse(response.data);
            if (!validationResult.success) {
                console.error("Validation failed:", validationResult.error.errors);
                throw new Error("Invalid response format");
            }

            return validationResult.data;
        },
        onSuccess: (data) => {
            // Update the setting cache to reflect the latest test result
            queryClient.setQueryData([gotraPaySettingQueryKey, "setting"], data);
        }
    });
};
