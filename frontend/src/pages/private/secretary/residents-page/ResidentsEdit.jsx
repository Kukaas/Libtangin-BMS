import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageLayout from '@/layout/PageLayout';
import { fetchResidentById, updateResident } from '@/services/api';
import { Form, FormInput, DatePicker, CustomSelect } from '@/components/custom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { differenceInYears, isValid } from 'date-fns'
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

function ResidentsEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: resident, isLoading, error } = useQuery({
        queryKey: ['resident', id],
        queryFn: () => fetchResidentById(id),
        select: (res) => res?.data || res,
        staleTime: 5 * 60 * 1000,
    });
    const [formState, setFormState] = useState(null);
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (resident) setFormState(resident);
    }, [resident]);

    const mutation = useMutation({
        mutationFn: (data) => updateResident(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['residents']);
            queryClient.invalidateQueries(['resident', id]);
            navigate('/secretary/residents');
        },
        onError: (err) => {
            setFormError(err?.message || 'Failed to update resident');
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleParentChange = (parent, field, value) => {
        setFormState(prev => ({
            ...prev,
            parents: {
                ...prev.parents,
                [parent]: {
                    ...prev.parents[parent],
                    [field]: value
                }
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(null);
        mutation.mutate(formState);
    };

    const handleBirthDateChange = (date) => {
        if (date && isValid(date)) {
            const age = differenceInYears(new Date(), date);
            setFormState(prev => ({
                ...prev,
                birthDate: date.toISOString(),
                age: age
            }));
        } else {
            setFormState(prev => ({ ...prev, birthDate: '', age: '' }));
        }
    };

    // Helper for date value
    const birthDateValue = formState?.birthDate ? new Date(formState.birthDate) : null;

    return (
        <PageLayout
            title="Edit Resident"
            subtitle={formState ? `Editing ${formState.firstName} ${formState.lastName}` : 'Editing Resident'}
            breadcrumbs={[
                { label: 'Residents', href: '/residents' },
                { label: 'Edit' }
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
                    <div className="flex justify-end gap-2 mt-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            ) : formState ? (
                <ScrollArea className="max-h-[80vh] w-full pr-2">
                    <Form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex flex-col gap-8 p-4">
                        {/* Personal Information */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4 text-primary">Personal Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormInput label="First Name" name="firstName" value={formState.firstName} onChange={handleChange} required />
                                <FormInput label="Middle Name" name="middleName" value={formState.middleName || ''} onChange={handleChange} />
                                <FormInput label="Last Name" name="lastName" value={formState.lastName} onChange={handleChange} required />
                                <DatePicker
                                    label="Birth Date"
                                    value={formState.birthDate}
                                    onChange={handleBirthDateChange}
                                    required
                                />
                                <FormInput label="Age" name="age" type="number" value={formState.age} onChange={handleChange} required disabled />
                                <CustomSelect
                                    label="Gender"
                                    value={formState.gender}
                                    onChange={value => handleChange({ target: { name: 'gender', value } })}
                                    required
                                    placeholder="Select gender"
                                    options={[
                                        { value: 'Male', label: 'Male' },
                                        { value: 'Female', label: 'Female' },
                                    ]}
                                />
                            </div>
                        </section>
                        {/* Contact & Address */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4 text-primary">Contact & Address</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <CustomSelect
                                    label="Purok"
                                    value={formState.purok}
                                    onChange={value => handleChange({ target: { name: 'purok', value } })}
                                    required
                                    placeholder="Select purok"
                                    options={Array.from({ length: 7 }, (_, i) => ({ value: `Purok ${i + 1}`, label: `Purok ${i + 1}` }))}
                                />
                                <CustomSelect
                                    label="Civil Status"
                                    value={formState.civilStatus}
                                    onChange={value => handleChange({ target: { name: 'civilStatus', value } })}
                                    required
                                    placeholder="Select civil status"
                                    options={[
                                        { value: 'Single', label: 'Single' },
                                        { value: 'Married', label: 'Married' },
                                        { value: 'Divorced', label: 'Divorced' },
                                        { value: 'Widowed', label: 'Widowed' },
                                    ]}
                                />
                                <FormInput label="Occupation" name="occupation" value={formState.occupation} onChange={handleChange} required />
                                <FormInput label="Contact Number" name="contactNumber" value={formState.contactNumber} onChange={handleChange} required />
                            </div>
                        </section>
                        {/* Parents Information */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4 text-primary">Parents Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormInput label="Father's Name" name="fatherName" value={formState.parents?.father?.name || ''} onChange={e => handleParentChange('father', 'name', e.target.value)} placeholder="Enter father's name (optional)" disabled={!!formState.parents?.father?.deceased} />
                                <FormInput label="Father's Occupation" name="fatherOccupation" value={formState.parents?.father?.occupation || ''} onChange={e => handleParentChange('father', 'occupation', e.target.value)} placeholder="Enter father's occupation (optional)" disabled={!!formState.parents?.father?.deceased} />
                                <FormInput label="Father's Contact" name="fatherContactNumber" value={formState.parents?.father?.contactNumber || ''} onChange={e => handleParentChange('father', 'contactNumber', e.target.value)} placeholder="Enter father's contact number (optional)" disabled={!!formState.parents?.father?.deceased} />
                                <div className="flex items-center gap-2 mt-1">
                                    <Checkbox id="fatherDeceased" checked={!!formState.parents?.father?.deceased} onCheckedChange={checked => handleParentChange('father', 'deceased', checked)} />
                                    <label htmlFor="fatherDeceased" className="text-sm">Father Deceased</label>
                                </div>
                                <FormInput label="Mother's Name" name="motherName" value={formState.parents?.mother?.name || ''} onChange={e => handleParentChange('mother', 'name', e.target.value)} placeholder="Enter mother's name (optional)" disabled={!!formState.parents?.mother?.deceased} />
                                <FormInput label="Mother's Occupation" name="motherOccupation" value={formState.parents?.mother?.occupation || ''} onChange={e => handleParentChange('mother', 'occupation', e.target.value)} placeholder="Enter mother's occupation (optional)" disabled={!!formState.parents?.mother?.deceased} />
                                <FormInput label="Mother's Contact" name="motherContactNumber" value={formState.parents?.mother?.contactNumber || ''} onChange={e => handleParentChange('mother', 'contactNumber', e.target.value)} placeholder="Enter mother's contact number (optional)" disabled={!!formState.parents?.mother?.deceased} />
                                <div className="flex items-center gap-2 mt-1">
                                    <Checkbox id="motherDeceased" checked={!!formState.parents?.mother?.deceased} onCheckedChange={checked => handleParentChange('mother', 'deceased', checked)} />
                                    <label htmlFor="motherDeceased" className="text-sm">Mother Deceased</label>
                                </div>
                            </div>
                        </section>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button type="button" variant="secondary" onClick={() => navigate('/residents')}>Cancel</Button>
                            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Save Changes'}</Button>
                        </div>
                    </Form>
                </ScrollArea>
            ) : null}
        </PageLayout>
    );
}

export default ResidentsEdit;
