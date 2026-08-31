import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import GotraPayInvoiceListContent from '../components/GotraPayInvoiceListContent';
import GotraPayInvoiceDetailContent from '../components/GotraPayInvoiceDetailContent';
import { GotraPayInvoiceEntity } from '@/services/gotrapay-invoice/schema/GotraPayInvoiceSchema';

const GotraPayInvoicePage: React.FC = () => {
    const [selectedInvoice, setSelectedInvoice] = useState<GotraPayInvoiceEntity | null>(null);

    return (
        <AdminLayout>
            {
                selectedInvoice !== null
                    ? <GotraPayInvoiceDetailContent
                        selectedInvoice={selectedInvoice}
                        onBack={() => setSelectedInvoice(null)}
                    />
                    : <div className="flex flex-col items-center justify-center py-20 text-slate-400 border rounded">
                        <p className="text-sm">Pilih invoice dari tab &quot;Daftar Invoice&quot; untuk melihat detail dan melakukan aksi.</p>
                    </div>
            }
            <div className="border-b py-2 mb-4 -mx-4"></div>
            <GotraPayInvoiceListContent
                onSelectInvoice={(invoice) => setSelectedInvoice(invoice)}
            />
        </AdminLayout>
    );
};

export default GotraPayInvoicePage;
