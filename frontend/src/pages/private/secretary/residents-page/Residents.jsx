import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchResidents } from '@/services/api';
import PageLayout from '@/layout/PageLayout';
import { DataTable } from '@/components/custom';
import ResponsiveCard from '@/components/custom/ResponsiveCard';
import { formatDateLong } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus, Download } from 'lucide-react';
import { CustomDropdown } from '@/components/custom';
import { Pencil } from 'lucide-react';

function Residents() {
    const [view, setView] = useState('table'); // 'table' or 'card'
    const navigate = useNavigate();
    const { data: residents = [], isLoading, error } = useQuery({
        queryKey: ['residents'],
        queryFn: fetchResidents,
        select: (res) => Array.isArray(res) ? res : res?.data || [],
        staleTime: 5 * 60 * 1000,
    });

    const handleEdit = (id) => {
        navigate(`/secretary/residents/${id}/edit`);
    };

    const handleView = (id) => {
        navigate(`/secretary/residents/${id}/view`);
    };

    const handleCreate = () => {
        navigate('/secretary/residents/create');
    };

    const handleExport = () => {
        // Placeholder for export logic
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
            actions={
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 w-full sm:w-auto">
                    <Button onClick={handleExport} variant="outline" className="w-full sm:w-auto" type="button">
                        <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                    <Button onClick={handleCreate} className="w-full sm:w-auto" type="button">
                        <Plus className="w-4 h-4 mr-2" /> Create
                    </Button>
                </div>
            }
        >
            {isLoading ? (
                <div className="text-center py-10 text-muted-foreground">Loading residents...</div>
            ) : error ? (
                <div className="text-center py-10 text-destructive">{error.message || 'Failed to fetch residents'}</div>
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
