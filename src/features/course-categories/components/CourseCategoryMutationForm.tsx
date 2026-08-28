import React, { useState } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { CourseCategoryCreatePayload } from '@/services/course-categories';
import { useCourseCategoryIndex } from '@/services/course-categories';
import { SwitchComp } from '@/components/CustomComp';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { FloatingInput, FloatingTextArea } from '@/components/FloatingInput';
import Combobox from '@/components/Combobox';

interface Props {
    form: UseFormReturn<CourseCategoryCreatePayload>;
}

const CourseCategoryMutationForm: React.FC<Props> = ({ form }) => {
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

    return (
        <form
            className="flex flex-col gap-4 mt-2"
            id="course-category-form"
        >
            <FloatingInput
                id="name"
                label="Nama Kategori"
                watch={form.watch('name')}
                error={errors.name?.message}
                inputProps={{
                    ...form.register('name')
                }}
                required
            />

            <Controller
                control={control}
                name="parent_id"
                render={({ field }) => (
                    <Combobox
                        id="parent_id"
                        label="Kategori Induk (Parent)"
                        options={categoryOptions}
                        value={field.value?.toString() || ""}
                        onChange={(val) => field.onChange(val.value || null)}
                        externalSearch={setCategorySearch}
                        error={errors.parent_id?.message as string}
                        inputProps={{ placeholder: "Pilih Kategori Induk" }}
                    />
                )}
            />

            <FloatingTextArea
                id="description"
                label="Deskripsi"
                watch={form.watch('description')?.toString()}
                error={errors.description?.message}
                inputProps={{
                    ...form.register('description'),
                    rows: 3
                }}
            />

            <div className="mt-2">
                <Controller
                    control={control}
                    name="is_active"
                    render={({ field }) => (
                        <SwitchComp
                            label="Aktif?"
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />
                {errors.is_active && <span className="text-red-500 text-xs mt-1 block">{errors.is_active.message as string}</span>}
            </div>
        </form>
    );
};

export default CourseCategoryMutationForm;
