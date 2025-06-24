import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PageLayout from '@/layout/PageLayout';
import { createOfficial } from '@/services/api';
import { Form, FormInput } from '@/components/custom';
import { Button } from '@/components/ui/button';
import CustomSelect from '@/components/custom/CustomSelect';

function OfficialsCreate() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [official, setOfficial] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
    });
    const [error, setError] = useState(null);

    const mutation = useMutation({
        mutationFn: createOfficial,
        onSuccess: () => {
            queryClient.invalidateQueries(['officials']);
            navigate('/admin/officials-accounts');
        },
        onError: (err) => {
            setError(err?.response?.data?.message || err?.message || 'Failed to create official');
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOfficial(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        mutation.mutate(official);
    };

    return (
        <PageLayout
            title="Create Official"
            subtitle="Add a new secretary, treasurer, or barangay captain."
            breadcrumbs={[
                { label: 'Officials Accounts', href: '/admin/officials-accounts' },
                { label: 'Create' }
            ]}
        >
            {error && <div className="text-center py-4 text-destructive">{error}</div>}
            <Form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col gap-8 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput label="First Name" name="firstName" value={official.firstName} onChange={handleChange} required placeholder="Enter first name" />
                    <FormInput label="Middle Name" name="middleName" value={official.middleName || ''} onChange={handleChange} placeholder="Enter middle name (optional)" />
                    <FormInput label="Last Name" name="lastName" value={official.lastName} onChange={handleChange} required placeholder="Enter last name" />
                    <FormInput label="Email" name="email" type="email" value={official.email} onChange={handleChange} required placeholder="Enter email" />
                    <FormInput label="Password" name="password" type="password" value={official.password} onChange={handleChange} required placeholder="Create a password" />
                    <CustomSelect
                        label="Role"
                        value={official.role}
                        onChange={value => setOfficial(prev => ({ ...prev, role: value }))}
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
                    <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Create Official'}</Button>
                </div>
            </Form>
        </PageLayout>
    );
}

export default OfficialsCreate;
