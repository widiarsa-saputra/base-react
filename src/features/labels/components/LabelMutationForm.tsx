import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { LabelCreatePayload } from '@/services/labels/schema/LabelSchema';
import { FloatingInput } from '@/components/FloatingInput';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';

interface Props {
    form: UseFormReturn<LabelCreatePayload>;
}

const LabelMutationForm: React.FC<Props> = ({ form }) => {
    const { formState: { errors }, control, register, watch } = form;

    return (
        <form className="space-y-4" id="labels-form">
            <div className="space-y-4">
                <section className="grid grid-cols-1 gap-4">
                    <article className="flex flex-col gap-4">
                        <FloatingInput
                            id="name"
                            label="Nama Label"
                            watch={watch('name')}
                            error={errors.name?.message}
                            inputProps={{
                                ...register('name')
                            }}
                            required
                        />
                    </article>

                    <article className="flex flex-col gap-2">
                        <Controller
                            control={control}
                            name="color"
                            render={({ field }) => (
                                <div className="flex flex-col gap-3">
                                    {/* Color picker */}
                                    <HexColorPicker
                                        color={field.value || '#000000'}
                                        onChange={field.onChange}
                                        style={{ width: '100%', height: '180px' }}
                                    />

                                    {/* Swatch + hex input */}
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-md border border-slate-200 shrink-0 shadow-sm"
                                            style={{ backgroundColor: field.value || '#000000' }}
                                        />
                                        <input
                                            type="text"
                                            value={field.value || ''}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                            }}
                                            onBlur={(e) => {
                                                // Ensure value starts with # on blur
                                                let val = e.target.value.trim();
                                                if (val && !val.startsWith('#')) {
                                                    val = `#${val}`;
                                                }
                                                field.onChange(val);
                                                field.onBlur();
                                            }}
                                            placeholder="#000000"
                                            maxLength={7}
                                            className={cn(
                                                'flex-1 h-10 px-3 rounded-md border bg-background text-sm font-mono tracking-widest uppercase',
                                                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
                                                errors.color
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-input'
                                            )}
                                        />
                                    </div>
                                </div>
                            )}
                        />

                        {errors.color && (
                            <p className="text-xs text-red-500">{errors.color.message}</p>
                        )}
                    </article>
                </section>
            </div>
        </form>
    );
};

export default LabelMutationForm;
