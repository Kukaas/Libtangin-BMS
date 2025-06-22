import React, { useEffect, useState } from 'react';
import { residentAPI } from '@/services/api';
import PageLayout from '@/layout/PageLayout';
import { DataTable } from '@/components/custom';
import ResponsiveCard from '@/components/custom/ResponsiveCard';
import { formatDateLong, formatStatus } from '@/lib/utils';
import StatusBadge from '@/components/custom/StatusBadge';

const columns = [
    { key: 'firstName', id: 'firstName', accessorKey: 'firstName', label: 'First Name', header: 'First Name' },
    { key: 'lastName', id: 'lastName', accessorKey: 'lastName', label: 'Last Name', header: 'Last Name' },
    { key: 'email', id: 'email', accessorKey: 'email', label: 'Email', header: 'Email' },
    { key: 'phone', id: 'phone', accessorKey: 'phone', label: 'Phone', header: 'Phone' },
    { key: 'address', id: 'address', accessorKey: 'address', label: 'Address', header: 'Address' },
    {
        key: 'status',
        id: 'status',
        accessorKey: 'status',
        label: 'Status',
        header: 'Status',
        render: (value) => <StatusBadge status={formatStatus(value)} />,
    },
    {
        key: 'createdAt',
        id: 'createdAt',
        accessorKey: 'createdAt',
        label: 'Created At',
        header: 'Created At',
        render: (value) => formatDateLong(value),
    },
];

function Residents() {
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('table'); // 'table' or 'card'

    useEffect(() => {
        setLoading(true);
        residentAPI.getResidents()
            .then(res => {
                setResidents(Array.isArray(res) ? res : []);
            })
            .catch(err => setError(err?.response?.data?.error || 'Failed to fetch residents'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <PageLayout
            title="Residents"
            subtitle="Manage and view all residents."
            breadcrumbs={[{ label: 'Residents' }]}
        >
            {loading ? (
                <div className="text-center py-10 text-muted-foreground">Loading residents...</div>
            ) : error ? (
                <div className="text-center py-10 text-destructive">{error}</div>
            ) : view === 'table' ? (
                <DataTable columns={columns} data={residents} />
            ) : (
                <DataCard
                    data={residents}
                    renderCard={resident => (
                        <ResponsiveCard
                            title={resident.firstName + ' ' + resident.lastName}
                            description={resident.email}
                            className="mb-4"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <span className="font-semibold">Phone:</span> {resident.phone}
                                </div>
                                <div>
                                    <span className="font-semibold">Address:</span> {resident.address}
                                </div>
                                <div>
                                    <span className="font-semibold">Status:</span> <StatusBadge status={formatStatus(resident.status)} />
                                </div>
                                <div>
                                    <span className="font-semibold">Created At:</span> {formatDateLong(resident.createdAt)}
                                </div>
                            </div>
                        </ResponsiveCard>
                    )}
                />
            )}
        </PageLayout>
    );
}

export default Residents;
