import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { PostCreatePayload } from '@/services/post/schema/PostSchema';
import { FloatingInput } from '@/components/FloatingInput';
import { InputRichText } from '@/components/InputRichText';
import { UploadSingleImage } from '@/components/UploadSingleImage';
import LabelComp from '@/components/LabelComp';

interface Props {
    form: UseFormReturn<PostCreatePayload>;
    initialThumbnailUrl?: string;
}

const PostMutationForm: React.FC<Props> = ({ form, initialThumbnailUrl }) => {
    const { control, formState: { errors } } = form;

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
