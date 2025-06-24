import React, { forwardRef } from 'react';

const Section = forwardRef(function Section({ title, children, action }, ref) {
    return (
        <section ref={ref} className="flex flex-col gap-4 pl-2 sm:pl-4 border-l-4 border-primary bg-white/80 rounded-xl py-4">
            <div className="flex items-center gap-2 mb-2 justify-between">
                <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <h2 className="text-base font-semibold text-foreground/90 tracking-wide uppercase">{title}</h2>
                </div>
                {action}
            </div>
            {children}
        </section>
    );
});

export default Section;
