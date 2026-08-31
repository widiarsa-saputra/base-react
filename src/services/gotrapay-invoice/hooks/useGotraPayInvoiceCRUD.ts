import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/api/api";

import {
    GotraPayInvoiceCreatePayload,
    GotraPayInvoiceCheckoutPayload,
    GotraPayInvoicePaymentPayload,
    GotraPayInvoiceSendPayload,
    GotraPayInvoiceEntity,
} from "../schema/GotraPayInvoiceSchema";

import {
    GotraPayInvoiceListResponse,
    GotraPayInvoiceListResponseSchema,
    GotraPayInvoiceShowResponse,
    GotraPayInvoiceShowResponseSchema,
    GotraPayInvoiceStatusResponse,
    GotraPayInvoiceStatusResponseSchema,
    GotraPayInvoiceCreateResponse,
    GotraPayInvoiceCreateResponseSchema,
    GotraPayInvoiceCheckoutResponse,
    GotraPayInvoiceCheckoutResponseSchema,
    GotraPayInvoicePaymentResponse,
    GotraPayInvoicePaymentResponseSchema,
    GotraPayInvoiceSendResponse,
    GotraPayInvoiceSendResponseSchema,
} from "../response/GotraPayInvoiceResponse";

export const gotraPayInvoiceQueryKey = "gotrapay-invoices";
const API_VERSION = "v1";
const BASE_ENDPOINT = `${API_VERSION}/gotrapay/invoices`;

// ─── Hook 1: Index — local mirror list ───────────────────────────────────────
export const useIndexGotraPayInvoices = (params?: object) => {
    return useBaseIndex<GotraPayInvoiceListResponse>({
        request: {
            endpoint: BASE_ENDPOINT,
            params,
        },
        schema: GotraPayInvoiceListResponseSchema,
        query: {
            key: gotraPayInvoiceQueryKey,
        },
    });
};

// ─── Hook 2: Create Invoice ───────────────────────────────────────────────────
export const useCreateGotraPayInvoice = () => {
    return useBaseCreate<GotraPayInvoiceCreatePayload, GotraPayInvoiceCreateResponse, GotraPayInvoiceEntity>({
        endpoint: BASE_ENDPOINT,
        schema: GotraPayInvoiceCreateResponseSchema,
        queryKey: gotraPayInvoiceQueryKey,
    });
};

// ─── Hook 3: Invoice Status — source of truth ────────────────────────────────
export const useGetGotraPayInvoiceStatus = (invoice: string, enabled: boolean = true) => {
    return useBaseShow<GotraPayInvoiceStatusResponse>({
        request: {
            endpoint: `${BASE_ENDPOINT}/${invoice}`,
            id: "status",
        },
        schema: GotraPayInvoiceStatusResponseSchema,
        query: {
            key: `${gotraPayInvoiceQueryKey}-status`,
            enabled: enabled && !!invoice,
        },
    });
};

// ─── Hook 4: Show Invoice — local mirror detail ───────────────────────────────
export const useShowGotraPayInvoice = (invoice: string, enabled: boolean = true) => {
    return useBaseShow<GotraPayInvoiceShowResponse>({
        request: {
            endpoint: BASE_ENDPOINT,
            id: invoice,
        },
        schema: GotraPayInvoiceShowResponseSchema,
        query: {
            key: `${gotraPayInvoiceQueryKey}-show`,
            enabled: enabled && !!invoice,
        },
    });
};

// ─── Hook 5: Create Checkout Link ────────────────────────────────────────────
export const useCreateGotraPayInvoiceCheckout = (invoice: string) => {
    const queryClient = useQueryClient();

    return useMutation<GotraPayInvoiceCheckoutResponse, Error, GotraPayInvoiceCheckoutPayload>({
        mutationFn: async (payload) => {
            const response = await privateApi.post(
                `/${BASE_ENDPOINT}/${invoice}/checkout`,
                payload
            );
            const result = GotraPayInvoiceCheckoutResponseSchema.safeParse(response.data);
            if (!result.success) {
                console.error("Validation failed:", result.error.errors);
                throw new Error("Invalid checkout response data format");
            }
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [gotraPayInvoiceQueryKey] });
            queryClient.invalidateQueries({ queryKey: [`${gotraPayInvoiceQueryKey}-show`, invoice] });
            queryClient.invalidateQueries({ queryKey: [`${gotraPayInvoiceQueryKey}-status`, invoice] });
        },
    });
};

// ─── Hook 6: Create Manual Payment ───────────────────────────────────────────
export const useCreateGotraPayInvoicePayment = (invoice: string) => {
    const queryClient = useQueryClient();

    return useMutation<GotraPayInvoicePaymentResponse, Error, GotraPayInvoicePaymentPayload>({
        mutationFn: async (payload) => {
            const response = await privateApi.post(
                `/${BASE_ENDPOINT}/${invoice}/payments`,
                payload
            );
            const result = GotraPayInvoicePaymentResponseSchema.safeParse(response.data);
            if (!result.success) {
                console.error("Validation failed:", result.error.errors);
                throw new Error("Invalid payment response data format");
            }
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [gotraPayInvoiceQueryKey] });
            queryClient.invalidateQueries({ queryKey: [`${gotraPayInvoiceQueryKey}-show`, invoice] });
            queryClient.invalidateQueries({ queryKey: [`${gotraPayInvoiceQueryKey}-status`, invoice] });
        },
    });
};

// ─── Hook 7: Send / Resend Invoice ───────────────────────────────────────────
export const useSendGotraPayInvoice = (invoice: string) => {
    const queryClient = useQueryClient();

    return useMutation<GotraPayInvoiceSendResponse, Error, GotraPayInvoiceSendPayload>({
        mutationFn: async (payload) => {
            const response = await privateApi.post(
                `/${BASE_ENDPOINT}/${invoice}/send`,
                payload
            );
            const result = GotraPayInvoiceSendResponseSchema.safeParse(response.data);
            if (!result.success) {
                console.error("Validation failed:", result.error.errors);
                throw new Error("Invalid send response data format");
            }
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [gotraPayInvoiceQueryKey] });
        },
    });
};
