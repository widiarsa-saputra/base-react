import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { PostCreatePayload } from '@/services/post/schema/PostSchema';
import { FloatingInput } from '@/components/FloatingInput';
import { InputRichText } from '@/components/InputRichText';
import { UploadSingleImage } from '@/components/UploadSingleImage';
import LabelComp from '@/components/LabelComp';
import { useIndexLabels } from '@/services/labels/hooks/useLabelCRUD';
import Combobox from '@/components/Combobox';
import { SwitchComp } from '@/components/CustomComp';
import { Wizard, WizardStep } from '@/components/Wizard';

interface Props {
    form: UseFormReturn<PostCreatePayload>;
    initialThumbnailUrl?: string;
    onCancel?: () => void;
}

const PostMutationForm: React.FC<Props> = ({ form, initialThumbnailUrl, onCancel }) => {
    const { control, formState: { errors }, trigger, watch, register } = form;
    const { data: labelsData } = useIndexLabels({ paginate: 100 });
    const labels = Array.isArray(labelsData?.data) ? labelsData.data : [];

    return (
        <form className="space-y-4" id="posts-form">
            <Wizard onCancel={onCancel}>
                {/* Step 1: General Information */}
                <WizardStep
                    title="General Information"
                    description="Informasi umum dan konfigurasi postingan."
                    onValidate={async () => {
                        return await trigger(['title', 'image_file_id', 'label_id', 'is_active']);
                    }}
                >
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                        <div className="col-span-full">
                            <LabelComp 
                                className="text-xs font-black uppercase tracking-widest text-slate-400"
                                tooltipMessage="Pilih gambar menarik untuk dijadikan sampul atau representasi visual utama dari postingan ini."
                            >
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
                                tooltipMessage="Tuliskan judul utama yang mendeskripsikan keseluruhan isi postingan."
                                watch={watch('title')}
                                error={errors.title?.message}
                                inputProps={{
                                    ...register('title')
                                }}
                                required
                            />
                        </article>

                        <article className="flex flex-col h-full gap-4">
                            <Controller
                                control={control}
                                name="label_id"
                                render={({ field }) => (
                                    <Combobox
                                        id="label_id"
                                        label="Pilih Label"
                                        tooltipMessage="Pilih kategori atau label yang sesuai untuk mengelompokkan postingan ini."
                                        value={field.value ? String(field.value) : undefined}
                                        onChange={(val) => field.onChange(val.value)}
                                        options={labels.map(label => ({
                                            label: label.name || '-',
                                            value: String(label.id)
                                        }))}
                                    />
                                )}
                            />
                        </article>

                        <article className="flex flex-col gap-2 p-4 border rounded-lg col-span-full md:col-span-1">
                            <Controller
                                control={control}
                                name="is_active"
                                render={({ field }) => (
                                    <SwitchComp
                                        label="Status Aktif"
                                        tooltipMessage="Tentukan apakah postingan ini langsung dapat dilihat oleh publik atau disembunyikan sementara."
                                        checked={!!field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <p className="text-xs text-slate-500">
                                Aktifkan opsi ini agar postingan dapat dilihat oleh publik. Jika dinonaktifkan, postingan akan disembunyikan.
                            </p>
                        </article>
                    </section>
                </WizardStep>

                {/* Step 2: Content */}
                <WizardStep
                    title="Content"
                    description="Tulis konten atau artikel untuk postingan ini."
                    onValidate={async () => {
                        return await trigger(['content']);
                    }}
                >
                    <section className="flex flex-col h-full min-h-[400px]">
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
                </WizardStep>
            </Wizard>
        </form>
    );
};

export default PostMutationForm;
