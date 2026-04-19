import React from 'react';

export default function Button({ children, onClick, className = '', variant = 'primary', disabled = false, type = 'button' }) {
    const baseStyles = "px-6 py-3 text-xs font-black rounded-xl uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-white text-black hover:bg-white/90",
        secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
