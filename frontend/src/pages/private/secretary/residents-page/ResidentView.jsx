import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/layout/PageLayout';
import { fetchResidentById } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import Section from '@/components/custom/Section';
import Detail from '@/components/custom/Detail';

function ResidentView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: resident, isLoading, error } = useQuery({
        queryKey: ['resident', id],
        queryFn: () => fetchResidentById(id),
        select: (res) => res?.data || res,
        staleTime: 5 * 60 * 1000,
    });

    // Helper for avatar initials
    const getInitials = (first, last) => {
        if (!first && !last) return '?';
        return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
    };

    return (
        <PageLayout
            title="Resident Details"
            subtitle={resident ? `${resident.firstName} ${resident.lastName}` : 'View Resident'}
            breadcrumbs={[
                { label: 'Residents', href: '/secretary/residents' },
                { label: 'View' }
            ]}
        >
            {error ? (
                <div className="text-center py-10 text-destructive">{error.message || 'Failed to fetch resident'}</div>
            ) : isLoading ? (
                <div className="max-w-3xl mx-auto grid gap-4 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                </div>
            ) : resident ? (
                <div className="max-w-3xl mx-auto flex flex-col gap-8 p-0 sm:p-6">
                    {/* Personal Information */}
                    <Section title="Personal Information">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Detail label="First Name" value={resident.firstName} />
                            <Detail label="Middle Name" value={resident.middleName} />
                            <Detail label="Last Name" value={resident.lastName} />
                            <Detail label="Birth Date" value={resident.birthDate ? format(new Date(resident.birthDate), 'PPP') : ''} />
                            <Detail label="Age" value={resident.age} />
                            <Detail label="Gender" value={resident.gender} />
                        </div>
                    </Section>
                    {/* Contact & Address */}
                    <Section title="Contact & Address">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Detail label="Purok" value={resident.purok} />
                            <Detail label="Civil Status" value={resident.civilStatus} />
                            <Detail label="Occupation" value={resident.occupation} />
                            <Detail label="Contact Number" value={resident.contactNumber} />
                        </div>
                    </Section>
                    {/* Parents Information */}
                    <Section title="Parents Information">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Detail label="Father's Name" value={resident.parents?.father?.name} deceased={resident.parents?.father?.deceased} />
                            <Detail label="Father's Occupation" value={resident.parents?.father?.occupation} />
                            <Detail label="Father's Contact" value={resident.parents?.father?.contactNumber} />
                            <Detail label="Mother's Name" value={resident.parents?.mother?.name} deceased={resident.parents?.mother?.deceased} />
                            <Detail label="Mother's Occupation" value={resident.parents?.mother?.occupation} />
                            <Detail label="Mother's Contact" value={resident.parents?.mother?.contactNumber} />
                        </div>
                    </Section>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            type="button"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded"
                            onClick={() => navigate('/secretary/residents')}
                        >
                            Back
                        </Button>
                    </div>
                </div>
            ) : null}
        </PageLayout>
    );
}

export default ResidentView;
