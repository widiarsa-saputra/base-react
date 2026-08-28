import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PermissionCreatePayload } from '@/services/permission/schema/PermissionSchema';
import { FloatingInput } from '@/components/FloatingInput';
import { Shield, Tag, Layers } from 'lucide-react';

interface PermissionMutationFormProps {
    form: UseFormReturn<PermissionCreatePayload>;
}

const PermissionMutationForm: React.FC<PermissionMutationFormProps> = ({ form }) => {
    const { register, formState: { errors }, watch } = form;

    return (
        <form className="grid gap-4" id="permission-form">
            <FloatingInput
                id="display_name"
                label="Display Name"
                tooltipMessage="Nama tampilan permission yang mudah dibaca (contoh: Lihat Pengguna)."
                icon={Shield}
                inputProps={register('display_name')}
                error={errors.display_name?.message}
                watch={watch('display_name')}
                required
            />
            <FloatingInput
                id="group"
                label="Group"
                tooltipMessage="Kategori atau modul untuk mengelompokkan permission (contoh: User Management)."
                icon={Layers}
                inputProps={register('group')}
                error={errors.group?.message}
                watch={watch('group')}
                required
            />
            <FloatingInput
                id="name"
                label="Name"
                tooltipMessage="Kode unik (slug) permission untuk sistem (contoh: users.view). Gunakan huruf kecil tanpa spasi."
                icon={Tag}
                inputProps={register('name')}
                error={errors.name?.message}
                watch={watch('name')}
                required
            />
        </form>
    );
};

export default PermissionMutationForm;
