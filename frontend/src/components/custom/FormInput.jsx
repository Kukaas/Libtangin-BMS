import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

const FormInput = React.forwardRef(({
    label,
    error,
    className,
    labelClassName,
    inputClassName,
    errorClassName,
    icon: Icon,
    endIcon,
    ...props
}, ref) => {
    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <Label
                    htmlFor={props.id || props.name}
                    className={cn("text-sm font-medium text-slate-700", labelClassName)}
                >
                    {label}
                </Label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                        <Icon size={16} />
                    </div>
                )}
                <Input
                    ref={ref}
                    className={cn(
                        "w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500",
                        Icon && "pl-10",
                        endIcon && "pr-10",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                        inputClassName
                    )}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${props.id || props.name}-error` : undefined}
                    {...props}
                />
                {endIcon && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {endIcon}
                    </div>
                )}
            </div>
            {error && (
                <p
                    id={`${props.id || props.name}-error`}
                    className={cn(
                        "text-sm text-red-600 flex items-center gap-1",
                        errorClassName
                    )}
                >
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {error}
                </p>
            )}
        </div>
    );
});

FormInput.displayName = 'FormInput';

export default FormInput;
