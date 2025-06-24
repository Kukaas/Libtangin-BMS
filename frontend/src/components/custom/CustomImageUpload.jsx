import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

const CustomImageUpload = ({
    label,
    value,
    onChange,
    error,
    accept = 'image/*',
    className,
    labelClassName,
    cardClassName,
    ...props
}) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            onChange(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={cn('space-y-2 w-full', className)}>
            {label && (
                <Label className={cn('text-sm font-medium text-slate-700', labelClassName)}>
                    {label}
                </Label>
            )}
            <Card className={cn('flex flex-col items-center justify-center gap-3 p-4 border-dashed border-2 border-slate-200 bg-slate-50 w-full min-h-[180px] transition-all', cardClassName)}>
                {value ? (
                    <>
                        <div className="w-full flex justify-center">
                            <img
                                src={value}
                                alt="Preview"
                                className="max-w-full max-h-48 object-contain rounded shadow border bg-white"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onChange('')}
                            className="mt-2"
                        >
                            Remove
                        </Button>
                    </>
                ) : (
                    <div className="w-full flex flex-col items-center">
                        <Input
                            type="file"
                            accept={accept}
                            onChange={handleFileChange}
                            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                            {...props}
                        />
                        <span className="text-xs text-slate-500 mt-2">Accepted: {accept}</span>
                    </div>
                )}
            </Card>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
};

export default CustomImageUpload;
