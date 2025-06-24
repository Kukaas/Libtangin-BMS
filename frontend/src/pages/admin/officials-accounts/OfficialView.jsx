import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/layout/PageLayout';
import { fetchOfficialById } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Section from '@/components/custom/Section';
import Detail from '@/components/custom/Detail';

function OfficialView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: official, isLoading, error } = useQuery({
        queryKey: ['official', id],
        queryFn: () => fetchOfficialById(id),
        select: (res) => res?.data || res,
        staleTime: 5 * 60 * 1000,
    });

    return (
        <PageLayout
            title="Official Details"
            subtitle={official ? `${official.firstName} ${official.lastName}` : 'View Official'}
            breadcrumbs={[
                { label: 'Officials Accounts', href: '/admin/officials-accounts' },
                { label: 'View' }
            ]}
        >
            {error ? (
                <div className="text-center py-10 text-destructive">{error.message || 'Failed to fetch official'}</div>
            ) : isLoading ? (
                <div className="max-w-3xl mx-auto grid gap-4 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                </div>
            ) : official ? (
                <div className="max-w-3xl mx-auto flex flex-col gap-8 p-0 sm:p-6">
                    <Section title="Official Information">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Detail label="First Name" value={official.firstName} />
                            <Detail label="Middle Name" value={official.middleName} />
                            <Detail label="Last Name" value={official.lastName} />
                            <Detail label="Email" value={official.email} />
                            <Detail label="Role" value={official.role} />
                        </div>
                    </Section>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            type="button"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                            onClick={() => navigate('/admin/officials-accounts')}
                        >
                            Back
                        </Button>
                    </div>
                </div>
            ) : null}
        </PageLayout>
    );
}

export default OfficialView;
