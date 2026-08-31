import React, { useState } from 'react';
import TabsSections from '@/components/TabsSections';
import WhatsappSettings from './WhatsappSettings';
import EmailSettings from './EmailSettings';
import DataManagement from './DataManagement';
import CronNotificationTest from './CronNotificationTest';
import { Settings, ChevronRight } from 'lucide-react';

const SettingsPageContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState("whatsapp-gateway");

    return (
        <main className="animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-brand-navy">
                    <div className="w-9 h-9 rounded bg-brand-navy/10 flex items-center justify-center shrink-0 shadow-inner">
                        <Settings className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight uppercase italic leading-none">System Configuration</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pusat Kendali Sistem</p>
                            <ChevronRight className="h-3 w-3 text-slate-300" />
                            <p className="text-[10px] text-brand-navy font-black uppercase tracking-widest italic">{activeTab}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-[calc(100vh-140px)]">
                <TabsSections
                    value={activeTab}
                    onValueChange={setActiveTab}
                    tabObjects={[
                        {
                            trigger: "whatsapp-gateway",
                            content: <WhatsappSettings />
                        },
                        {
                            trigger: "email-settings",
                            content: <EmailSettings />
                        },
                        {
                            trigger: "cron-job-test",
                            content: <CronNotificationTest />
                        },
                        {
                            trigger: "data-management",
                            content: <DataManagement />
                        }
                    ]}
                />
            </div>
        </main>
    );
};

export default SettingsPageContent;
