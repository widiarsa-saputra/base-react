import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FloatingInput, FloatingTextArea } from '@/components/FloatingInput';
import { StudentCreatePayload } from '@/services/students/schema/StudentSchema';

export interface StudentMutationFormProps {
    form: UseFormReturn<StudentCreatePayload>;
}

const StudentMutationForm: React.FC<StudentMutationFormProps> = ({ form }) => {
    const { register, formState: { errors }, watch } = form;

    return (
        <form className="flex flex-col gap-4" id='student-form'>
            <FloatingInput
                id="name"
                label="Nama Siswa"
                required
                inputProps={{ ...register('name'), placeholder: "Masukkan nama siswa" }}
                error={errors.name?.message as string}
                watch={watch('name')}
            />

            <FloatingInput
                id="parent_name"
                label="Nama Orang Tua"
                required
                inputProps={{ ...register('parent_name'), placeholder: "Masukkan nama orang tua" }}
                error={errors.parent_name?.message as string}
                watch={watch('parent_name')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput
                    id="email"
                    type="email"
                    label="Email"
                    inputProps={{ ...register('email'), placeholder: "email@example.com" }}
                    error={errors.email?.message as string}
                    watch={watch('email') || ''} // Fallback to string if email is optional/null
                />

                <FloatingInput
                    id="phone"
                    label="No. Telepon"
                    inputProps={{ ...register('phone'), placeholder: "0812..." }}
                    error={errors.phone?.message as string}
                    watch={watch('phone') || ''}
                />
            </div>

            <FloatingTextArea
                id="address"
                label="Alamat"
                inputProps={{ 
                    ...register('address'), 
                    placeholder: "Masukkan alamat lengkap", 
                    rows: 3, 
                    className: '!text-xs placeholder:!text-slate-400' 
                }}
                error={errors.address?.message as string}
                watch={watch('address') || ''}
            />
        </form>
    );
};

export default StudentMutationForm;
