import React from 'react';

export default function Badge({ children, className = '', variant = 'default' }) {
    const variants = {
        default: 'bg-white/10 text-white/60',
        critical: 'bg-red-500/20 text-red-400',
        high: 'bg-yellow-500/20 text-yellow-400',
        medium: 'bg-blue-500/20 text-blue-400',
        low: 'bg-white/10 text-white/60',
        success: 'bg-green-500/20 text-green-400',
    };

    return (
        <span className={`text-[9px] uppercase font-black px-2 py-1 rounded tracking-widest ${variants[variant] || variants.default} ${className}`}>
            {children}
        </span>
    );
}
