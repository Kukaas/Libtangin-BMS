import React from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * actions: Array of { label, icon, onClick, variant, show (optional) }
 * Example:
 * [
 *   { label: 'Edit', icon: Pencil, onClick: () => {}, variant: '' },
 *   { label: 'Delete', icon: Trash2, onClick: () => {}, variant: 'destructive' },
 * ]
 */
const CustomDropdown = ({ actions = [], className, triggerClassName, ...props }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn('h-8 w-8 p-0', triggerClassName)}>
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={cn('w-40', className)}>
                {actions.filter(a => a.show === undefined || a.show).map((action, idx) => (
                    <React.Fragment key={action.label}>
                        {idx > 0 && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                            onClick={action.onClick}
                            className={cn(
                                'flex items-center gap-2 cursor-pointer',
                                action.variant === 'destructive' && 'text-destructive',
                                action.className
                            )}
                        >
                            {action.icon && React.createElement(action.icon, { className: 'h-4 w-4' })}
                            <span>{action.label}</span>
                        </DropdownMenuItem>
                    </React.Fragment>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default CustomDropdown;
