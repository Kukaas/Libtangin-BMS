import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactCard from '../components/landing/ContactCard';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
        <Header />
        <main className="flex-1 py-16 px-4">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">Contact Us</h1>
                <div className="grid md:grid-cols-3 gap-8 mb-12">
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
                <form className="bg-white rounded-xl shadow p-8 max-w-2xl mx-auto space-y-6">
                    <div>
                        <label className="block text-slate-700 font-medium mb-2">Name</label>
                        <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Your Name" />
                    </div>
                    <div>
                        <label className="block text-slate-700 font-medium mb-2">Email</label>
                        <input type="email" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="you@email.com" />
                    </div>
                    <div>
                        <label className="block text-slate-700 font-medium mb-2">Message</label>
                        <textarea className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" rows="4" placeholder="Your message..."></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">Send Message</button>
                </form>
            </div>
        </main>
        <Footer />
    </div>
);

export default Contact;
