import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/api";
import { GotraPayInvoiceStatusResponse, GotraPayInvoiceStatusResponseSchema } from "../response/GotraPayInvoiceResponse";
import { gotraPayInvoiceQueryKey } from "./useGotraPayInvoiceCRUD";

export const useGetPublicGotraPayInvoiceStatus = (invoice: string, enabled: boolean = true) => {
    return useQuery<GotraPayInvoiceStatusResponse, Error>({
        queryKey: [`${gotraPayInvoiceQueryKey}-status-public`, invoice],
        enabled: enabled && !!invoice,
        retry: import.meta.env.VITE_MAX_RETRY ? parseInt(import.meta.env.VITE_MAX_RETRY) : 3,
        queryFn: async () => {
            if (!invoice) throw new Error("Invoice ID is required");

            const response = await publicApi.get(`/v1/gotrapay/invoices/${invoice}/status`);

            const validationResult = GotraPayInvoiceStatusResponseSchema.safeParse(response.data);
            if (!validationResult.success) {
                console.error(
                    `Validation failed for public invoice status:`,
                    validationResult.error.errors
                );
                throw new Error("Invalid public invoice status data format");
            }

            return validationResult.data;
        },
    });
};
