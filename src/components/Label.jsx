import React from 'react';

const Label = ({ children, className = '', ...props }) => {
    return (
        <label
            className={`text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block ${className}`}
            {...props}
        >
            {children}
        </label>
    );
};

export default Label;
