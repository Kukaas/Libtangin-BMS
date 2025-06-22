import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import MainLayout from './MainLayout';
import { useIsMobile } from '@/hooks/use-mobile';


const PageLayout = ({
    title,
    subtitle,
    breadcrumbs = [],
    children,
    actions,
    className = ""
}) => {
    const isMobile = useIsMobile();

    const renderBreadcrumbs = () => {
        if (breadcrumbs.length === 0) return null;

        const allCrumbs = [
            { label: 'Dashboard', to: '/dashboard', icon: Home },
            ...breadcrumbs.map(c => ({ ...c, icon: null }))
        ];

        let visibleCrumbs = allCrumbs;

        if (isMobile && allCrumbs.length > 2) {
            visibleCrumbs = [
                allCrumbs[0],
                { label: '...', isEllipsis: true },
                allCrumbs[allCrumbs.length - 1],
            ];
        }

        return (
            <nav className="mb-2">
                <ol className="flex items-center space-x-1 text-sm text-gray-500">
                    {visibleCrumbs.map((crumb, index) => (
                        <li key={index} className="flex items-center">
                            {index > 0 && !crumb.isEllipsis && <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />}

                            {crumb.isEllipsis ? (
                                <span className="px-1">...</span>
                            ) : crumb.to ? (
                                <Link to={crumb.to} className="flex items-center hover:text-blue-600 transition-colors">
                                    {crumb.icon && <crumb.icon className="w-4 h-4 mr-1.5" />}
                                    <span className="truncate">{crumb.label}</span>
                                </Link>
                            ) : (
                                <span className="font-medium text-gray-700 truncate">{crumb.label}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        );
    };

    return (
        <MainLayout>
            <div className={`p-6 ${className}`}>
                {/* Breadcrumbs & Header Container */}
                <div className="mb-6">
                    {renderBreadcrumbs()}

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                            {subtitle && (
                                <p className="mt-1 text-gray-600">{subtitle}</p>
                            )}
                        </div>
                        {actions && (
                            <div className="flex items-center gap-2">
                                {actions}
                            </div>
                        )}
                    </div>
                </div>

                {/* Page Content */}
                <div>
                    {children}
                </div>
            </div>
        </MainLayout>
    );
};

export default PageLayout;
