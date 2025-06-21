import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ServiceCard from '../components/landing/ServiceCard';
import { Shield, FileText, Building2, Home } from 'lucide-react';

const services = [
    {
        id: 1,
        title: 'Barangay Indigency',
        description: 'Official certification for indigent residents requiring financial assistance.',
        icon: Shield,
        color: 'bg-blue-50 text-blue-600',
        requirements: ['Valid ID', 'Proof of Income', 'Barangay Certificate']
    },
    {
        id: 2,
        title: 'Barangay Clearance',
        description: 'Document certifying good standing and residency in the barangay.',
        icon: FileText,
        color: 'bg-green-50 text-green-600',
        requirements: ['Valid ID', 'Proof of Residency', 'No Pending Cases']
    },
    {
        id: 3,
        title: 'Business Permit',
        description: 'Authorization to operate business within barangay jurisdiction.',
        icon: Building2,
        color: 'bg-purple-50 text-purple-600',
        requirements: ['Business Registration', 'Location Permit', 'Tax Clearance']
    },
    {
        id: 4,
        title: 'Certificate of Residency',
        description: 'Official proof of residence within the barangay.',
        icon: Home,
        color: 'bg-orange-50 text-orange-600',
        requirements: ['Valid ID', 'Proof of Address', '6 Months Residency']
    }
];

const Services = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
        <Header />
        <main className="flex-1 py-16 px-4">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">Our Services</h1>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map(service => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </div>
        </main>
        <Footer />
    </div>
);

export default Services;
