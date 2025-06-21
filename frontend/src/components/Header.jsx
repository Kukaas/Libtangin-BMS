import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
];

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">Libtangin BMS</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-slate-600 hover:text-blue-600 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Button variant="outline" className="ml-4">Login</Button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden">
                        <div className="pt-4 pb-3 border-t border-slate-200">
                            <nav className="flex flex-col space-y-3">
                                {navLinks.map(link => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="text-slate-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-slate-50"
                                        onClick={closeMenu}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="pt-2">
                                    <Button variant="outline" className="w-full">Login</Button>
                                </div>
                            </nav>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
