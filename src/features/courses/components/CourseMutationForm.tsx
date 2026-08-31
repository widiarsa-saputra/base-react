import React, { useState } from 'react';
import { UseFormReturn, Controller, useFieldArray } from 'react-hook-form';
import { CourseCreatePayload, CourseLevelEnum, CourseStatusEnum } from '@/services/courses/schema/CourseSchema';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useCourseCategoryIndex } from '@/services/course-categories/hooks/useCourseCategoryCRUD';
import { SwitchComp } from '@/components/CustomComp';
import { FloatingInput, FloatingTextArea, FloatingCurrencyInput } from '@/components/FloatingInput';
import Combobox from '@/components/Combobox';
import { UploadSingleImage } from '@/components/UploadSingleImage';
import LabelComp from '@/components/LabelComp';
import { Wizard, WizardStep } from '@/components/Wizard';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface Props {
    form: UseFormReturn<CourseCreatePayload>;
    initialThumbnailUrl?: string;
}

const CourseMutationForm: React.FC<Props> = ({ form, initialThumbnailUrl }) => {
    const { control, formState: { errors } } = form;

    const [categorySearch, setCategorySearch] = useState('');
    const debouncedSearch = useDebounce(categorySearch, 500);
    const { data: categoryResponse } = useCourseCategoryIndex({
        search: debouncedSearch,
        paginate: 30,
    });
    const categories = categoryResponse?.data ?? [];

    const categoryOptions = categories.map((cat) => ({
        label: cat.name ?? '',
        value: cat.id.toString(),
    }));

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'course_sections' as never, // Using never because course_sections is typed as z.any() currently
    });

    const handleValidateGeneralInfo = async () => {
        // Trigger validation for all fields in step 1
        const isValid = await form.trigger([
            'title',
            'course_category_id',
            'level',
            'duration',
            'price',
            'status',
            'has_certificate',
            'description',
            'video_url',
            'thumbnail_file_id'
        ]);
        return isValid;
    };

    return (
        <form className="space-y-4" id="courses-form">
            <Wizard>
                {/* Step 1: General Information */}
                <WizardStep 
                    title="Informasi Umum" 
                    description="Lengkapi informasi dasar kursus Anda"
                    onValidate={handleValidateGeneralInfo}
                >
                    <div className="space-y-8">
                        {/* Section 1: Thumbnail & Basic Info */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                            <LabelComp className="text-xs font-black uppercase tracking-widest text-slate-400 col-span-full" tooltipMessage='Ini adalah thumbnail' required>Thumbnail</LabelComp>
                            <article className="flex flex-col h-full">
                                <Controller
                                    control={control}
                                    name="thumbnail_file_id"
                                    render={({ field }) => (
                                        <UploadSingleImage
                                            value={field.value}
                                            onChange={(val) => field.onChange(val)}
                                            previewUrl={initialThumbnailUrl}
                                            error={errors.thumbnail_file_id?.message}
                                        />
                                    )}
                                />
                            </article>

                            <article className="flex flex-col gap-4">
                                <FloatingInput
                                    id="title"
                                    label="Title"
                                    watch={form.watch('title')}
                                    error={errors.title?.message}
                                    inputProps={{
                                        ...form.register('title')
                                    }}
                                    tooltipMessage='Ini adalah title'
                                    required
                                />

                                <Controller
                                    control={control}
                                    name="course_category_id"
                                    render={({ field }) => (
                                        <Combobox
                                            id="course_category_id"
                                            label="Kategori"
                                            tooltipMessage='Ini adalah kategori'
                                            options={categoryOptions}
                                            value={field.value?.toString() || ""}
                                            onChange={(val) => field.onChange(val.value || null)}
                                            externalSearch={setCategorySearch}
                                            error={errors.course_category_id?.message as string}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="level"
                                    render={({ field }) => (
                                        <Combobox
                                            id="level"
                                            label="Level"
                                            required
                                            options={CourseLevelEnum.map((lvl) => ({
                                                label: (lvl[0].toUpperCase() + lvl.slice(1)).replace('_', ' '),
                                                value: lvl
                                            }))}
                                            tooltipMessage='Ini adalah level'
                                            value={field.value}
                                            onChange={(val) => field.onChange(val.value)}
                                            inputProps={{ placeholder: "Pilih Level" }}
                                            error={errors.level?.message as string}
                                        />
                                    )}
                                />

                                <FloatingInput
                                    id="duration"
                                    type="number"
                                    label="Durasi (Menit)"
                                    watch={form.watch('duration')?.toString()}
                                    error={errors.duration?.message}
                                    tooltipMessage='Ini adalah duration'
                                    inputProps={{
                                        ...form.register('duration')
                                    }}
                                />

                                <Controller
                                    control={control}
                                    name="price"
                                    render={({ field }) => (
                                        <FloatingCurrencyInput
                                            id="price"
                                            label="Harga"
                                            value={field.value ?? null}
                                            onChange={field.onChange}
                                            watch={field.value?.toString()}
                                            error={errors.price?.message}
                                        />
                                    )}
                                />
                            </article>
                        </section>

                        {/* Section 2: Status & Settings */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <article>
                                <Controller
                                    control={control}
                                    name="status"
                                    render={({ field }) => (
                                        <Combobox
                                            id="status"
                                            label="Status"
                                            required
                                            options={CourseStatusEnum.map((st) => ({
                                                label: (st[0].toUpperCase() + st.slice(1)).replace('_', ' '),
                                                value: st
                                            }))}
                                            value={field.value}
                                            onChange={(val) => field.onChange(val.value)}
                                            inputProps={{ placeholder: "Pilih Status" }}
                                            error={errors.status?.message as string}
                                        />
                                    )}
                                />
                            </article>

                            <article className="mt-2">
                                <Controller
                                    control={control}
                                    name="has_certificate"
                                    render={({ field }) => (
                                        <SwitchComp
                                            label="Course memiliki sertifikat (generate otomatis)"
                                            checked={!!field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                                {errors.has_certificate && <span className="text-red-500 text-xs mt-1 block">{errors.has_certificate.message as string}</span>}
                            </article>
                        </section>

                        {/* Section 3: Description */}
                        <section>
                            <FloatingTextArea
                                id="description"
                                label="Deskripsi Lengkap"
                                watch={form.watch('description')?.toString()}
                                error={errors.description?.message}
                                inputProps={{
                                    ...form.register('description'),
                                    rows: 5
                                }}
                            />
                        </section>

                        {/* Section 4: Video URL */}
                        <section>
                            <FloatingInput
                                id="video_url"
                                label="Video URL"
                                watch={form.watch('video_url') || ''}
                                error={errors.video_url?.message}
                                inputProps={{
                                    ...form.register('video_url')
                                }}
                            />
                        </section>
                    </div>
                </WizardStep>

                {/* Step 2: Course Sections */}
                <WizardStep 
                    title="Materi Kursus" 
                    description="Tambahkan bagian-bagian materi untuk kursus ini"
                >
                    <div className="space-y-4">
                        {fields.length === 0 ? (
                            <div className="text-center p-8 border-2 border-dashed rounded-lg bg-slate-50">
                                <p className="text-slate-500 mb-4">Belum ada bagian materi yang ditambahkan.</p>
                                <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => append({ title: '', description: '' })}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tambah Bagian Pertama
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-4 p-4 border rounded-lg bg-white shadow-sm relative group">
                                        <div className="mt-2 text-slate-400 cursor-grab active:cursor-grabbing">
                                            <GripVertical className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <FloatingInput
                                                id={`course_sections.${index}.title`}
                                                label={`Judul Bagian ${index + 1}`}
                                                watch={form.watch(`course_sections.${index}.title`)}
                                                inputProps={{
                                                    ...form.register(`course_sections.${index}.title` as never),
                                                    placeholder: "Contoh: Pengenalan Dasar"
                                                }}
                                                required
                                            />
                                            <FloatingTextArea
                                                id={`course_sections.${index}.description`}
                                                label="Deskripsi Bagian (Opsional)"
                                                watch={form.watch(`course_sections.${index}.description`)}
                                                inputProps={{
                                                    ...form.register(`course_sections.${index}.description` as never),
                                                    rows: 2
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <Button 
                                    type="button" 
                                    variant="outline"
                                    className="w-full mt-4 border-dashed"
                                    onClick={() => append({ title: '', description: '' })}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tambah Bagian
                                </Button>
                            </div>
                        )}
                    </div>
                </WizardStep>
            </Wizard>
        </form>
    );
};

export default CourseMutationForm;
