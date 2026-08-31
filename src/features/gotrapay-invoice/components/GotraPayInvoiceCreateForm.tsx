import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { GotraPayInvoiceCreatePayload } from '@/services/gotrapay-invoice/schema/GotraPayInvoiceSchema';
import { FloatingInput, FloatingDateInput } from '@/components/FloatingInput';
import { SwitchComp } from '@/components/CustomComp';
import Combobox from '@/components/Combobox';
import SearchableSelect from '@/shared/components/form/SearchableSelect';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { useIndexLabels } from '@/services/labels/hooks/useLabelCRUD';

interface Props {
    form: UseFormReturn<GotraPayInvoiceCreatePayload>;
    onCancel?: () => void;
}

const GotraPayInvoiceCreateForm: React.FC<Props> = ({ form }) => {
    const { register, control, formState: { errors }, watch } = form;
    const { data: apiLabelsData, isLoading: isLabelsLoading} = useIndexLabels();
    const apiLabels = apiLabelsData?.data;
    const labelOptions = (apiLabels || []).map((label) => ({
        value: label.id,
        label: label.name,
    }));

    const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
        control,
        name: 'items',
    });
    const { fields: receiverFields, append: appendReceiver, remove: removeReceiver } = useFieldArray({
        control,
        name: 'receivers',
    });

    const discountType = watch('discount_type');
    const taxType = watch('tax_type');
    const channels = watch('send.channels') || [];

    return (
        <form id="gotrapay-invoice-form" className="space-y-6">
            {/* Basic Info */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput
                    id="reference"
                    label="Referensi"
                    tooltipMessage="Nomor referensi unik untuk invoice ini."
                    watch={watch('reference')}
                    error={errors.reference?.message}
                    inputProps={{ ...register('reference') }}
                    required
                />
                <FloatingDateInput
                    id="issue_date"
                    label="Tanggal Terbit"
                    tooltipMessage="Tanggal invoice diterbitkan."
                    value={watch('issue_date') ? new Date(watch('issue_date')) : null}
                    onChange={(val) => {
                        form.setValue('issue_date', val ? format(val, 'yyyy-MM-dd') : '');
                        if (val) form.clearErrors('issue_date');
                    }}
                    error={errors.issue_date?.message}
                    required
                />
                <FloatingDateInput
                    id="due_date"
                    label="Tanggal Jatuh Tempo"
                    tooltipMessage="Batas waktu pembayaran invoice."
                    value={watch('due_date') ? new Date(watch('due_date')) : null}
                    onChange={(val) => {
                        form.setValue('due_date', val ? format(val, 'yyyy-MM-dd') : '');
                        if (val) form.clearErrors('due_date');
                    }}
                    error={errors.due_date?.message}
                    required
                />
                <FloatingInput
                    id="division_id"
                    label="Division ID"
                    watch={watch('division_id')}
                    error={errors.division_id?.message}
                    inputProps={{ ...register('division_id') }}
                />
                {/* <FloatingInput
                /> */}
                <Combobox
                    options={(Intl.supportedValuesOf('currency') as string[]).map((c: string) => ({ label: c, value: c }))}
                    id="currency"
                    label="Mata Uang"
                    tooltipMessage="Kode mata uang, contoh: IDR, USD."
                    value={form.watch('currency')}
                    onChange={(opt) => form.setValue('currency', opt.value)}
                    error={errors.currency?.message}
                />
                <FloatingInput
                    id="notes"
                    label="Catatan"
                    watch={watch('notes')}
                    error={errors.notes?.message}
                    inputProps={{ ...register('notes') }}
                />
                <FloatingInput
                    id="terms"
                    label="Syarat & Ketentuan"
                    watch={watch('terms')}
                    error={errors.terms?.message}
                    inputProps={{ ...register('terms') }}
                />
                <FloatingInput
                    id="sender_profile_id"
                    label="Sender Profile ID"
                    watch={watch('sender_profile_id')}
                    error={errors.sender_profile_id?.message}
                    inputProps={{ ...register('sender_profile_id') }}
                />
                <SearchableSelect
                    id="label_ids"
                    label="Label"
                    options={labelOptions}
                    value={watch('label_ids') || []}
                    onChange={(val) => form.setValue('label_ids', val as string[])}
                    isMulti
                    isPending={isLabelsLoading}
                    error={errors.label_ids?.message}
                />
            </section>

            {/* Pengaturan Harga */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Combobox
                    id="discount_type"
                    label="Tipe Diskon"
                    options={[
                        { label: 'Tidak Ada', value: 'none' },
                        { label: 'Nominal (Rp)', value: 'amount' },
                        { label: 'Persentase (%)', value: 'percent' }
                    ]}
                    value={discountType}
                    onChange={(opt) => {
                        form.setValue('discount_type', opt.value as "none" | "amount" | "percent");
                        if (opt.value === 'none') form.setValue('discount_value', 0);
                    }}
                />
                {discountType !== 'none' && (
                    <FloatingInput
                        id="discount_value"
                        label="Nilai Diskon"
                        watch={String(watch('discount_value'))}
                        error={errors.discount_value?.message}
                        inputProps={{ ...register('discount_value', { valueAsNumber: true }), type: 'number', min: 0 }}
                    />
                )}
                <Combobox
                    id="tax_type"
                    label="Tipe Pajak"
                    options={[
                        { label: 'Tidak Ada', value: 'none' },
                        { label: 'Persentase (%)', value: 'percent' }
                    ]}
                    value={taxType}
                    onChange={(opt) => {
                        form.setValue('tax_type', opt.value as "none" | "percent");
                        if (opt.value === 'none') form.setValue('tax_percent', 0);
                    }}
                />
                {taxType !== 'none' && (
                    <FloatingInput
                        id="tax_percent"
                        label="Persentase Pajak"
                        watch={String(watch('tax_percent'))}
                        error={errors.tax_percent?.message}
                        inputProps={{ ...register('tax_percent', { valueAsNumber: true }), type: 'number', min: 0, max: 100 }}
                    />
                )}
                <FloatingInput
                    id="shipping_amount"
                    label="Biaya Pengiriman"
                    watch={String(watch('shipping_amount'))}
                    error={errors.shipping_amount?.message}
                    inputProps={{ ...register('shipping_amount', { valueAsNumber: true }), type: 'number', min: 0 }}
                />
            </section>

            {/* Customer */}
            <section>
                <hgroup className="flex items-center gap-4 w-full mb-3 ">
                    <h3 className="text-sm font-semibold capitalize text-slate-900">
                        Informasi Customer
                    </h3>
                    <Separator className='flex-1' />
                </hgroup>
                <article className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingInput
                        id="customer_name"
                        label="Nama Customer"
                        watch={watch('customer.name')}
                        error={errors.customer?.name?.message}
                        inputProps={{ ...register('customer.name') }}
                        required
                    />
                    <FloatingInput
                        id="customer_email"
                        label="Email Customer"
                        watch={watch('customer.email')}
                        error={errors.customer?.email?.message}
                        inputProps={{ ...register('customer.email'), type: 'email' }}
                        required
                    />
                    <FloatingInput
                        id="customer_phone"
                        label="Nomor Telepon"
                        watch={watch('customer.phone')}
                        error={errors.customer?.phone?.message}
                        inputProps={{ ...register('customer.phone') }}
                    />
                    <FloatingInput
                        id="customer_city"
                        label="Kota"
                        watch={watch('customer.city')}
                        error={errors.customer?.city?.message}
                        inputProps={{ ...register('customer.city') }}
                    />
                    <div className="col-span-full">
                        <FloatingInput
                            id="customer_address"
                            label="Alamat"
                            watch={watch('customer.address')}
                            error={errors.customer?.address?.message}
                            inputProps={{ ...register('customer.address') }}
                        />
                    </div>
                </article>
            </section>

            {/* Receivers (Conditionally rendered) */}
            {!watch('use_customer_as_receiver') && (
                <section>
                    <hgroup className="flex items-center gap-4 w-full mb-3 ">
                        <h3 className="text-sm font-semibold capitalize text-slate-900">
                            Informasi Penerima Tambahan
                        </h3>
                        <Separator className='flex-1' />
                        <button
                            type="button"
                            className="text-xs text-primary font-semibold border border-primary rounded px-3 py-1 hover:bg-primary/10"
                            onClick={() => appendReceiver({
                                customer_contact_id: '',
                                name: '',
                                whatsapp_number: '',
                                email: '',
                                channel_whatsapp: false,
                                channel_email: false,
                            })}
                        >
                            + Tambah Penerima
                        </button>
                    </hgroup>
                    <article className="space-y-3">
                        {receiverFields.map((field, idx) => (
                            <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-lg relative">
                                <FloatingInput
                                    id={`receiver_name_${idx}`}
                                    label="Nama Penerima"
                                    watch={watch(`receivers.${idx}.name`)}
                                    error={errors.receivers?.[idx]?.name?.message}
                                    inputProps={{ ...register(`receivers.${idx}.name`) }}
                                    required
                                />
                                <FloatingInput
                                    id={`receiver_contact_id_${idx}`}
                                    label="Contact ID (Opsional)"
                                    watch={watch(`receivers.${idx}.customer_contact_id`)}
                                    error={errors.receivers?.[idx]?.customer_contact_id?.message}
                                    inputProps={{ ...register(`receivers.${idx}.customer_contact_id`) }}
                                />
                                <FloatingInput
                                    id={`receiver_whatsapp_${idx}`}
                                    label="Nomor WhatsApp"
                                    watch={watch(`receivers.${idx}.whatsapp_number`)}
                                    error={errors.receivers?.[idx]?.whatsapp_number?.message}
                                    inputProps={{ ...register(`receivers.${idx}.whatsapp_number`) }}
                                />
                                <FloatingInput
                                    id={`receiver_email_${idx}`}
                                    label="Email Penerima"
                                    watch={watch(`receivers.${idx}.email`)}
                                    error={errors.receivers?.[idx]?.email?.message}
                                    inputProps={{ ...register(`receivers.${idx}.email`), type: 'email' }}
                                />
                                <div className="col-span-full flex gap-4">
                                    <SwitchComp
                                        label="Kirim via WhatsApp"
                                        checked={watch(`receivers.${idx}.channel_whatsapp`) ?? false}
                                        onCheckedChange={(val) => form.setValue(`receivers.${idx}.channel_whatsapp`, val)}
                                    />
                                    <SwitchComp
                                        label="Kirim via Email"
                                        checked={watch(`receivers.${idx}.channel_email`) ?? false}
                                        onCheckedChange={(val) => form.setValue(`receivers.${idx}.channel_email`, val)}
                                    />
                                </div>
                                <button type="button" onClick={() => removeReceiver(idx)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {receiverFields.length === 0 && (
                            <p className="text-sm text-slate-400 text-center py-4">Belum ada penerima tambahan.</p>
                        )}
                    </article>
                </section>
            )}

            {/* Items */}
            <section>
                <hgroup className="flex items-center gap-4 w-full mb-3 ">
                    <h3 className="text-sm font-semibold capitalize text-slate-900">
                        Item Invoice
                    </h3>
                    <Separator className='flex-1' />
                    <button
                        type="button"
                        className="text-xs text-primary font-semibold border border-primary rounded px-3 py-1 hover:bg-primary/10"
                        onClick={() => appendItem({
                            description: '',
                            quantity: 1,
                            unit_price: 0,
                            discount_amount: 0,
                            tax_percent: 0,
                            sort_order: itemFields.length,
                        })}
                    >
                        + Tambah Item
                    </button>
                </hgroup>
                <article className="space-y-3">
                    {itemFields.map((field, idx) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border rounded-lg">
                            <div className="col-span-full">
                                <FloatingInput
                                    id={`item_description_${idx}`}
                                    label="Deskripsi"
                                    watch={watch(`items.${idx}.description`)}
                                    error={errors.items?.[idx]?.description?.message}
                                    inputProps={{ ...register(`items.${idx}.description`) }}
                                    required
                                />
                            </div>
                            <FloatingInput
                                id={`item_quantity_${idx}`}
                                label="Kuantitas"
                                watch={String(watch(`items.${idx}.quantity`))}
                                error={errors.items?.[idx]?.quantity?.message}
                                inputProps={{ ...register(`items.${idx}.quantity`, { valueAsNumber: true }), type: 'number', min: 1 }}
                            />
                            <FloatingInput
                                id={`item_unit_price_${idx}`}
                                label="Harga Satuan"
                                watch={String(watch(`items.${idx}.unit_price`))}
                                error={errors.items?.[idx]?.unit_price?.message}
                                inputProps={{ ...register(`items.${idx}.unit_price`, { valueAsNumber: true }), type: 'number', min: 0 }}
                            />
                            <FloatingInput
                                id={`item_discount_${idx}`}
                                label="Diskon Item (Rp)"
                                watch={String(watch(`items.${idx}.discount_amount`))}
                                error={errors.items?.[idx]?.discount_amount?.message}
                                inputProps={{ ...register(`items.${idx}.discount_amount`, { valueAsNumber: true }), type: 'number', min: 0 }}
                            />
                            <FloatingInput
                                id={`item_tax_${idx}`}
                                label="Pajak Item (%)"
                                watch={String(watch(`items.${idx}.tax_percent`))}
                                error={errors.items?.[idx]?.tax_percent?.message}
                                inputProps={{ ...register(`items.${idx}.tax_percent`, { valueAsNumber: true }), type: 'number', min: 0, max: 100 }}
                            />
                            <div className="flex items-end">
                                <button type="button" className="text-xs text-red-500 font-semibold border border-red-300 rounded px-3 py-2 hover:bg-red-50 w-full" onClick={() => removeItem(idx)}>
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                    {itemFields.length === 0 && (
                        <p className="text-sm text-slate-400 text-center py-4">
                            Belum ada item. Klik &quot;Tambah Item&quot; untuk menambahkan.
                        </p>
                    )}
                </article>
            </section>

            {/* Options */}
            <section className="flex flex-col gap-3">
                <hgroup className="flex items-center gap-4 w-full mb-3 ">
                    <h3 className="text-sm font-semibold capitalize text-slate-900">
                        Opsi Pengiriman & Pembayaran
                    </h3>
                    <Separator className='flex-1' />
                </hgroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <Combobox
                        id="gateway"
                        label="Payment Gateway"
                        options={[
                            { label: 'Midtrans', value: 'midtrans' },
                            { label: 'Xendit', value: 'xendit' }
                        ]}
                        value={watch('payment.gateway')}
                        onChange={(opt) => form.setValue('payment.gateway', opt.value as "midtrans" | "xendit")}
                    />
                    <div className="flex flex-col gap-2">
                        <Combobox
                            id="channels"
                            label="Channel Pengiriman"
                            options={[
                                { label: 'WhatsApp', value: 'whatsapp' },
                                { label: 'Email', value: 'email' }
                            ]}
                            value={""}
                            onChange={(opt) => {
                                if (!channels.includes(opt.value as "email" | "whatsapp")) {
                                    form.setValue('send.channels', [...channels, opt.value] as ["whatsapp" | "email"]);
                                }
                            }}
                        />
                        {channels.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {channels.map((ch, idx) => (
                                    <Badge key={idx} variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-white" onClick={() => form.setValue('send.channels', channels.filter(c => c !== ch) as ["whatsapp" | "email"])}>
                                        {ch} <X className="w-3 h-3 ml-1" />
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                    <FloatingInput
                        id="email_profile_id"
                        label="Email Profile ID"
                        watch={watch('email_profile_id')}
                        error={errors.email_profile_id?.message}
                        inputProps={{ ...register('email_profile_id') }}
                    />
                    <FloatingInput
                        id="email_template_id"
                        label="Email Template ID"
                        watch={watch('email_template_id')}
                        error={errors.email_template_id?.message}
                        inputProps={{ ...register('email_template_id') }}
                    />
                    <FloatingInput
                        id="success_redirect_url"
                        label="Success Redirect URL"
                        watch={watch('payment.success_redirect_url')}
                        error={errors.payment?.success_redirect_url?.message}
                        inputProps={{ ...register('payment.success_redirect_url') }}
                    />
                    <FloatingInput
                        id="failure_redirect_url"
                        label="Failure Redirect URL"
                        watch={watch('payment.failure_redirect_url')}
                        error={errors.payment?.failure_redirect_url?.message}
                        inputProps={{ ...register('payment.failure_redirect_url') }}
                    />
                    <FloatingInput
                        id="expires_in"
                        label="Expires In (detik)"
                        watch={String(watch('payment.expires_in'))}
                        error={errors.payment?.expires_in?.message}
                        inputProps={{ ...register('payment.expires_in', { valueAsNumber: true }), type: 'number', min: 0 }}
                    />
                </div>
                <SwitchComp
                    label="Gunakan customer sebagai penerima"
                    tooltipMessage="Jika aktif, data customer akan otomatis digunakan sebagai penerima notifikasi."
                    checked={!!watch('use_customer_as_receiver')}
                    onCheckedChange={(val) => form.setValue('use_customer_as_receiver', val)}
                />
            </section>
        </form>
    );
};

export default GotraPayInvoiceCreateForm;
