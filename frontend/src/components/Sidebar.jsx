import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ConfirmationDialog from './custom/ConfirmDialog';

const sidebarLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    // Add more links as needed
];

const Sidebar = ({ onLogout }) => {
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const handleLogoutClick = () => setShowLogoutDialog(true);
    const handleConfirmLogout = async () => {
        setLogoutLoading(true);
        try {
            if (onLogout) await onLogout();
        } finally {
            setLogoutLoading(false);
            setShowLogoutDialog(false);
        }
    };
    const handleCancelLogout = () => {
        setShowLogoutDialog(false);
        setLogoutLoading(false);
    };

    return (
        <div className="flex flex-col h-full bg-white shadow-lg border-r border-slate-200 w-68">
            <div className="flex items-center gap-2 px-6 py-6 border-b border-slate-100">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Libtangin BMS</span>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
                {sidebarLinks.map(link => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium text-base ${location.pathname === link.to
                            ? 'bg-blue-600 text-white shadow'
                            : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                            }`}
                    >
                        <link.icon className="w-5 h-5" />
                        {link.label}
                    </Link>
                ))}
            </nav>
            {isAuthenticated && user && (
                <div className="px-6 pb-4 mt-auto">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-900 font-medium mb-2">
                        <UserIcon className="w-5 h-5" />
                        <span>{user.firstName || user.email}</span>
                    </div>
                </div>
            )}
            {onLogout && (
                <>
                    <button
                        onClick={handleLogoutClick}
                        className="flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 border-t border-slate-100 w-full font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                    <ConfirmationDialog
                        open={showLogoutDialog}
                        onConfirm={handleConfirmLogout}
                        onCancel={handleCancelLogout}
                        confirmColor='destructive'
                        title='Are you sure you want to logout?'
                        loading={logoutLoading}
                    />
                </>
            )}
        </div>
    );
};

export default Sidebar;
