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
                    "w-[95vw] sm:max-w-[425px]",
                    "max-h-[90vh] overflow-y-auto",
                    contentClassName
                )}
                showCloseButton={showCloseButton}
            >
                {(title || description) && (
                    <DialogHeader className={cn("text-center", headerClassName)}>
                        {title && (
                            <DialogTitle className={cn(
                                titleClassName
                            )}>
                                {title}
                            </DialogTitle>
                        )}
                        {description && (
                            <DialogDescription className={cn(
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
