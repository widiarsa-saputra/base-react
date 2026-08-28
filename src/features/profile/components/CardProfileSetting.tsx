import { useAuth } from '@/auth/context/AuthProvider';
import { LoginData } from '@/auth/response/loginResponseSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail } from 'lucide-react';
import { FloatingInput } from '@/components/FloatingInput';
import useGetUserLogin from '@/services/profile/hooks/useGetUserLogin';
import { useUpdateProfile } from '@/services/profile/hooks/useUpdateProfile';
import { UpdateProfile, UpdateProfileSchema } from '@/services/profile/schema/UpdateProfileSchema';
import { useFormSubmit } from '@/shared/hooks/useFormSubmit';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';

const CardProfileSetting: React.FC = () => {
    const { relogin } = useAuth();
    const { mutateAsync, isPending } = useUpdateProfile();  // Assuming `useCreateUser` is a hook for creating the user
    const { register, setError, handleSubmit, formState: { errors }, reset, watch } = useForm<UpdateProfile>({
        resolver: zodResolver(UpdateProfileSchema),  // Assuming you have a Zod schema for validation
    });  // Adjust the form type to match the expected structure

    const { data: userFetch, isFetching, isSuccess, refetch } = useGetUserLogin();

    useEffect(() => {
        if (userFetch && isSuccess) {
            reset({
                name: userFetch.data.name,
                email: userFetch.data.email,
                phone: userFetch.data.phone,
            });
        }
    }, [userFetch]);

    // Use the form submit handler
    const { onSubmit } = useFormSubmit({
        mutate: mutateAsync,
        isPending: isPending,
        setError: setError,
        successMessage: "User updated successfully!",
        errorMessage: "Failed to update user.",
        queryKeyToRefetch: ["user"], // Assuming you want to refetch the `users` query
        transformPayload: (formData) => ({ 
            id: userFetch?.data?.id ?? 'me', 
            data: formData 
        }),
        onSuccess: () => {
            const userFetch = refetch();
            if (userFetch) {
                userFetch.then((res) => {
                    if (res.data) {
                        relogin({
                            ...res.data.data,
                            roles: res.data.data.roles ?? [],
                            permissions: res.data.data.permissions ?? [],
                            photo_url: res.data.data.photo_url ?? undefined,
                        } as LoginData);
                    }
                });
            }
        }
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your profile information and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 pt-3'>
                    <FloatingInput
                        id="name"
                        label="Name"
                        icon={User}
                        inputProps={register('name')}
                        error={errors.name?.message}
                        watch={watch('name')}
                        disabled={isFetching}
                        required
                    />
                    <FloatingInput
                        id="phone"
                        label="Phone"
                        icon={Phone}
                        inputProps={register('phone')}
                        error={errors.phone?.message}
                        watch={watch('phone') ?? undefined}
                        disabled={isFetching}
                    />
                    <FloatingInput
                        id="email"
                        label="Email"
                        type="email"
                        icon={Mail}
                        inputProps={register('email')}
                        error={errors.email?.message}
                        watch={watch('email')}
                        disabled={isFetching}
                        required
                    />
                    <Button type='submit' disabled={isPending} className="mt-2">Save Changes</Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default CardProfileSetting