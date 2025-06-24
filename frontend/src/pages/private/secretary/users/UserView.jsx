import React, { useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/layout/PageLayout';
import { fetchUserById, verifyUserDocument } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import ConfirmationDialog from '@/components/custom/ConfirmDialog';
import { CheckCircle } from 'lucide-react';
import Section from '@/components/custom/Section';
import Detail from '@/components/custom/Detail';
import ImageModal from '@/components/custom/ImageModal';

function UserView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [imageModal, setImageModal] = useState({ open: false, src: '', alt: '', caption: '' });
    const documentsRef = useRef(null);

    const { data: user, isLoading, error, refetch } = useQuery({
        queryKey: ['user', id],
        queryFn: () => fetchUserById(id),
        select: (res) => res?.data || res,
        staleTime: 5 * 60 * 1000,
    });

    React.useEffect(() => {
        if (location.state && location.state.openVerify && documentsRef.current) {
            documentsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [location.state]);

    const handleVerify = async () => {
        setVerifying(true);
        await verifyUserDocument(id);
        refetch();
        setVerifying(false);
        setConfirmOpen(false);
    };

    const getDisplayName = (user) =>
        user.resident
            ? `${user.resident.firstName || ''} ${user.resident.lastName || ''}`.trim()
            : `${user.firstName || ''} ${user.lastName || ''}`.trim();

    return (
        <PageLayout
            title="User Details"
            subtitle={user ? getDisplayName(user) : 'View User'}
            breadcrumbs={[
                { label: 'Users', href: '/secretary/users' },
                { label: 'View' }
            ]}
        >
            {error ? (
                <div className="text-center py-10 text-destructive">{error.message || 'Failed to fetch user'}</div>
            ) : isLoading ? (
                <div className="max-w-3xl mx-auto grid gap-4 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                </div>
            ) : user ? (
                <div className="max-w-3xl mx-auto flex flex-col gap-8 p-0 sm:p-6">
                    {/* User Information (merged with Resident Info) */}
                    <Section title="User Information">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Detail label="First Name" value={user.resident ? user.resident.firstName : user.firstName} />
                            <Detail label="Middle Name" value={user.resident ? user.resident.middleName : user.middleName} />
                            <Detail label="Last Name" value={user.resident ? user.resident.lastName : user.lastName} />
                            <Detail label="Birth Date" value={user.resident && user.resident.birthDate ? format(new Date(user.resident.birthDate), 'PPP') : ''} />
                            <Detail label="Age" value={user.resident ? user.resident.age : ''} />
                            <Detail label="Gender" value={user.resident ? user.resident.gender : ''} />
                            <Detail label="Purok" value={user.resident ? user.resident.purok : ''} />
                            <Detail label="Civil Status" value={user.resident ? user.resident.civilStatus : ''} />
                            <Detail label="Occupation" value={user.resident ? user.resident.occupation : ''} />
                            <Detail label="Contact Number" value={user.resident ? user.resident.contactNumber : ''} />
                            <Detail label="Email" value={user.email} />
                            <Detail label="Role" value={user.role} />
                            <Detail label="Email Verified" value={user.isEmailVerified ? 'Yes' : 'No'} />
                            <Detail label="Document Verified" value={user.documentVerified ? 'Yes' : 'No'} />
                        </div>
                    </Section>
                    {/* Document Images */}
                    <Section
                        title="Documents"
                        ref={documentsRef}
                        action={
                            user.documentVerified ? (
                                <span className="flex items-center gap-2 mr-5">
                                    <CheckCircle className="text-green-600 w-6 h-6" title="Verified" />
                                    <span className="text-green-700 font-semibold text-base">Verified</span>
                                </span>
                            ) : (
                                <Button
                                    type="button"
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 mr-5"
                                    onClick={() => setConfirmOpen(true)}
                                >
                                    Verify Document
                                </Button>
                            )
                        }
                    >
                        <div className="flex flex-col gap-4">
                            {user.documentType === 'id' && (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <Detail label="ID Front" value={user.idFront ? (
                                            <img
                                                src={user.idFront}
                                                alt="ID Front"
                                                className="w-full max-w-xs rounded border shadow cursor-pointer"
                                                onClick={() => setImageModal({ open: true, src: user.idFront, alt: 'ID Front', caption: 'ID Front' })}
                                            />
                                        ) : '—'} />
                                    </div>
                                    <div className="flex-1">
                                        <Detail label="ID Back" value={user.idBack ? (
                                            <img
                                                src={user.idBack}
                                                alt="ID Back"
                                                className="w-full max-w-xs rounded border shadow cursor-pointer"
                                                onClick={() => setImageModal({ open: true, src: user.idBack, alt: 'ID Back', caption: 'ID Back' })}
                                            />
                                        ) : '—'} />
                                    </div>
                                </div>
                            )}
                            {user.documentType === 'birth_certificate' && (
                                <div className="flex-1">
                                    <Detail label="Birth Certificate" value={user.birthCertificate ? (
                                        <img
                                            src={user.birthCertificate}
                                            alt="Birth Certificate"
                                            className="w-full max-w-xs rounded border shadow cursor-pointer"
                                            onClick={() => setImageModal({ open: true, src: user.birthCertificate, alt: 'Birth Certificate', caption: 'Birth Certificate' })}
                                        />
                                    ) : '—'} />
                                </div>
                            )}
                        </div>
                        <ImageModal
                            open={imageModal.open}
                            onOpenChange={open => setImageModal(m => ({ ...m, open }))}
                            src={imageModal.src}
                            alt={imageModal.alt}
                            caption={imageModal.caption}
                        />
                    </Section>
                    {/* Back Button at the bottom */}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            type="button"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                            onClick={() => navigate('/secretary/users')}
                        >
                            Back
                        </Button>
                    </div>
                    <ConfirmationDialog
                        open={confirmOpen}
                        onConfirm={handleVerify}
                        onCancel={() => setConfirmOpen(false)}
                        title="Verify Document"
                        description="Are you sure you want to verify this user's document?"
                        confirmLabel="Verify"
                        confirmColor="default"
                        loading={verifying}
                    />
                </div>
            ) : null}
        </PageLayout>
    );
}

export default UserView;
