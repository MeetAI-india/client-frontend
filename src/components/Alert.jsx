import React, { useState } from 'react';
import {
    CheckCircle,
    AlertCircle,
    TriangleAlert,
    Info,
    X
} from 'lucide-react';

const Alert = ({
    children,
    variant = 'info',
    dismissible = false,
    className = '',
    ...props
}) => {
    const [visible, setVisible] = useState(true);

    const baseStyles =
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-all";

    const variants = {
        success: "bg-green-500/10 border-green-500/20 text-green-200",
        error: "bg-red-500/10 border-red-500/20 text-red-200",
        warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-200",
        info: "bg-blue-500/10 border-blue-500/20 text-blue-200",
    };

    const icons = {
        success: <CheckCircle size={18} />,
        error: <AlertCircle size={18} />,
        warning: <TriangleAlert size={18} />,
        info: <Info size={18} />,
    };

    if (!visible) {
        return null;
    }

    return (
        <div
            role="alert"
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            <div className="mt-0.5 flex-shrink-0">
                {icons[variant]}
            </div>

            <div className="flex-1">
                {children}
            </div>

            {dismissible && (
                <button
                    type="button"
                    onClick={() => setVisible(false)}
                    className="text-current opacity-60 hover:opacity-100 transition-opacity"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export default Alert;