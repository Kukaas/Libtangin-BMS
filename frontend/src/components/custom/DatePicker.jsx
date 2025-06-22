import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

const DatePicker = ({
    value,
    onChange,
    label,
    required = false,
    placeholder = 'Select date',
    className = '',
    minYear,
    maxYear,
    ...props
}) => {
    const dateValue = value ? (typeof value === 'string' ? new Date(value) : value) : null;
    // Calculate fromYear and toYear for the calendar
    const currentYear = new Date().getFullYear();
    const fromYear = minYear || 1900;
    const toYear = maxYear || currentYear;
    return (
        <div className={`flex flex-col gap-1 ${className}`} {...props}>
            {label && (
                <label className="text-sm font-medium mb-1 block text-left">
                    {label}
                </label>
            )}
            <Popover>
                <PopoverTrigger asChild>
                    <Input
                        readOnly
                        value={dateValue ? format(dateValue, 'PPP') : ''}
                        placeholder={placeholder}
                        className="cursor-pointer dark:bg-input/30"
                    />
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0 w-auto">
                    <Calendar
                        mode="single"
                        selected={dateValue}
                        onSelect={onChange}
                        initialFocus
                        captionLayout="dropdown"
                        fromYear={fromYear}
                        toYear={toYear}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default DatePicker;
