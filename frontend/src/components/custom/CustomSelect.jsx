import React from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const CustomSelect = ({
    label,
    value,
    onChange,
    required = false,
    placeholder = '',
    options = [],
    className = '',
    ...props
}) => (
    <div className={`flex flex-col gap-1 ${className}`} {...props}>
        {label && (
            <label className="text-sm font-medium mb-1 block text-left">
                {label}
            </label>
        )}
        <Select value={value} onValueChange={onChange} required={required}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.length > 6 ? (
                    <ScrollArea className="max-h-48 w-full">
                        {options.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </ScrollArea>
                ) : (
                    options.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))
                )}
            </SelectContent>
        </Select>
    </div>
);

export default CustomSelect;
