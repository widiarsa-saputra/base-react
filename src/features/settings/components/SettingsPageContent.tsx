import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WhatsappSettings from './WhatsappSettings';
import EmailSettings from './EmailSettings';
import DataManagement from './DataManagement';
import CronNotificationTest from './CronNotificationTest';
import { Settings, MessageSquare, Mail, Database, ChevronRight, Clock } from 'lucide-react';

const SettingsPageContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState("whatsapp");

    return (
        <main className="p-2 sm:p-3 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3 px-1">
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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
                <TabsList className="bg-white p-1 h-auto flex-wrap justify-start gap-1 rounded border border-slate-100 shadow-sm sticky top-0 z-10">
                    <TabsTrigger 
                        value="whatsapp" 
                        className="data-[state=active]:bg-brand-navy data-[state=active]:text-white data-[state=active]:shadow-sm px-5 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 rounded transition-all"
                    >
                        <MessageSquare className="h-3.5 w-3.5" />
                        WhatsApp Gateway
                    </TabsTrigger>
                    <TabsTrigger 
                        value="email" 
                        className="data-[state=active]:bg-brand-navy data-[state=active]:text-white data-[state=active]:shadow-sm px-5 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 rounded transition-all"
                    >
                        <Mail className="h-3.5 w-3.5" />
                        Email Settings
                    </TabsTrigger>
                    <TabsTrigger 
                        value="cron-test" 
                        className="data-[state=active]:bg-brand-navy data-[state=active]:text-white data-[state=active]:shadow-sm px-5 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 rounded transition-all"
                    >
                        <Clock className="h-3.5 w-3.5" />
                        Cron Job Test
                    </TabsTrigger>
                    <TabsTrigger 
                        value="data" 
                        className="data-[state=active]:bg-brand-navy data-[state=active]:text-white data-[state=active]:shadow-sm px-5 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 rounded transition-all"
                    >
                        <Database className="h-3.5 w-3.5" />
                        Data Management
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="whatsapp" className="focus-visible:outline-none focus-visible:ring-0">
                    <WhatsappSettings />
                </TabsContent>
                
                <TabsContent value="email" className="focus-visible:outline-none focus-visible:ring-0">
                    <EmailSettings />
                </TabsContent>

                <TabsContent value="cron-test" className="focus-visible:outline-none focus-visible:ring-0">
                    <CronNotificationTest />
                </TabsContent>
                
                <TabsContent value="data" className="focus-visible:outline-none focus-visible:ring-0">
                    <DataManagement />
                </TabsContent>
            </Tabs>
        </main>
    );
};

export default SettingsPageContent;
