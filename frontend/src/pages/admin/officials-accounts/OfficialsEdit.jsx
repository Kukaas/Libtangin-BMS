import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageLayout from '@/layout/PageLayout';
import { fetchOfficialById, updateOfficial } from '@/services/api';
import { Form, FormInput } from '@/components/custom';
import { Button } from '@/components/ui/button';
import CustomSelect from '@/components/custom/CustomSelect';

function OfficialsEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: official, isLoading, error } = useQuery({
        queryKey: ['official', id],
        queryFn: () => fetchOfficialById(id),
        select: (res) => res?.data || res,
        staleTime: 5 * 60 * 1000,
    });
    const [formState, setFormState] = useState(null);
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (official) setFormState(official);
    }, [official]);

    const mutation = useMutation({
        mutationFn: (data) => updateOfficial(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['officials']);
            queryClient.invalidateQueries(['official', id]);
            navigate('/admin/officials-accounts');
        },
        onError: (err) => {
            setFormError(err?.response?.data?.message || err?.message || 'Failed to update official');
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(null);
        mutation.mutate(formState);
    };

    return (
        <PageLayout
            title="Edit Official"
            subtitle={formState ? `Editing ${formState.firstName} ${formState.lastName}` : 'Editing Official'}
            breadcrumbs={[
                { label: 'Officials Accounts', href: '/admin/officials-accounts' },
                { label: 'Edit' }
            ]}
        >
            {error ? (
                <div className="text-center py-10 text-destructive">{error.message || 'Failed to fetch official'}</div>
            ) : isLoading ? (
                <div className="max-w-3xl mx-auto grid gap-4 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[...Array(6)].map((_, i) => <div key={i} className="h-10 w-full bg-slate-100 rounded animate-pulse" />)}
                    </div>
                </div>
            ) : formState ? (
                <Form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col gap-8 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput label="First Name" name="firstName" value={formState.firstName} onChange={handleChange} required placeholder="Enter first name" />
                        <FormInput label="Middle Name" name="middleName" value={formState.middleName || ''} onChange={handleChange} placeholder="Enter middle name (optional)" />
                        <FormInput label="Last Name" name="lastName" value={formState.lastName} onChange={handleChange} required placeholder="Enter last name" />
                        <FormInput label="Email" name="email" type="email" value={formState.email} onChange={handleChange} required placeholder="Enter email" />
                        <FormInput label="Password" name="password" type="password" value={formState.password || ''} onChange={handleChange} placeholder="Leave blank to keep current password" />
                        <CustomSelect
                            label="Role"
                            value={formState.role}
                            onChange={value => setFormState(prev => ({ ...prev, role: value }))}
                            required
                            placeholder="Select role"
                            options={[
                                { value: 'secretary', label: 'Secretary' },
                                { value: 'treasurer', label: 'Treasurer' },
                                { value: 'barangay_captain', label: 'Barangay Captain' },
                            ]}
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/admin/officials-accounts')}>Cancel</Button>
                        <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Save Changes'}</Button>
                    </div>
                    {formError && <div className="text-center py-4 text-destructive">{formError}</div>}
                </Form>
            ) : null}
        </PageLayout>
    );
}

export default OfficialsEdit;
