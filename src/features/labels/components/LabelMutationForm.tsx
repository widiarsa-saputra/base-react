import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { LabelCreatePayload } from '@/services/labels/schema/LabelSchema';
import { FloatingInput } from '@/components/FloatingInput';

interface Props {
    form: UseFormReturn<LabelCreatePayload>;
}

const LabelMutationForm: React.FC<Props> = ({ form }) => {
    const { formState: { errors } } = form;

    return (
        <form className="space-y-4" id="labels-form">
            <div className="space-y-4">
                <section className="grid grid-cols-1 gap-4">
                    <article className="flex flex-col gap-4">
                        <FloatingInput
                            id="name"
                            label="Nama Label"
                            watch={form.watch('name')}
                            error={errors.name?.message}
                            inputProps={{
                                ...form.register('name')
                            }}
                            required
                        />
                    </article>

                    <article className="flex flex-col gap-4">
                        <FloatingInput
                            id="color"
                            label="Warna Label (Hex)"
                            watch={form.watch('color')}
                            error={errors.color?.message}
                            inputProps={{
                                ...form.register('color'),
                                type: 'color',
                                className: 'h-14 p-2 cursor-pointer'
                            }}
                            required
                        />
                    </article>
                </section>
            </div>
        </form>
    );
};

export default LabelMutationForm;
