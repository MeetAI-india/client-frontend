import React, { useState } from 'react';
import {
    CircleCheckBig,
    TriangleAlert,
    OctagonAlert,
    Info,
    X
} from 'lucide-react';

const Alert = ({
    children,
    variant = 'info',
    dismissible = false,
    onClose,
    className = '',
}) => {

    const [visible, setVisible] = useState(true);

    const baseStyles = "flex items-start gap-3 border px-4 py-3 rounded-xl text-sm transition-all";
    const variants = {
        success: "bg-green-500/10 border-green-500/20 text-green-200",
        error: "bg-red-500/10 border-red-500/20 text-red-200",
        warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-200",
        info: "bg-blue-500/10 border-blue-500/20 text-blue-200",
    };
    const icons = {
        success: <CircleCheckBig size={18} />,
        error: <TriangleAlert size={18} />,
        warning: <OctagonAlert size={18} />,
        info: <Info size={18} />
    };
    const safeVariant = variants[variant] ? variant : 'info';

    if (!visible) {
        return null;
    }

    const handleDismiss = () => {
        setVisible(false);
        if (onClose) {
            onClose();
        }
    };

    return (
        <div role="alert"
             className={`${baseStyles} ${variants[safeVariant]} ${className}`}
        >
            <div className="mt-0.5 flex-shrink-0">
                {icons[safeVariant]}
            </div>

            <div className="flex-1">
                {children}
            </div>

            {dismissible && (   
                <button
                    type="button"
                    onClick={handleDismiss}
                    className="text-current transition-opacity opacity-50 hover:opacity-100"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
};

export default Alert;