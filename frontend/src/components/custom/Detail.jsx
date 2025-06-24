import React from 'react';

const Detail = ({ label, value, deceased }) => (
    <div className="flex flex-col gap-1 py-1 w-full">
        <span className="text-xs text-muted-foreground font-medium mb-0.5 tracking-wide">{label}</span>
        <span className="text-base font-normal text-foreground/90 break-all flex items-center gap-2">
            {value ? value : <span className="text-muted-foreground">—</span>}
            {deceased && (
                <span className="inline-block px-2 py-0.5 text-xs rounded bg-destructive/10 text-destructive border border-destructive/30 ml-2">Deceased</span>
            )}
        </span>
    </div>
);

export default Detail;
