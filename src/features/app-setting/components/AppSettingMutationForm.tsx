import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AppSettingCreatePayload } from '@/services/app-setting/schema/AppSettingSchema';
import { FloatingInput } from '@/components/FloatingInput';

interface Props {
    form: UseFormReturn<AppSettingCreatePayload>;
}

const AppSettingMutationForm: React.FC<Props> = ({ form }) => {
    const { formState: { errors }, register, watch } = form;

    return (
        <form className="space-y-4" id="app-settings-form">
            <section className="grid grid-cols-1 gap-4">
                <article className="flex flex-col gap-4">
                    <FloatingInput
                        id="key"
                        label="Key"
                        watch={watch('key')}
                        error={errors.key?.message}
                        inputProps={{
                            ...register('key')
                        }}
                        required
                    />
                </article>

                <article className="flex flex-col gap-4">
                    <FloatingInput
                        id="value"
                        label="Value"
                        watch={watch('value')}
                        error={errors.value?.message as string | undefined}
                        inputProps={{
                            ...register('value')
                        }}
                        required
                    />
                </article>

                <article className="flex flex-col gap-4">
                    <FloatingInput
                        id="description"
                        label="Description"
                        watch={watch('description') ?? undefined}
                        error={errors.description?.message}
                        inputProps={{
                            ...register('description')
                        }}
                    />
                </article>
            </section>
        </form>
    );
};

export default AppSettingMutationForm;
