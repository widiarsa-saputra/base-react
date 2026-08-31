import { z } from "zod";

// ─── Shared Invoice Entity Schema ────────────────────────────────────────────
// Used by index, show, and status endpoints — all return the same shape.
export const GotraPayInvoiceEntitySchema = z.object({
    id: z.string(),
    reference: z.string(),
    invoice_id: z.string(),
    invoice_number: z.string(),
    status: z.string(),
    payment_status: z.string(),
    currency: z.string(),
    total: z.string(),
    amount_paid: z.string(),
    amount_due: z.string(),
    paid_at: z.string().nullable(),
    checkout_url: z.string().nullable(),
    payment_external_id: z.string().nullable(),
    checkout_provider: z.string().nullable(),
    transaction_status: z.string().nullable(),
    application_status: z.string().nullable(),
    checkout_expires_at: z.string().nullable(),
    customer_name: z.string(),
    customer_email: z.string(),
    customer_phone: z.string(),
    sync_status: z.string(),
    last_error: z.string().nullable(),
    synced_at: z.string().nullable(),
    last_checked_at: z.string().nullable(),
    // metadata has no known structure — typed as array of unknown values
    metadata: z.array(z.unknown()),
    created_at: z.string(),
    updated_at: z.string(),
});

export type GotraPayInvoiceEntity = z.infer<typeof GotraPayInvoiceEntitySchema>;

// ─── Create Invoice — nested schemas ─────────────────────────────────────────

export const InvoiceCustomerSchema = z.object({
    id: z.string(),
    name: z.string(),
    legal_name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    tax_number: z.string(),
    city: z.string(),
});

export const InvoiceItemSchema = z.object({
    description: z.string(),
    quantity: z.number(),
    unit_price: z.number(),
    discount_amount: z.number(),
    tax_percent: z.number(),
    sort_order: z.number(),
});

export const InvoiceReceiverSchema = z.object({
    customer_contact_id: z.string(),
    name: z.string(),
    whatsapp_number: z.string(),
    email: z.string(),
    channel_whatsapp: z.boolean(),
    channel_email: z.boolean(),
});

export const InvoicePaymentSchema = z.object({
    gateway: z.string(),
    success_redirect_url: z.string(),
    failure_redirect_url: z.string(),
    metadata: z.array(z.string()),
    expires_in: z.number(),
});

export const InvoiceSendSchema = z.object({
    channels: z.array(z.string()),
});

export const GotraPayInvoiceCreateSchema = z.object({
    reference: z.string().min(1, { message: "Referensi wajib diisi" }),
    division_id: z.string(),
    issue_date: z.string(),
    due_date: z.string(),
    currency: z.string(),
    discount_type: z.string(),
    discount_value: z.number(),
    tax_type: z.string(),
    tax_percent: z.number(),
    shipping_amount: z.number(),
    notes: z.string(),
    terms: z.string(),
    use_customer_as_receiver: z.boolean(),
    sender_profile_id: z.string(),
    email_profile_id: z.string(),
    email_template_id: z.string(),
    customer: InvoiceCustomerSchema,
    label_ids: z.array(z.string()),
    send: InvoiceSendSchema,
    payment: InvoicePaymentSchema,
    items: z.array(InvoiceItemSchema),
    receivers: z.array(InvoiceReceiverSchema),
});

export type GotraPayInvoiceCreatePayload = z.infer<typeof GotraPayInvoiceCreateSchema>;

// ─── Checkout Request Schema ──────────────────────────────────────────────────

export const GotraPayInvoiceCheckoutSchema = z.object({
    gateway: z.string(),
    success_redirect_url: z.string(),
    failure_redirect_url: z.string(),
    metadata: z.array(z.string()),
    expires_in: z.number(),
});

export type GotraPayInvoiceCheckoutPayload = z.infer<typeof GotraPayInvoiceCheckoutSchema>;

// ─── Manual Payment Request Schema ───────────────────────────────────────────

export const GotraPayInvoicePaymentSchema = z.object({
    amount: z.number(),
    paid_at: z.string(),
    method: z.string(),
    reference: z.string(),
    proof_file_id: z.string(),
    note: z.string(),
});

export type GotraPayInvoicePaymentPayload = z.infer<typeof GotraPayInvoicePaymentSchema>;

// ─── Send Invoice Request Schema ──────────────────────────────────────────────

export const GotraPayInvoiceSendSchema = z.object({
    channels: z.array(z.string()),
});

export type GotraPayInvoiceSendPayload = z.infer<typeof GotraPayInvoiceSendSchema>;
