import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Separator } from './ui/separator';

const Footer = () => (
    <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Brand Section */}
                <div className="sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">Libtangin BMS</span>
                    </div>
                    <p className="text-slate-400 text-sm">
                        Modern barangay management system for efficient service delivery.
                    </p>
                </div>

                {/* Services */}
                <div>
                    <h3 className="font-semibold mb-4 text-white">Services</h3>
                    <ul className="space-y-2 text-slate-400 text-sm">
                        <li>Barangay Indigency</li>
                        <li>Barangay Clearance</li>
                        <li>Business Permit</li>
                        <li>Certificate of Residency</li>
                    </ul>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
                    <ul className="space-y-2 text-slate-400 text-sm">
                        <li>
                            <Link to="/services" className="hover:text-white transition-colors">
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-white transition-colors">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-white transition-colors">
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Office Hours */}
                <div>
                    <h3 className="font-semibold mb-4 text-white">Office Hours</h3>
                    <ul className="space-y-2 text-slate-400 text-sm">
                        <li>Monday - Friday: 8:00 AM - 5:00 PM</li>
                        <li>Saturday: 8:00 AM - 12:00 PM</li>
                        <li>Sunday: Closed</li>
                    </ul>
                </div>
            </div>

            <Separator className="my-8 bg-slate-700" />

            <div className="text-center text-slate-400 text-sm">
                <p>&copy; 2024 Libtangin Barangay Management System. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

export default Footer;
