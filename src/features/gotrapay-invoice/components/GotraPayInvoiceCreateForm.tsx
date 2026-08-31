import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { GotraPayInvoiceCreatePayload } from '@/services/gotrapay-invoice/schema/GotraPayInvoiceSchema';
import { FloatingInput } from '@/components/FloatingInput';
import { SwitchComp } from '@/components/CustomComp';
import Combobox from '@/components/Combobox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface Props {
    form: UseFormReturn<GotraPayInvoiceCreatePayload>;
    onCancel?: () => void;
}

const GotraPayInvoiceCreateForm: React.FC<Props> = ({ form }) => {
    const { register, control, formState: { errors }, watch } = form;
    const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
        control,
        name: 'items',
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
                <FloatingInput
                    id="issue_date"
                    label="Tanggal Terbit"
                    tooltipMessage="Tanggal invoice diterbitkan."
                    watch={watch('issue_date')}
                    error={errors.issue_date?.message}
                    inputProps={{ ...register('issue_date'), type: 'date' }}
                    required
                />
                <FloatingInput
                    id="due_date"
                    label="Tanggal Jatuh Tempo"
                    tooltipMessage="Batas waktu pembayaran invoice."
                    watch={watch('due_date')}
                    error={errors.due_date?.message}
                    inputProps={{ ...register('due_date'), type: 'date' }}
                    required
                />
                <FloatingInput
                    id="currency"
                    label="Mata Uang"
                    tooltipMessage="Kode mata uang, contoh: IDR, USD."
                    watch={watch('currency')}
                    error={errors.currency?.message}
                    inputProps={{ ...register('currency') }}
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
            </section>

            {/* Customer */}
            <section>
                <hgroup className="flex items-center gap-4 w-full mb-3 ">
                    <h3 className="text-sm font-semibold capitalize text-slate-900">
                        Informasi Customer
                    </h3>
                    <div className="border-b flex-1"></div>
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

            {/* Items */}
            <section>
                <hgroup className="flex items-center gap-4 w-full mb-3 ">
                    <h3 className="text-sm font-semibold capitalize text-slate-900">
                        Item Invoice
                    </h3>
                    <div className="border-b flex-1"></div>
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
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-lg">
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
                            <div className="flex items-end">
                                <button
                                    type="button"
                                    className="text-xs text-red-500 border border-red-300 rounded px-3 py-2 hover:bg-red-50 w-full"
                                    onClick={() => removeItem(idx)}
                                >
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
            <section className="flex flex-col gap-3 p-4 border rounded-lg">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Opsi Pengiriman & Pembayaran
                </h3>
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
