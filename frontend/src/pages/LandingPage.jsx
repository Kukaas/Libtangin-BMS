import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import {
    FileText,
    Building2,
    Home,
    Shield,
    ArrowRight,
    Users,
    Clock,
    CheckCircle,
    Phone,
    Mail,
    MapPin
} from 'lucide-react';
import ServiceCard from '../components/landing/ServiceCard';
import ContactCard from '../components/landing/ContactCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage = () => {
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

    const features = [
        {
            icon: Clock,
            title: 'Fast Processing',
            description: 'Quick turnaround time for all document requests'
        },
        {
            icon: CheckCircle,
            title: 'Verified Documents',
            description: 'All certificates are officially verified and authenticated'
        },
        {
            icon: Users,
            title: 'Expert Staff',
            description: 'Experienced personnel to assist with your needs'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 px-4">
                    <div className="container mx-auto text-center">
                        <Badge variant="secondary" className="mb-4 px-4 py-2">
                            Welcome to Libtangin Barangay Management System
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                            Streamlined
                            <span className="text-blue-600"> Barangay Services</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                            Access essential barangay documents and services with ease.
                            Modern, efficient, and secure processing for all your needs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="px-8 py-3">
                                Get Started
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="lg" className="px-8 py-3">
                                Learn More
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 px-4 bg-white">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Us</h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                We provide efficient, reliable, and secure barangay services to meet all your needs.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                                    <CardContent className="pt-6">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                            <feature.icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                                        <p className="text-slate-600">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="py-16 px-4">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Services</h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                Access all essential barangay documents and permits through our streamlined system.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {services.map((service) => (
                                <ServiceCard key={service.id} service={service} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-16 px-4 bg-white">
                    <div className="container mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6">About Libtangin Barangay</h2>
                                <p className="text-slate-600 mb-6">
                                    Libtangin Barangay is committed to providing efficient and accessible services to all residents.
                                    Our modern management system ensures quick processing times and secure document handling.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-slate-700">24/7 Online Access</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-slate-700">Secure Document Processing</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-slate-700">Professional Staff Support</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
                                <div className="text-center">
                                    <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Trusted by Residents</h3>
                                    <p className="text-slate-600">
                                        Join thousands of satisfied residents who have used our services.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-16 px-4">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Contact Us</h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                Get in touch with us for any inquiries or assistance with our services.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <ContactCard
                                icon={MapPin}
                                title="Visit Us"
                                content="Libtangin Barangay Hall, Main Street, Libtangin"
                            />
                            <ContactCard
                                icon={Phone}
                                title="Call Us"
                                content="+63 912 345 6789"
                            />
                            <ContactCard
                                icon={Mail}
                                title="Email Us"
                                content="info@libtanginbms.gov.ph"
                            />
                        </div>
                    </div>
                </section>
            </main>
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
