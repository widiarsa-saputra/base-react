import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { GotraPayInvoiceEntitySchema } from "../schema/GotraPayInvoiceSchema";

// List response — array of invoice entities
export const GotraPayInvoiceListResponseSchema = BaseResponseSchema(
    z.array(GotraPayInvoiceEntitySchema)
);
export type GotraPayInvoiceListResponse = z.infer<typeof GotraPayInvoiceListResponseSchema>;

// Show/Detail response — single invoice entity
export const GotraPayInvoiceShowResponseSchema = BaseResponseSchema(GotraPayInvoiceEntitySchema);
export type GotraPayInvoiceShowResponse = z.infer<typeof GotraPayInvoiceShowResponseSchema>;

// Status response — single invoice entity (source of truth for status)
export const GotraPayInvoiceStatusResponseSchema = BaseResponseSchema(GotraPayInvoiceEntitySchema);
export type GotraPayInvoiceStatusResponse = z.infer<typeof GotraPayInvoiceStatusResponseSchema>;

// Create response — single invoice entity
export const GotraPayInvoiceCreateResponseSchema = BaseResponseSchema(GotraPayInvoiceEntitySchema);
export type GotraPayInvoiceCreateResponse = z.infer<typeof GotraPayInvoiceCreateResponseSchema>;

// Checkout response — single invoice entity
export const GotraPayInvoiceCheckoutResponseSchema = BaseResponseSchema(GotraPayInvoiceEntitySchema);
export type GotraPayInvoiceCheckoutResponse = z.infer<typeof GotraPayInvoiceCheckoutResponseSchema>;

// Payment response — single invoice entity
export const GotraPayInvoicePaymentResponseSchema = BaseResponseSchema(GotraPayInvoiceEntitySchema);
export type GotraPayInvoicePaymentResponse = z.infer<typeof GotraPayInvoicePaymentResponseSchema>;

// Send response — single invoice entity
export const GotraPayInvoiceSendResponseSchema = BaseResponseSchema(GotraPayInvoiceEntitySchema);
export type GotraPayInvoiceSendResponse = z.infer<typeof GotraPayInvoiceSendResponseSchema>;
