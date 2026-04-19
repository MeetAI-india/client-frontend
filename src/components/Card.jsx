import React from 'react';

export default function Card({ children, className = '', onClick, ...props }) {
    return (
        <div
            onClick={onClick}
            {...props}
            className={`group relative bg-white/[0.08] border border-white/[0.15] rounded-2xl transition-all shadow-lg overflow-hidden ${className} ${onClick ? 'cursor-pointer hover:bg-white/[0.12]' : ''}`}
        >
            {/* Inner Glow Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_70%)] pointer-events-none rounded-2xl" />

            {/* Content Wrapper */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
}
