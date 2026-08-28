import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RoleCreatePayload } from '@/services/role/schema/RoleSchema';
import { FloatingInput } from '@/components/FloatingInput';
import { Shield, Tag } from 'lucide-react';

interface RoleMutationFormProps {
    form: UseFormReturn<RoleCreatePayload>;
}

const RoleMutationForm: React.FC<RoleMutationFormProps> = ({ form }) => {
    const { register, formState: { errors }, watch } = form;

    return (
        <form className="grid gap-4" id="role-form">
            <FloatingInput
                id="display_name"
                label="Display Name"
                icon={Shield}
                inputProps={register('display_name')}
                error={errors.display_name?.message}
                watch={watch('display_name')}
                required
            />
            <FloatingInput
                id="name"
                label="Name"
                tooltipMessage="Nama unik (slug) yang digunakan oleh sistem (contoh: super-admin). Gunakan huruf kecil tanpa spasi."
                icon={Tag}
                inputProps={register('name')}
                error={errors.name?.message}
                watch={watch('name')}
                required
            />
        </form>
    );
};

export default RoleMutationForm;
