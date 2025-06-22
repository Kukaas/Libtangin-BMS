import React, { useEffect, useState } from 'react';
import { residentAPI } from '@/services/api';
import PageLayout from '@/layout/PageLayout';
import { DataTable } from '@/components/custom';
import ResponsiveCard from '@/components/custom/ResponsiveCard';
import { formatDateLong, formatStatus } from '@/lib/utils';
import StatusBadge from '@/components/custom/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { CustomDropdown } from '@/components/custom';
import { Pencil } from 'lucide-react';

function Residents() {
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('table'); // 'table' or 'card'
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        residentAPI.getResidents()
            .then(res => {
                setResidents(Array.isArray(res) ? res : []);
            })
            .catch(err => setError(err?.response?.data?.error || 'Failed to fetch residents'))
            .finally(() => setLoading(false));
    }, []);

    const handleEdit = (id) => {
        navigate(`/secretary/residents/${id}/edit`);
    };

    const handleView = (id) => {
        navigate(`/secretary/residents/${id}/view`);
    };

    const columns = [
        { key: 'firstName', id: 'firstName', accessorKey: 'firstName', label: 'First Name', header: 'First Name' },
        { key: 'lastName', id: 'lastName', accessorKey: 'lastName', label: 'Last Name', header: 'Last Name' },
        { key: 'email', id: 'email', accessorKey: 'email', label: 'Email', header: 'Email' },
        { key: 'phone', id: 'phone', accessorKey: 'phone', label: 'Phone', header: 'Phone' },
        { key: 'address', id: 'address', accessorKey: 'address', label: 'Address', header: 'Address' },
        {
            key: 'actions',
            id: 'actions',
            label: 'Actions',
            header: 'Actions',
            render: (_, row) => (
                <CustomDropdown
                    actions={[{
                        label: 'View Details',
                        icon: MoreHorizontal,
                        onClick: () => handleView(row._id),
                    }, {
                        label: 'Edit',
                        icon: Pencil,
                        onClick: () => handleEdit(row._id),
                    }]}
                />
            ),
        },
    ];

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
                                <div className="flex items-center gap-2">
                                    <CustomDropdown
                                        actions={[{
                                            label: 'View Details',
                                            icon: MoreHorizontal,
                                            onClick: () => handleView(resident._id),
                                        }, {
                                            label: 'Edit',
                                            icon: Pencil,
                                            onClick: () => handleEdit(resident._id),
                                        }]}
                                    />
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
