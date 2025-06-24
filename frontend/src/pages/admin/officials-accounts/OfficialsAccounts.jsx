import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOfficials, deleteOfficial } from '@/services/api';
import PageLayout from '@/layout/PageLayout';
import { DataTable } from '@/components/custom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { CustomDropdown } from '@/components/custom';
import ConfirmationDialog from '@/components/custom/ConfirmDialog';

function OfficialsAccounts() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: officials = [], isLoading, error } = useQuery({
        queryKey: ['officials'],
        queryFn: fetchOfficials,
        select: (res) => Array.isArray(res) ? res : res?.data || [],
        staleTime: 5 * 60 * 1000,
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const mutation = useMutation({
        mutationFn: deleteOfficial,
        onSuccess: () => {
            queryClient.invalidateQueries(['officials']);
            setDeleteDialogOpen(false);
            setSelectedId(null);
        },
    });

    const handleView = (id) => {
        navigate(`/admin/officials-accounts/${id}/view`);
    };
    const handleEdit = (id) => {
        navigate(`/admin/officials-accounts/${id}/edit`);
    };
    const handleCreate = () => {
        navigate('/admin/officials-accounts/create');
    };
    const handleDelete = (id) => {
        setSelectedId(id);
        setDeleteDialogOpen(true);
    };
    const handleConfirmDelete = () => {
        if (selectedId) {
            mutation.mutate(selectedId);
        }
    };
    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedId(null);
    };

    const columns = [
        { key: 'firstName', id: 'firstName', accessorKey: 'firstName', label: 'First Name', header: 'First Name' },
        { key: 'lastName', id: 'lastName', accessorKey: 'lastName', label: 'Last Name', header: 'Last Name' },
        { key: 'email', id: 'email', accessorKey: 'email', label: 'Email', header: 'Email' },
        { key: 'role', id: 'role', accessorKey: 'role', label: 'Role', header: 'Role' },
        {
            key: 'actions',
            id: 'actions',
            label: 'Actions',
            header: 'Actions',
            render: (_, row) => (
                <CustomDropdown
                    actions={[{
                        label: 'View',
                        icon: Eye,
                        onClick: () => handleView(row._id),
                    }, {
                        label: 'Edit',
                        icon: Pencil,
                        onClick: () => handleEdit(row._id),
                    }, {
                        label: 'Delete',
                        icon: Trash2,
                        onClick: () => handleDelete(row._id),
                    }]}
                />
            ),
        },
    ];

    return (
        <PageLayout
            title="Officials Accounts"
            subtitle="Manage secretary, treasurer, and barangay captain accounts."
            breadcrumbs={[{ label: 'Officials Accounts' }]}
            actions={
                <Button onClick={handleCreate} className="w-full sm:w-auto" type="button">
                    <Plus className="w-4 h-4 mr-2" /> Create
                </Button>
            }
        >
            {isLoading ? (
                <div className="text-center py-10 text-muted-foreground">Loading officials...</div>
            ) : error ? (
                <div className="text-center py-10 text-destructive">{error.message || 'Failed to fetch officials'}</div>
            ) : (
                <DataTable columns={columns} data={officials} />
            )}
            <ConfirmationDialog
                open={deleteDialogOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Delete Official"
                description="Are you sure you want to delete this official? This action cannot be undone."
                confirmLabel="Delete"
                confirmColor="destructive"
                loading={mutation.isPending}
            />
        </PageLayout>
    );
}

export default OfficialsAccounts;
