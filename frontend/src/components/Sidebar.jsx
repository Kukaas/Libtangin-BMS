import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Shield,
    Home,
    User as UserIcon,
    LogOut,
    Users,
    Activity,
    Heart,
    Calendar,
    Settings,
    FileText,
    Building,
    MapPin,
    CreditCard,
    History,
    Award,
    ClipboardList,
    BarChart3,
    AlertTriangle,
    MessageSquare,
    FileCheck,
    Receipt,
    UserCheck,
    UserPlus,
    Database,
    Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ConfirmationDialog from './custom/ConfirmDialog';

const getSidebarLinks = (userRole) => {
    const baseLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: Home }
    ];

    switch (userRole) {
        case 'admin':
            return [
                ...baseLinks,
                { to: '/admin/users', label: 'Users Management', icon: Users },
                { to: '/admin/officials-accounts', label: 'Officials Accounts', icon: Users },
                { to: '/admin/transactions', label: 'Recent Transactions', icon: History },
                { to: '/admin/system-health', label: 'System Health', icon: Heart },
                { to: '/admin/events', label: 'Events', icon: Calendar },
                { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
                { to: '/admin/notifications', label: 'Notifications', icon: Bell },
                { to: '/admin/backup', label: 'Backup & Restore', icon: Database },
                { to: '/admin/settings', label: 'System Settings', icon: Settings },
                { to: '/admin/profile', label: 'My Profile', icon: UserIcon }
            ];

        case 'secretary':
            return [
                ...baseLinks,
                { to: '/secretary/indigency', label: 'Indigency', icon: FileText },
                { to: '/secretary/clearance', label: 'Clearance', icon: FileCheck },
                { to: '/secretary/business-permit', label: 'Business Permit', icon: Building },
                { to: '/secretary/residency', label: 'Residency', icon: MapPin },
                { to: '/secretary/residents', label: 'Residents', icon: UserCheck },
                { to: '/secretary/users', label: 'Users', icon: UserPlus },
                { to: '/secretary/documents', label: 'Document Requests', icon: ClipboardList },
                { to: '/secretary/calendar', label: 'Calendar', icon: Calendar },
                { to: '/secretary/profile', label: 'My Profile', icon: UserIcon }
            ];

        case 'treasurer':
            return [
                ...baseLinks,
                { to: '/treasurer/clearance', label: 'Clearance Payments', icon: FileCheck },
                { to: '/treasurer/transactions', label: 'Transaction History', icon: History },
                { to: '/treasurer/receipts', label: 'Receipts', icon: Receipt },
                { to: '/treasurer/payments', label: 'Payment Processing', icon: CreditCard },
                { to: '/treasurer/financial-reports', label: 'Financial Reports', icon: BarChart3 },
                { to: '/treasurer/collections', label: 'Collections', icon: Activity },
                { to: '/treasurer/refunds', label: 'Refunds', icon: CreditCard },
                { to: '/treasurer/profile', label: 'My Profile', icon: UserIcon }
            ];

        case 'barangay_captain':
            return [
                { to: '/captain/overview', label: 'Barangay Overview', icon: BarChart3 },
                { to: '/captain/residents', label: 'Residents', icon: Users },
                { to: '/captain/events', label: 'Events', icon: Calendar },
                { to: '/captain/announcements', label: 'Announcements', icon: Bell },
                { to: '/captain/complaints', label: 'Complaints', icon: AlertTriangle },
                { to: '/captain/projects', label: 'Projects', icon: Building },
                { to: '/captain/reports', label: 'Reports', icon: FileText },
                { to: '/captain/messages', label: 'Messages', icon: MessageSquare },
                { to: '/captain/profile', label: 'My Profile', icon: UserIcon }
            ];

        case 'resident':
            return [
                ...baseLinks,
                { to: '/resident/documents', label: 'My Documents', icon: FileText },
                { to: '/resident/payments', label: 'My Payments', icon: CreditCard },
                { to: '/resident/requests', label: 'My Requests', icon: ClipboardList },
                { to: '/resident/notifications', label: 'Notifications', icon: Bell },
                { to: '/resident/profile', label: 'My Profile', icon: UserIcon }
            ];

        default:
            return baseLinks;
    }
};

const Sidebar = ({ onLogout }) => {
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const sidebarLinks = getSidebarLinks(user?.role);

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
        <div className="sticky top-0 h-screen flex flex-col bg-white shadow-lg border-r border-slate-200 w-68">
            {/* Header - Fixed at top */}
            <div className="flex-shrink-0 flex items-center gap-2 px-6 py-6 border-b border-slate-100">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Libtangin BMS</span>
            </div>

            {/* Navigation - Scrollable */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                {sidebarLinks.map(link => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium text-sm group ${location.pathname === link.to
                            ? 'bg-blue-600 text-white shadow'
                            : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                            }`}
                    >
                        <link.icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <div className="truncate">{link.label}</div>
                        </div>
                    </Link>
                ))}
            </nav>

            {/* User Info and Logout - Fixed at bottom */}
            <div className="flex-shrink-0">
                {onLogout && (
                    <>
                        <button
                            onClick={handleLogoutClick}
                            className="flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 border-t border-slate-100 w-full font-medium transition"
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
        </div>
    );
};

export default Sidebar;
