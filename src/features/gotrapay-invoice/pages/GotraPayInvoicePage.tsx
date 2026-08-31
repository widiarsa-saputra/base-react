import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import TabsSections from '@/components/TabsSections';
import GotraPayInvoiceListContent from '../components/GotraPayInvoiceListContent';
import GotraPayInvoiceDetailContent from '../components/GotraPayInvoiceDetailContent';
import { GotraPayInvoiceEntity } from '@/services/gotrapay-invoice/schema/GotraPayInvoiceSchema';

const GotraPayInvoicePage: React.FC = () => {
    const [selectedInvoice, setSelectedInvoice] = useState<GotraPayInvoiceEntity | null>(null);

    return (
        <AdminLayout>
            <TabsSections
                contentStyles="mx-4 my-4"
                tabObjects={[
                    {
                        trigger: 'Daftar Invoice',
                        content: (
                            <GotraPayInvoiceListContent
                                onSelectInvoice={(invoice) => setSelectedInvoice(invoice)}
                            />
                        ),
                    },
                    {
                        trigger: 'Detail & Manajemen',
                        content: selectedInvoice ? (
                            <GotraPayInvoiceDetailContent
                                selectedInvoice={selectedInvoice}
                                onBack={() => setSelectedInvoice(null)}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <p className="text-sm">Pilih invoice dari tab &quot;Daftar Invoice&quot; untuk melihat detail dan melakukan aksi.</p>
                            </div>
                        ),
                    },
                ]}
            />
        </AdminLayout>
    );
};

export default GotraPayInvoicePage;
