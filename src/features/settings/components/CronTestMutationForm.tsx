import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CronTestCreatePayload } from '@/services/notification-service/schema/CronTestSchema';
import { FloatingInput, FloatingTextArea } from '@/components/FloatingInput';
import { Clock, Phone, Mail, MessageSquare } from 'lucide-react';

interface CronTestMutationFormProps {
    form: UseFormReturn<CronTestCreatePayload>;
}

const CronTestMutationForm: React.FC<CronTestMutationFormProps> = ({ form }) => {
    const { register, formState: { errors }, watch } = form;

    return (
        <form className="flex flex-col gap-4" id="cron-test-form">
            <FloatingInput
                id="whatsapp_to"
                label="WhatsApp To"
                icon={Phone}
                inputProps={{
                    ...register('whatsapp_to'),
                    placeholder: "6281234567890"
                }}
                error={errors.whatsapp_to?.message}
                watch={watch('whatsapp_to') ?? undefined}
            />
            
            <FloatingInput
                id="email_to"
                label="Email To"
                type="email"
                icon={Mail}
                inputProps={{
                    ...register('email_to'),
                    placeholder: "customer@example.com"
                }}
                error={errors.email_to?.message}
                watch={watch('email_to') ?? undefined}
            />

            <FloatingTextArea
                id="message"
                label="Message"
                icon={MessageSquare}
                inputProps={{
                    ...register('message'),
                    className: "min-h-[100px] resize-none"
                }}
                error={errors.message?.message}
                watch={watch('message')}
                required
            />

            <FloatingInput
                id="minute_to_sent"
                label="Delay (Minutes)"
                type="number"
                icon={Clock}
                tooltipMessage="Notifikasi akan dikirim setelah sekian menit."
                inputProps={register('minute_to_sent')}
                error={errors.minute_to_sent?.message}
                watch={watch('minute_to_sent')?.toString()}
                required
            />
        </form>
    );
};

export default CronTestMutationForm;
