import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { cn } from '../../lib/utils';

const ResponsiveDialog = React.forwardRef(({
    open,
    onOpenChange,
    trigger,
    title,
    description,
    children,
    footer,
    className,
    contentClassName,
    headerClassName,
    titleClassName,
    descriptionClassName,
    footerClassName,
    showCloseButton = true,
    ...props
}, ref) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} {...props}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent
                ref={ref}
                className={cn(
                    "w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl",
                    "max-h-[90vh] overflow-y-auto",
                    contentClassName
                )}
                showCloseButton={showCloseButton}
            >
                {(title || description) && (
                    <DialogHeader className={cn("text-center", headerClassName)}>
                        {title && (
                            <DialogTitle className={cn(
                                "text-xl font-bold text-slate-900",
                                titleClassName
                            )}>
                                {title}
                            </DialogTitle>
                        )}
                        {description && (
                            <DialogDescription className={cn(
                                "text-slate-600 mt-2",
                                descriptionClassName
                            )}>
                                {description}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                )}
                <div className={cn("py-4", className)}>
                    {children}
                </div>
                {footer && (
                    <DialogFooter className={cn("flex flex-col sm:flex-row gap-2", footerClassName)}>
                        {footer}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
});

ResponsiveDialog.displayName = 'ResponsiveDialog';

export default ResponsiveDialog;
