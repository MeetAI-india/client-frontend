import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

// Inject modal keyframe once at module level so it's always available before first render
if (typeof document !== 'undefined' && !document.getElementById('modal-keyframes')) {
    const style = document.createElement('style');
    style.id = 'modal-keyframes';
    style.textContent = `
        @keyframes modalIn {
            from { opacity: 0; transform: scale(0.96) translateY(10px); }
            to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes backdropIn {
            from { opacity: 0; }
            to   { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Modal — a reusable overlay dialog matching the app's dark glassmorphism design system.
 *
 * Usage:
 *   <Modal isOpen={open} onClose={() => setOpen(false)} title="New Project">
 *     <p>Any content here</p>
 *   </Modal>
 *
 * Props:
 *   isOpen      boolean          Controls visibility
 *   onClose     () => void       Called on backdrop click, Escape key, or X button
 *   title       string           Header title text
 *   description string           Optional subtitle below the title
 *   size        'sm'|'md'|'lg'   Modal width (default 'md')
 *   hideClose   boolean          Hide the X button (default false)
 *   children    ReactNode        Modal body content
 *   footer      ReactNode        Optional footer — rendered below a divider
 */
export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    size = 'md',
    hideClose = false,
    children,
    footer,
}) {
    const overlayRef = useRef(null);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    // Lock body scroll while open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-xl',
        md: 'max-w-3xl',
        lg: 'max-w-5xl',
        xl: 'max-w-7xl',
    };

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose?.();
    };

    return ReactDOM.createPortal(
        /* Backdrop */
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', animation: 'backdropIn 0.2s ease both' }}
        >
            {/* Panel */}
            <div
                className={`relative w-full ${sizes[size]} bg-[#111111] border border-white/[0.12] rounded-2xl shadow-2xl flex flex-col`}
                style={{
                    animation: 'modalIn 0.25s cubic-bezier(0.16,1,0.3,1) both',
                    minHeight: '60vh',
                    maxHeight: '90vh',
                    height: 'auto',
                }}
            >
                {/* Inner top glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent_60%)] pointer-events-none rounded-2xl" />

                {/* Header */}
                <div className="relative z-10 flex items-start justify-between p-6 pb-4">
                    <div>
                        {title && (
                            <h2 className="text-base font-black text-white uppercase tracking-widest leading-tight">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="text-xs text-white/40 font-medium mt-1 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>
                    {!hideClose && (
                        <button
                            onClick={onClose}
                            className="ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 text-white/40 hover:text-white hover:bg-white/[0.12] transition-all"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Divider */}
                <div className="h-px bg-white/[0.07] mx-6" />

                {/* Body — fills remaining height, no scroll on the body itself */}
                <div className="relative z-10 flex-1 overflow-y-auto p-6 flex flex-col min-h-0">
                    {children}
                </div>

                {/* Optional Footer */}
                {footer && (
                    <>
                        <div className="h-px bg-white/[0.07] mx-6" />
                        <div className="relative z-10 p-6 pt-4">
                            {footer}
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
}
