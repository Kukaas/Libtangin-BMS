import React from 'react';
import { Alert as ShadcnAlert, AlertTitle, AlertDescription } from '../ui/alert';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const Alert = ({
    variant = 'default',
    title,
    children,
    className,
    onClose,
    showCloseButton = false,
    ...props
}) => {
    const getIcon = () => {
        switch (variant) {
            case 'success':
                return <CheckCircle className="h-4 w-4" />;
            case 'destructive':
                return <AlertCircle className="h-4 w-4" />;
            case 'warning':
                return <AlertTriangle className="h-4 w-4" />;
            case 'info':
                return <Info className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const getVariantClass = () => {
        switch (variant) {
            case 'success':
                return 'border-green-200 bg-green-50 text-green-800 [&>svg]:text-green-600';
            case 'destructive':
                return 'border-red-200 bg-red-50 text-red-800 [&>svg]:text-red-600';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50 text-yellow-800 [&>svg]:text-yellow-600';
            case 'info':
                return 'border-blue-200 bg-blue-50 text-blue-800 [&>svg]:text-blue-600';
            default:
                return '';
        }
    };

    return (
        <ShadcnAlert
            className={cn(getVariantClass(), className)}
            {...props}
        >
            {getIcon()}
            <div className="flex-1">
                {title && (
                    <AlertTitle className="font-medium flex">
                        {title}
                        {showCloseButton && onClose && (
                            <button
                                onClick={onClose}
                                className="ml-auto -mr-1 h-4 w-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </button>
                        )}
                    </AlertTitle>

                )}
                <AlertDescription className="text-sm">
                    {children}
                </AlertDescription>
            </div>
        </ShadcnAlert>
    );
};

export default Alert;
