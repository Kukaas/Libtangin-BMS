import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
];

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
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
                        <div className="flex items-center space-x-3 ml-4">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-900 font-medium">
                                        <UserIcon className="w-5 h-5" />
                                        <span>{user?.firstName || user?.email}</span>
                                    </div>
                                    <Button variant="outline" onClick={handleLogout}>
                                        <LogOut className="w-4 h-4 mr-1" /> Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <Button variant="outline">Login</Button>
                                    </Link>
                                    <Link to="/signup">
                                        <Button>Sign Up</Button>
                                    </Link>
                                </>
                            )}
                        </div>
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
                                <div className="pt-2 space-y-2">
                                    {isAuthenticated ? (
                                        <>
                                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-900 font-medium">
                                                <UserIcon className="w-5 h-5" />
                                                <span>{user?.firstName || user?.email}</span>
                                            </div>
                                            <Button variant="outline" className="w-full" onClick={() => { handleLogout(); closeMenu(); }}>
                                                <LogOut className="w-4 h-4 mr-1" /> Logout
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" onClick={closeMenu}>
                                                <Button variant="outline" className="w-full">Login</Button>
                                            </Link>
                                            <Link to="/signup" onClick={closeMenu}>
                                                <Button className="w-full">Sign Up</Button>
                                            </Link>
                                        </>
                                    )}
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
