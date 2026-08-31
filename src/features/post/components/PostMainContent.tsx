import React, { useMemo, useState, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import {
    usePostIndex,
    usePostCreate,
    usePostUpdate,
    usePostDelete,
    postQueryKey,
} from '@/services/post/hooks/usePostCRUD';
import {
    PostEntity,
    PostCreateSchema,
    PostCreatePayload,
} from '@/services/post/schema/PostSchema';
import PostMutationForm from './PostMutationForm';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import useWebSocket from '@/services/web-socket/hooks/useWebSocket';
import { types } from '@/services/web-socket/lib/socket';
import useSubmitPost from '@/services/web-socket/hooks/useSubmitPost';

const PostMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const queryClient = useQueryClient();

    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const { data, isLoading, refetch } = usePostIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        include: 'image_file'
    });

    const { lastData } = useWebSocket(types.addPost);

    useEffect(() => {
        if (!lastData) {
            return;
        }

        const type = lastData.type || lastData.event_type

        if (type === types.addPost) {
            const timer = setTimeout(() => {
                refetch()
            }, 500)

            return () => clearTimeout(timer)
        }

    }, [lastData, refetch])

    const addMutation = usePostCreate();
    const editMutation = usePostUpdate();
    const deleteMutation = usePostDelete();
    const addSockets = useSubmitPost();

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const topbarConfig = useMemo(() => ({
        search: {
            placeholder: 'Cari Postingan...',
            value: search,
            onChange: setSearch,
        }
    }), [search]);

    useTopbarActions(topbarConfig);

    const columns = useMemo(() => [
        {
            title: 'Image',
            key: 'image_file_id',
            sortable: false,
            render: (item: PostEntity) => (
                item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.title || 'Post thumbnail'}
                        className="w-16 h-16 object-cover rounded-md"
                    />
                ) : (
                    <div className="w-16 h-16 bg-slate-100 flex items-center justify-center rounded-md text-xs text-slate-400">
                        No Image
                    </div>
                )
            )
        },
        {
            title: 'Judul',
            key: 'title',
            sortable: true,
            render: (item: PostEntity) => <span className="font-medium">{item.title || '-'}</span>
        },
        {
            title: 'Konten',
            key: 'content',
            sortable: false,
            expand: true,
            render: (item: PostEntity) => (
                <div className="truncate max-w-md">
                    {item.content || '-'}
                </div>
            )
        },
        {
            title: 'Label',
            key: 'label',
            sortable: true,
            render: (item: PostEntity) => {
                if (item.label) {
                    return (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: item.label.color || '#fff' }} />
                            <span>{item.label_name}</span>
                        </div>
                    );
                }
                return '-';
            }
        },
        {
            title: 'Status',
            key: 'is_active',
            sortable: true,
            render: (item: PostEntity) => (
                <Badge variant={item.is_active ? 'default' : 'secondary'}>
                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                </Badge>
            )
        },
        {
            title: 'Waktu Dibuat',
            key: 'created_at',
            sortable: true,
            render: (item: PostEntity) => {
                if (!item.created_at) return '-';
                return new Date(item.created_at).toLocaleString('id-ID');
            }
        },
    ], []);

    const displayData = Array.isArray(data?.data) ? data.data : [];
    const totalItems = data?.pagination?.total ?? 0;

    return (
        <DataPageTemplate<PostEntity, PostCreatePayload>
            title="Postingan"
            description="Manajemen postingan / artikel"
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
            handleSort={(newSortBy, newSortOrder) => {
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
            }}
            mutationForm={{
                component: PostMutationForm,
                resolver: zodResolver(PostCreateSchema),
                emptyValues: {
                    title: '',
                    content: '',
                    image_file_id: null,
                    label_id: null,
                    is_active: true,
                },
                defaultValues: (post) => ({
                    title: post.title ?? '',
                    content: post.content ?? '',
                    image_file_id: post.image_file_id ?? null,
                    label_id: post.label_id ?? null,
                    is_active: post.is_active ?? true,
                }),
            }}
            submitActions={{
                add: {
                    label: 'Tambah Postingan',
                    modalTitle: 'Tambah Postingan',
                    modalDescription: 'Isi form di bawah ini untuk menambahkan data postingan baru.',
                    modalSize: 'lg',
                    onConfirm: async (data) => {
                        await addMutation.mutateAsync(data);
                        await addSockets.onSubmit({
                            title: data.title
                        });
                        queryClient.invalidateQueries({ queryKey: [postQueryKey] });
                        toast.success('Berhasil', { description: 'Postingan telah ditambahkan' });
                    },
                },
                edit: {
                    modalTitle: (post) => `Edit Postingan — ${post.title}`,
                    modalSize: 'lg',
                    onConfirm: async (item, data) => {
                        if (!item.id) return;
                        await editMutation.mutateAsync({ id: item.id, data });
                        queryClient.invalidateQueries({ queryKey: [postQueryKey] });
                        toast.success('Berhasil', { description: 'Postingan telah diperbarui' });
                    },
                },
                delete: {
                    onConfirm: async (item) => {
                        if (!item.id) return;
                        await deleteMutation.mutateAsync({ id: item.id });
                        queryClient.invalidateQueries({ queryKey: [postQueryKey] });
                        toast.success('Berhasil', { description: 'Postingan telah dihapus' });
                    },
                }
            }}
        />
    );
};

export default PostMainContent;
