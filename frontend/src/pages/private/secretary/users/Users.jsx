import React, { useEffect, useState } from 'react';
import { userAPI } from '@/services/api';
import PageLayout from '@/layout/PageLayout';
import { DataTable } from '@/components/custom';
import ResponsiveCard from '@/components/custom/ResponsiveCard';
import { formatDateLong } from '@/lib/utils';
import StatusBadge from '@/components/custom/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Eye } from 'lucide-react';
import { CustomDropdown } from '@/components/custom';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('table'); // 'table' or 'card'
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        userAPI.getUsers()
            .then(res => {
                setUsers(res);
            })
            .catch(err => setError(err?.response?.data?.error || 'Failed to fetch users'))
            .finally(() => setLoading(false));
    }, []);

    const handleView = (id) => {
        navigate(`/secretary/users/${id}/view`);
    };

    const handleVerify = (id) => {
        navigate(`/secretary/users/${id}/view`, { state: { openVerify: true } });
    };

    // Helper: robust string conversion for search
    const safeString = (value) => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };

    // Custom DataTable wrapper to clear filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users.data || []);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredUsers(users.data || []);
        } else {
            setFilteredUsers((users.data || []).filter(user =>
                Object.values(user).some(val => safeString(val).toLowerCase().includes(searchQuery.toLowerCase()))
            ));
        }
    }, [users, searchQuery]);

    const getDisplayName = (user) =>
        user.resident
            ? `${user.resident.firstName || ''} ${user.resident.lastName || ''}`.trim()
            : `${user.firstName || ''} ${user.lastName || ''}`.trim();

    const columns = [
        {
            key: 'firstName',
            id: 'firstName',
            accessorKey: 'firstName',
            label: 'First Name',
            header: 'First Name',
            render: (_, row) => (row.resident ? row.resident.firstName : row.firstName),
        },
        {
            key: 'lastName',
            id: 'lastName',
            accessorKey: 'lastName',
            label: 'Last Name',
            header: 'Last Name',
            render: (_, row) => (row.resident ? row.resident.lastName : row.lastName),
        },
        { key: 'email', id: 'email', accessorKey: 'email', label: 'Email', header: 'Email' },
        { key: 'role', id: 'role', accessorKey: 'role', label: 'Role', header: 'Role' },
        {
            key: 'documentVerified',
            id: 'documentVerified',
            label: 'Document Status',
            header: 'Document Status',
            render: (_, row) => (
                <StatusBadge status={row.documentVerified ? 'Verified' : 'Pending'} />
            ),
        },
        {
            key: 'actions',
            id: 'actions',
            label: 'Actions',
            header: 'Actions',
            render: (_, row) => (
                <CustomDropdown
                    actions={[{
                        label: 'View Details',
                        icon: Eye,
                        onClick: () => handleView(row._id),
                    },
                    !row.documentVerified && {
                        label: 'Verify Document',
                        icon: CheckCircle,
                        onClick: () => handleVerify(row._id),
                    }].filter(Boolean)}
                />
            ),
        },
    ];

    return (
        <PageLayout
            title="Users"
            subtitle="Manage and verify all users."
            breadcrumbs={[{ label: 'Users' }]}
        >
            {loading ? (
                <div className="text-center py-10 text-muted-foreground">Loading users...</div>
            ) : error ? (
                <div className="text-center py-10 text-destructive">{error}</div>
            ) : view === 'table' ? (
                <DataTable columns={columns} data={filteredUsers} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(filteredUsers || []).map(user => (
                        <ResponsiveCard
                            key={user._id}
                            title={getDisplayName(user)}
                            description={user.email}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <span className="font-semibold">Role:</span> {user.role}
                                </div>
                                <div>
                                    <span className="font-semibold">Document Status:</span> <StatusBadge status={user.documentVerified ? 'Verified' : 'Pending'} />
                                </div>
                                <div>
                                    <span className="font-semibold">Resident Info:</span> {user.resident ? `${user.resident.firstName} ${user.resident.lastName}` : 'N/A'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleView(user._id)}><Eye className="w-4 h-4 mr-1" /> View</Button>
                                    {!user.documentVerified && <Button size="sm" variant="default" onClick={() => handleVerify(user._id)}><CheckCircle className="w-4 h-4 mr-1" /> Verify</Button>}
                                </div>
                                <div>
                                    <span className="font-semibold">Created At:</span> {formatDateLong(user.createdAt)}
                                </div>
                            </div>
                        </ResponsiveCard>
                    ))}
                </div>
            )}
        </PageLayout>
    );
}

export default Users;
