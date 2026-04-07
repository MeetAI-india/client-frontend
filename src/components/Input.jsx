import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = ({ className = '', ...props }) => {
    return (
        <input
            className={`w-full bg-white/[0.05] border border-white/[0.1] rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/[0.25] focus:bg-white/[0.08] transition-all ${className}`}
            {...props}
        />
    );
};

export const PasswordInput = ({ className = '', ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative group">
            <input
                type={showPassword ? 'text' : 'password'}
                className={`w-full bg-white/[0.05] border border-white/[0.1] rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/[0.25] focus:bg-white/[0.08] transition-all ${className}`}
                {...props}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
};
