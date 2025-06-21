import React from 'react';
import ResponsiveDialog from './ResponsiveDialog';
import { Button } from '../ui/button';

const ConfirmationDialog = ({
    open,
    onConfirm,
    onCancel,
    title = 'Are you sure?',
    description = '',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    confirmColor = 'default',
    loading = false,
}) => (
    <ResponsiveDialog
        open={open}
        onClose={onCancel}
        title={title}
        description={description}
        contentClassName="max-w-sm"
    >
        <div className="flex justify-end gap-3">
            <Button
                variant="outline"
                onClick={onCancel}
                disabled={loading}
            >
                {cancelLabel}
            </Button>
            <Button
                variant={confirmColor}
                onClick={onConfirm}
                disabled={loading}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Please wait...
                    </span>
                ) : confirmLabel}
            </Button>
        </div>
    </ResponsiveDialog>
);

export default ConfirmationDialog;
