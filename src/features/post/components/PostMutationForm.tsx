import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { PostCreatePayload } from '@/services/post/schema/PostSchema';
import { FloatingInput } from '@/components/FloatingInput';
import { InputRichText } from '@/components/InputRichText';
import { UploadSingleImage } from '@/components/UploadSingleImage';
import LabelComp from '@/components/LabelComp';
import { useIndexLabels } from '@/services/labels/hooks/useLabelCRUD';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface Props {
    form: UseFormReturn<PostCreatePayload>;
    initialThumbnailUrl?: string;
}

const PostMutationForm: React.FC<Props> = ({ form, initialThumbnailUrl }) => {
    const { control, formState: { errors } } = form;
    const { data: labelsData } = useIndexLabels({ paginate: 100 });
    const labels = Array.isArray(labelsData?.data) ? labelsData.data : [];

    return (
        <form className="space-y-4" id="posts-form">
            <div className="space-y-4">
                {/* Section 1: Image & Basic Info */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                    <div className="col-span-full">
                        <LabelComp className="text-xs font-black uppercase tracking-widest text-slate-400">
                            Gambar Postingan (Opsional)
                        </LabelComp>
                    </div>
                    
                    <article className="flex flex-col h-full col-span-full">
                        <Controller
                            control={control}
                            name="image_file_id"
                            render={({ field }) => (
                                <UploadSingleImage
                                    value={field.value}
                                    onChange={(val) => field.onChange(val)}
                                    previewUrl={initialThumbnailUrl}
                                    error={errors.image_file_id?.message}
                                />
                            )}
                        />
                    </article>

                    <article className="flex flex-col gap-4">
                        <FloatingInput
                            id="title"
                            label="Judul Postingan"
                            watch={form.watch('title')}
                            error={errors.title?.message}
                            inputProps={{
                                ...form.register('title')
                            }}
                            required
                        />
                    </article>

                    <article className="flex flex-col gap-4">
                        <LabelComp className="text-xs font-black uppercase tracking-widest text-slate-400">
                            Pilih Label
                        </LabelComp>
                        <Controller
                            control={control}
                            name="label_id"
                            render={({ field }) => (
                                <Select 
                                    value={field.value ? String(field.value) : undefined} 
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="h-14">
                                        <SelectValue placeholder="Pilih Label" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {labels.map(label => (
                                            <SelectItem key={label.id} value={String(label.id)}>
                                                {label.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </article>

                    <article className="flex flex-row items-center justify-between gap-4 p-4 border rounded-lg h-14 col-span-full md:col-span-1">
                        <LabelComp className="text-sm font-medium text-slate-700 m-0">
                            Status Aktif
                        </LabelComp>
                        <Controller
                            control={control}
                            name="is_active"
                            render={({ field }) => (
                                <Switch
                                    id="is_active"
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </article>
                </section>

                {/* Section 2: Content */}
                <section>
                    <Controller
                        control={control}
                        name="content"
                        render={({ field }) => (
                            <InputRichText
                                id="content"
                                label="Konten Postingan"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={errors.content?.message}
                                required
                            />
                        )}
                    />
                </section>
            </div>
        </form>
    );
};

export default PostMutationForm;
