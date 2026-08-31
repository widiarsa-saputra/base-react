import React, { useMemo, useState, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import {
    useIndexGotraPayInvoices,
    gotraPayInvoiceQueryKey,
    useCreateGotraPayInvoice,
} from '@/services/gotrapay-invoice/hooks/useGotraPayInvoiceCRUD';
import { GotraPayInvoiceEntity } from '@/services/gotrapay-invoice/schema/GotraPayInvoiceSchema';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { Badge } from '@/components/ui/badge';
import { Column } from '@/shared/components/table/BaseTable';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { GotraPayInvoiceCreateSchema, GotraPayInvoiceCreatePayload } from '@/services/gotrapay-invoice/schema/GotraPayInvoiceSchema';
import GotraPayInvoiceCreateForm from './GotraPayInvoiceCreateForm';
import { formatter } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
    onSelectInvoice: (invoice: GotraPayInvoiceEntity | null) => void;
    selectedInvoice: GotraPayInvoiceEntity | null
}

const GotraPayInvoiceListContent: React.FC<Props> = ({ onSelectInvoice, selectedInvoice }) => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const queryClient = useQueryClient();

    const { data, isLoading } = useIndexGotraPayInvoices({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useCreateGotraPayInvoice();

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const topbarConfig = useMemo(() => ({
        search: {
            placeholder: 'Cari invoice...',
            value: search,
            onChange: setSearch,
        }
    }), [search]);

    useTopbarActions(topbarConfig);

    const getPaymentStatusVariant = (status: string | null): 'default' | 'secondary' | 'destructive' | 'outline' => {
        if (status === 'paid') return 'default';
        if (status === 'partial') return 'secondary';
        if (status === 'unpaid') return 'destructive';
        return 'outline';
    };

    const columns = useMemo((): Column<GotraPayInvoiceEntity>[] => [
        {
            title: '',
            key: 'selected',
            render: (item) => {
                return (
                    <Checkbox
                        checked={selectedInvoice?.id === item.id}
                        onCheckedChange={() => {
                            if (selectedInvoice?.id === item.id) {
                                onSelectInvoice(null)
                            } else {
                                onSelectInvoice(item)
                            }
                        }}
                    />
                )
            }
        },
        {
            title: 'No. Invoice',
            key: 'invoice_number',
            sortable: true,
            render: (item) => (
                <button
                    type="button"
                    className="text-primary font-semibold hover:underline text-left"
                    onClick={() => onSelectInvoice(item)}
                >
                    {item.invoice_number ?? 'testing'}
                </button>
            ),
        },
        {
            title: 'Referensi',
            key: 'reference',
            sortable: true,
            render: (item) => <span className="text-slate-600">{item.reference || '-'}</span>,
        },
        {
            title: 'Customer',
            key: 'customer_name',
            sortable: true,
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-medium">{item.customer_name}</span>
                    <span className="text-xs text-slate-500">{item.customer_email}</span>
                </div>
            ),
        },
        {
            title: 'Status Pembayaran',
            key: 'payment_status',
            sortable: true,
            render: (item) => {
                if (!item.payment_status && !item.status) return '-';
                return <Badge variant={getPaymentStatusVariant(item.payment_status ?? 'unpaid')} className="capitalize">
                    {item.payment_status}
                </Badge>
            },
        },
        {
            title: 'Status Invoice',
            key: 'status',
            sortable: true,
            render: (item) => {
                if (item.status) {
                    return (
                        <Badge variant="outline" className="capitalize">
                            {item.status}
                        </Badge>
                    )
                }
            },
        },
        {
            title: 'Total',
            key: 'total',
            sortable: true,
            render: (item) => (
                <span className="font-mono font-medium">
                    {formatter(Number(item.total), item.currency || 'IDR')}
                </span>
            ),
        },
        {
            title: 'Tanggal Dibuat',
            key: 'created_at',
            copyValue: false,
            sortable: true,
            render: (item) => new Date(item.created_at).toLocaleString('id-ID'),
        },
    ], [onSelectInvoice]);

    const displayData = Array.isArray(data?.data) ? data.data : [];
    const totalItems = data?.pagination?.total ?? 0;

    const emptyCreateValues: GotraPayInvoiceCreatePayload = {
        reference: '',
        division_id: '',
        issue_date: '',
        due_date: '',
        currency: 'IDR',
        discount_type: 'none',
        discount_value: 0,
        tax_type: 'percent',
        tax_percent: 0,
        shipping_amount: 0,
        notes: '',
        terms: '',
        use_customer_as_receiver: true,
        sender_profile_id: '',
        email_profile_id: '',
        email_template_id: '',
        customer: {
            id: '',
            name: '',
            legal_name: '',
            email: '',
            phone: '',
            address: '',
            tax_number: '',
            city: '',
        },
        label_ids: [],
        send: { channels: [] },
        payment: {
            gateway: 'midtrans',
            success_redirect_url: '',
            failure_redirect_url: '',
            metadata: [],
            expires_in: 60,
        },
        items: [],
        receivers: [],
    };

    return (
        <DataPageTemplate<GotraPayInvoiceEntity, GotraPayInvoiceCreatePayload>
            title="Invoice GotraPay"
            description="Daftar cermin lokal invoice yang tersinkronisasi dari GotraPay."
            columns={columns}
            data={displayData}
            isLoading={isLoading}
            enableColumnToggle
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            sortBy={sortBy}
            sortOrder={sortOrder}
            mutationMode='content'
            handleSort={(newSortBy, newSortOrder) => {
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
            }}
            mutationForm={{
                component: GotraPayInvoiceCreateForm,
                resolver: zodResolver(GotraPayInvoiceCreateSchema),
                emptyValues: emptyCreateValues,
                defaultValues: () => emptyCreateValues,
            }}
            submitActions={{
                add: {
                    label: 'Buat Invoice',
                    modalTitle: 'Buat Invoice Baru',
                    modalDescription: 'Isi informasi invoice yang akan dikirimkan melalui GotraPay.',
                    modalSize: 'lg',
                    onConfirm: async (payload) => {
                        await addMutation.mutateAsync(payload);
                        queryClient.invalidateQueries({ queryKey: [gotraPayInvoiceQueryKey] });
                        toast.success('Berhasil', { description: 'Invoice baru telah dibuat' });
                    },
                },
            }}
        />
    );
};

export default GotraPayInvoiceListContent;
