import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Filter } from 'lucide-react';

/**
 * Premium Dropdown Component
 * 
 * @param {string} label - Placeholder label when no value is selected
 * @param {Array} options - Array of { label, value } objects
 * @param {any} value - Current selected value
 * @param {Function} onChange - Callback when an option is selected
 * @param {string} className - Additional classes for the container
 * @param {string} variant - 'primary' (glass/dark) or 'secondary' (white)
 * @param {React.ReactNode} trigger - Optional custom trigger element
 */
export default function Dropdown({ 
    label, 
    options = [], 
    value, 
    onChange, 
    className = '', 
    variant = 'primary',
    trigger
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    const variants = {
        primary: "bg-white/[0.03] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06] hover:border-white/20",
        secondary: "bg-white text-black hover:bg-white/90 shadow-xl"
    };

    return (
        <div className={`relative inline-block ${className}`} ref={dropdownRef}>
            <style>{`
                @keyframes dropdownEntry {
                    from { opacity: 0; transform: translateY(-8px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .dropdown-animate {
                    animation: dropdownEntry 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
            `}</style>

            {trigger ? (
                <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                    {trigger}
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all 
                        flex items-center gap-3 min-w-[140px] justify-between
                        ${variants[variant]}
                        ${isOpen ? 'border-white/30 ring-4 ring-white/5' : ''}
                    `}
                >
                    <div className="flex items-center gap-2.5 truncate">
                        <Filter size={14} className="text-white/30" />
                        <span className="truncate">{selectedOption?.label || label || "Select..."}</span>
                    </div>
                    <ChevronDown 
                        size={14} 
                        className={`transition-transform duration-300 opacity-40 ${isOpen ? 'rotate-180 opacity-100' : ''}`} 
                    />
                </button>
            )}

            {isOpen && (
                <div className="absolute z-[100] mt-2 w-full min-w-[180px] bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden dropdown-animate origin-top-left">
                    <div className="p-1.5 capitalize">
                        {options.length > 0 ? options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`
                                    w-full px-4 py-3 text-left text-[11px] font-bold tracking-wider transition-all rounded-xl mb-0.5 last:mb-0
                                    flex items-center justify-between group
                                    ${option.value === value 
                                        ? 'bg-white/10 text-white' 
                                        : 'text-white/40 hover:bg-white/5 hover:text-white'
                                    }
                                `}
                            >
                                <span>{option.label}</span>
                                {option.value === value && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                )}
                            </button>
                        )) : (
                            <div className="px-4 py-3 text-[10px] text-white/20 font-bold uppercase tracking-widest text-center">
                                No options
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
