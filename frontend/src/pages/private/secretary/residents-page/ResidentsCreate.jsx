import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PageLayout from '@/layout/PageLayout';
import { createResident } from '@/services/api';
import { Form, FormInput, DatePicker, CustomSelect } from '@/components/custom';
import { Button } from '@/components/ui/button';
import { differenceInYears, isValid } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

function ResidentsCreate() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [resident, setResident] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        birthDate: '',
        age: '',
        gender: '',
        purok: '',
        civilStatus: '',
        occupation: '',
        contactNumber: '',
        parents: {
            father: { name: '', occupation: '', contactNumber: '' },
            mother: { name: '', occupation: '', contactNumber: '' },
        },
    });
    const [error, setError] = useState(null);

    const mutation = useMutation({
        mutationFn: createResident,
        onSuccess: () => {
            queryClient.invalidateQueries(['residents']);
            navigate('/secretary/residents');
        },
        onError: (err) => {
            setError(err?.message || err?.error || 'Failed to create resident');
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResident(prev => ({ ...prev, [name]: value }));
    };

    const handleParentChange = (parent, field, value) => {
        setResident(prev => ({
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
        setError(null);
        mutation.mutate(resident);
    };

    const handleBirthDateChange = (date) => {
        if (date && isValid(date)) {
            const age = differenceInYears(new Date(), date);
            setResident(prev => ({
                ...prev,
                birthDate: date.toISOString(),
                age: age
            }));
        } else {
            setResident(prev => ({ ...prev, birthDate: '', age: '' }));
        }
    };

    return (
        <PageLayout
            title="Create Resident"
            subtitle="Add a new resident to the system."
            breadcrumbs={[
                { label: 'Residents', href: '/residents' },
                { label: 'Create' }
            ]}
        >
            {error && <div className="text-center py-4 text-destructive">{error}</div>}
            <ScrollArea className="max-h-[80vh] w-full pr-2">
                <Form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex flex-col gap-8 p-4">
                    {/* Personal Information */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4 text-primary">Personal Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput label="First Name" name="firstName" value={resident.firstName} onChange={handleChange} required placeholder="Enter first name" />
                            <FormInput label="Middle Name" name="middleName" value={resident.middleName || ''} onChange={handleChange} placeholder="Enter middle name (optional)" />
                            <FormInput label="Last Name" name="lastName" value={resident.lastName} onChange={handleChange} required placeholder="Enter last name" />
                            <DatePicker
                                label="Birth Date"
                                value={resident.birthDate}
                                onChange={handleBirthDateChange}
                                required
                                placeholder="Select birth date"
                            />
                            <FormInput label="Age" name="age" type="number" value={resident.age} onChange={handleChange} required disabled placeholder="Auto-calculated" />
                            <CustomSelect
                                label="Gender"
                                value={resident.gender}
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
                                value={resident.purok}
                                onChange={value => handleChange({ target: { name: 'purok', value } })}
                                required
                                placeholder="Select purok"
                                options={Array.from({ length: 7 }, (_, i) => ({ value: `Purok ${i + 1}`, label: `Purok ${i + 1}` }))}
                            />
                            <CustomSelect
                                label="Civil Status"
                                value={resident.civilStatus}
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
                            <FormInput label="Occupation" name="occupation" value={resident.occupation} onChange={handleChange} required placeholder="Enter occupation" />
                            <FormInput label="Contact Number" name="contactNumber" value={resident.contactNumber} onChange={handleChange} required placeholder="Enter contact number" />
                        </div>
                    </section>
                    {/* Parents Information */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4 text-primary">Parents Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput label="Father's Name" name="fatherName" value={resident.parents.father.name} onChange={e => handleParentChange('father', 'name', e.target.value)} placeholder="Enter father's name (optional)" disabled={!!resident.parents.father.deceased} />
                            <FormInput label="Father's Occupation" name="fatherOccupation" value={resident.parents.father.occupation} onChange={e => handleParentChange('father', 'occupation', e.target.value)} placeholder="Enter father's occupation (optional)" disabled={!!resident.parents.father.deceased} />
                            <FormInput label="Father's Contact" name="fatherContactNumber" value={resident.parents.father.contactNumber} onChange={e => handleParentChange('father', 'contactNumber', e.target.value)} placeholder="Enter father's contact number (optional)" disabled={!!resident.parents.father.deceased} />
                            <div className="flex items-center gap-2 mt-1">
                                <Checkbox id="fatherDeceased" checked={!!resident.parents.father.deceased} onCheckedChange={checked => handleParentChange('father', 'deceased', checked)} />
                                <label htmlFor="fatherDeceased" className="text-sm">Father Deceased</label>
                            </div>
                            <FormInput label="Mother's Name" name="motherName" value={resident.parents.mother.name} onChange={e => handleParentChange('mother', 'name', e.target.value)} placeholder="Enter mother's name (optional)" disabled={!!resident.parents.mother.deceased} />
                            <FormInput label="Mother's Occupation" name="motherOccupation" value={resident.parents.mother.occupation} onChange={e => handleParentChange('mother', 'occupation', e.target.value)} placeholder="Enter mother's occupation (optional)" disabled={!!resident.parents.mother.deceased} />
                            <FormInput label="Mother's Contact" name="motherContactNumber" value={resident.parents.mother.contactNumber} onChange={e => handleParentChange('mother', 'contactNumber', e.target.value)} placeholder="Enter mother's contact number (optional)" disabled={!!resident.parents.mother.deceased} />
                            <div className="flex items-center gap-2 mt-1">
                                <Checkbox id="motherDeceased" checked={!!resident.parents.mother.deceased} onCheckedChange={checked => handleParentChange('mother', 'deceased', checked)} />
                                <label htmlFor="motherDeceased" className="text-sm">Mother Deceased</label>
                            </div>
                        </div>
                    </section>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/secretary/residents')}>Cancel</Button>
                        <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Create Resident'}</Button>
                    </div>
                </Form>
            </ScrollArea>
        </PageLayout>
    );
}

export default ResidentsCreate;
