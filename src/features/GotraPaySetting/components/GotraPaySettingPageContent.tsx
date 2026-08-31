import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GotraPaySettingPayload, GotraPaySettingPayloadSchema } from '@/services/GotraPaySetting/schema/GotraPaySettingSchema';
import { useSaveGotraPaySetting, gotraPaySettingQueryKey } from '@/services/GotraPaySetting/hooks/useSaveGotraPaySetting';
import { useGetGotraPaySetting } from '@/services/GotraPaySetting/hooks/useGetGotraPaySetting';
import TabsSections from '@/components/TabsSections';
import GotraPayGeneralTab from './tabs/GotraPayGeneralTab';
import GotraPaySecretTab from './tabs/GotraPaySecretTab';

import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const GotraPaySettingPageContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState("general");
    const queryClient = useQueryClient();
    const saveMutation = useSaveGotraPaySetting();
    const { data: settingResponse, isLoading: isLoadingFetch } = useGetGotraPaySetting();

    const form = useForm<GotraPaySettingPayload>({
        resolver: zodResolver(GotraPaySettingPayloadSchema),
        defaultValues: {
            is_enabled: false,
            base_url: '',
            key_id: '',
            secret: '',
            webhook_secret: '',
            default_gateway: 'midtrans',
            default_currency: 'IDR',
            default_due_days: 1,
            timeout_seconds: 30,
            default_expires_in: 3600,
        }
    });

    useEffect(() => {
        if (settingResponse?.data) {
            form.reset({
                is_enabled: settingResponse.data.is_enabled,
                base_url: settingResponse.data.base_url,
                key_id: settingResponse.data.key_id,
                default_gateway: settingResponse.data.default_gateway,
                default_currency: settingResponse.data.default_currency,
                default_due_days: settingResponse.data.default_due_days,
                timeout_seconds: settingResponse.data.timeout_seconds,
                default_expires_in: settingResponse.data.default_expires_in,
                secret: '', // Don't populate with boolean has_secret
                webhook_secret: '', // Don't populate with boolean has_webhook_secret
            });
        }
    }, [settingResponse?.data, form]);

    const onSubmit = async (data: GotraPaySettingPayload) => {
        // Strip empty secrets so they don't overwrite existing ones with empty string
        const payload = { ...data };
        if (!payload.secret) payload.secret = null;
        if (!payload.webhook_secret) payload.webhook_secret = null;

        try {
            await saveMutation.mutateAsync({ id: 'gotrapay-setting', data: payload });
            queryClient.invalidateQueries({ queryKey: [gotraPaySettingQueryKey] });
            toast.success("Berhasil menyimpan konfigurasi GotraPay");
            
            // Clear secret fields after successful save
            form.setValue('secret', '');
            form.setValue('webhook_secret', '');
        } catch (error) {
            toast.error("Gagal menyimpan konfigurasi");
            console.error(error);
        }
    };

    if (isLoadingFetch) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
            </div>
        );
    }

    const currentEntity = saveMutation.data?.data || settingResponse?.data;

    return (
        <main className="animate-in fade-in duration-500 flex flex-col gap-4 ">

            <div>
                <TabsSections
                    value={activeTab}
                    onValueChange={setActiveTab}
                    tabObjects={[
                        {
                            trigger: "general",
                            content: <GotraPayGeneralTab form={form} onSubmit={onSubmit} isPending={saveMutation.isPending} entity={currentEntity} />
                        },
                        {
                            trigger: "secret",
                            content: <GotraPaySecretTab 
                                        form={form} 
                                        onSubmit={onSubmit} 
                                        isPending={saveMutation.isPending} 
                                        hasSecret={currentEntity?.has_secret}
                                        hasWebhookSecret={currentEntity?.has_webhook_secret}
                                    />
                        }
                    ]}
                />
            </div>
        </main>
    );
};

export default GotraPaySettingPageContent;
