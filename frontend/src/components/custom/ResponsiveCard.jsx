import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

const ResponsiveCard = React.forwardRef(({
    title,
    description,
    children,
    className,
    headerClassName,
    contentClassName,
    titleClassName,
    descriptionClassName,
    ...props
}, ref) => {
    return (
        <Card
            ref={ref}
            className={cn(
                "w-full max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl",
                "border-0 shadow-lg hover:shadow-xl transition-shadow duration-300",
                className
            )}
            {...props}
        >
            {(title || description) && (
                <CardHeader className={cn("text-center pb-4", headerClassName)}>
                    {title && (
                        <CardTitle className={cn(
                            "text-2xl font-bold text-slate-900 mb-2",
                            titleClassName
                        )}>
                            {title}
                        </CardTitle>
                    )}
                    {description && (
                        <CardDescription className={cn(
                            "text-slate-600 text-base",
                            descriptionClassName
                        )}>
                            {description}
                        </CardDescription>
                    )}
                </CardHeader>
            )}
            <CardContent className={cn("px-6 pb-6", contentClassName)}>
                {children}
            </CardContent>
        </Card>
    );
});

ResponsiveCard.displayName = 'ResponsiveCard';

export default ResponsiveCard;
