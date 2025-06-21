import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield, Users, Clock, CheckCircle } from 'lucide-react';

const features = [
    {
        icon: Clock,
        title: 'Fast Processing',
        description: 'Quick turnaround time for all document requests.'
    },
    {
        icon: CheckCircle,
        title: 'Verified Documents',
        description: 'All certificates are officially verified and authenticated.'
    },
    {
        icon: Users,
        title: 'Expert Staff',
        description: 'Experienced personnel to assist with your needs.'
    }
];

const About = () => (
    <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 py-16 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="flex flex-col items-center mb-12">
                    <Shield className="w-16 h-16 text-blue-600 mb-4" />
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">About Libtangin Barangay</h1>
                    <p className="text-slate-600 text-center mb-6">
                        Libtangin Barangay is committed to providing efficient and accessible services to all residents. Our modern management system ensures quick processing times and secure document handling. We strive to deliver excellent public service with integrity and professionalism.
                    </p>
                    <div className="space-y-2 text-slate-700 text-center">
                        <div>Mission: To serve the community with transparency, efficiency, and compassion.</div>
                        <div>Vision: A progressive barangay with empowered and satisfied residents.</div>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                    {features.map((feature, idx) => (
                        <div key={idx} className="text-center p-6 bg-slate-50 rounded-xl shadow hover:shadow-md transition">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <feature.icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-slate-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
        <Footer />
    </div>
);

export default About;
