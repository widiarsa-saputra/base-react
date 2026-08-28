import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { UserCreatePayload } from '@/services/user/schema/UserSchema';
import { FloatingInput } from '@/components/FloatingInput';
import { Mail, Phone, Lock, User } from 'lucide-react';

interface UserMutationFormProps {
    form: UseFormReturn<UserCreatePayload>;
}

export const UserMutationForm: React.FC<UserMutationFormProps> = ({ form }) => {
    const { register, formState: { errors }, watch } = form;

    return (
        <form className="grid gap-4" id="user-form">
            <FloatingInput
                id="name"
                label="Full Name"
                icon={User}
                inputProps={register('name')}
                error={errors.name?.message}
                watch={watch('name')}
                required
            />
            <FloatingInput
                id="email"
                label="Email"
                type="email"
                icon={Mail}
                inputProps={register('email')}
                error={errors.email?.message}
                watch={watch('email')}
                required
            />
            <FloatingInput
                id="phone"
                label="WhatsApp"
                icon={Phone}
                inputProps={register('phone')}
                error={errors.phone?.message}
                watch={watch('phone') ?? undefined}
            />
            <FloatingInput
                id="password"
                label="Password"
                type="password"
                icon={Lock}
                inputProps={register('password')}
                error={errors.password?.message}
                watch={watch('password')}
                required
            />
        </form>
    );
};

export default UserMutationForm;
