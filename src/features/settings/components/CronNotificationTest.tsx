import React, { useMemo, useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { Badge } from '@/components/ui/badge';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';

import useIndexCronTest from '@/services/notification-service/hooks/useIndexCronTest';
import useCreateCronTest from '@/services/notification-service/hooks/useCreateCronTest';
import { CronTestCreateSchema, CronTestCreatePayload } from '@/services/notification-service/schema/CronTestSchema';
import { CronTestEntity } from '@/services/notification-service/response/CronTestResponse';
import CronTestMutationForm from './CronTestMutationForm';

const CronNotificationTest: React.FC = () => {
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const { data: response, isLoading } = useIndexCronTest({
        search: debouncedSearch,
        page,
        paginate: itemsPerPage
    });

    useTopbarActions({
        search: {
            value: search,
            onChange: (value: string) => {
                setSearch(value);
                const timeout = setTimeout(() => {
                    setDebouncedSearch(value);
                }, 500);
                return () => clearTimeout(timeout);
            },
            placeholder: 'Cari riwayat test...',
        },
    });

    const addMutation = useCreateCronTest();

    const items = useMemo(() => {
        if (Array.isArray(response?.data)) {
            return response.data;
        }
        if (response?.data && 'data' in response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return [];
    }, [response]);

    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'sent': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'failed': return 'bg-rose-50 text-rose-700 border-rose-200';
            default: return 'bg-amber-50 text-amber-700 border-amber-200';
        }
    };

    return (
        <DataPageTemplate<CronTestEntity, CronTestCreatePayload>
            title="Test History Logs"
            description="Status pengiriman notifikasi otomatis"
            mutationMode="modal"
            
            // Custom Table columns mapping
            columns={[
                {
                    title: "Recipient",
                    key: "id", // Dummy key since we use render
                    render: (test: CronTestEntity) => (
                        <div className="space-y-1">
                            {test.whatsapp_to && (
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                                    <Phone className="h-3 w-3 text-emerald-500" /> {test.whatsapp_to}
                                </div>
                            )}
                            {test.email_to && (
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                                    <Mail className="h-3 w-3 text-blue-500" /> {test.email_to}
                                </div>
                            )}
                        </div>
                    )
                },
                {
                    title: "Schedule",
                    key: "send_at",
                    render: (test: CronTestEntity) => (
                        <p className="text-xs font-bold text-slate-700">
                            {test.send_at ? format(new Date(test.send_at), 'dd MMM yyyy') : '-'}
                        </p>
                    )
                },
                {
                    title: "Status",
                    key: "status",
                    render: (test: CronTestEntity) => (
                        <Badge variant="outline" className={`text-[9px] uppercase tracking-wider px-2 py-0 ${getStatusStyle(test.status)}`}>
                            {test.status || 'Pending'}
                        </Badge>
                    )
                },
                {
                    title: "Processed At",
                    key: "processed_at",
                    render: (test: CronTestEntity) => (
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-slate-700">
                                {test.processed_at ? format(new Date(test.processed_at), 'dd MMM yyyy') : '-'}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400">
                                {test.processed_at ? format(new Date(test.processed_at), 'HH:mm:ss') : '-'}
                            </span>
                        </div>
                    )
                }
            ]}
            data={items}
            isLoading={isLoading}
            currentPage={page}
            itemsPerPage={itemsPerPage}
            totalItems={(response?.data && 'total' in response.data ? response.data.total : items.length) ?? items.length}
            onPageChange={setPage}
            onItemsPerPageChange={setItemsPerPage}

            mutationForm={{
                component: CronTestMutationForm,
                resolver: zodResolver(CronTestCreateSchema),
                emptyValues: {
                    whatsapp_to: '',
                    email_to: '',
                    message: 'app_name SYSTEM TEST: Pengujian Notifikasi Cron Job Otomatis.',
                    minute_to_sent: 2
                },
                defaultValues: (item) => ({
                    message: item.message,
                    minute_to_sent: 0,
                    whatsapp_to: item.whatsapp_to ?? '',
                    email_to: item.email_to ?? '',
                }),
            }}
            submitActions={{
                add: {
                    label: 'Schedule Test',
                    modalTitle: 'Schedule New Test',
                    modalSize: 'md',
                    onConfirm: async (data: CronTestCreatePayload) => {
                        await addMutation.mutateAsync(data);
                    },
                }
            }}
        />
    );
};

export default CronNotificationTest;
