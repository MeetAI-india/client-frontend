import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
    ChevronDown, X, Upload, FileText, Link, Image, CheckSquare,
    Circle, AlignLeft, Type, Plus, AlertCircle, Check, Eye, EyeOff
} from 'lucide-react';

// ─────────────────────────────────────────────
//  Internal helpers
// ─────────────────────────────────────────────

const FieldWrapper = ({ label, required, error, hint, children, className = '' }) => (
    <div className={`space-y-1.5 ${className}`} style={className.includes('flex-1') ? { display: 'flex', flexDirection: 'column', minHeight: 0 } : {}}>
        {label && (
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                    {label}
                    {required && <span className="text-red-400 text-[8px]">●</span>}
                </label>
                {hint && <span className="text-[9px] text-white/25 font-medium">{hint}</span>}
            </div>
        )}
        {children}
        {error && (
            <div className="flex items-center gap-1.5 text-red-400">
                <AlertCircle size={10} />
                <span className="text-[10px] font-bold">{error}</span>
            </div>
        )}
    </div>
);

const baseInput =
    'w-full bg-white/[0.05] border border-white/[0.1] rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/[0.3] focus:bg-white/[0.08] transition-all';

const errorBorder = 'border-red-500/50 focus:border-red-400/60';

// ─────────────────────────────────────────────
//  Individual Field Components
// ─────────────────────────────────────────────

/* TEXT INPUT */
export const TextField = ({ label, placeholder, required, value, onChange, error, hint, type = 'text', className = '' }) => {
    const [showPwd, setShowPwd] = useState(false);
    const isPassword = type === 'password';

    return (
        <FieldWrapper label={label} required={required} error={error} hint={hint} className={className}>
            <div className="relative">
                <input
                    type={isPassword ? (showPwd ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => onChange?.(e.target.value)}
                    className={`${baseInput} ${error ? errorBorder : ''} ${isPassword ? 'pr-12' : ''}`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPwd(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                    >
                        {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                )}
            </div>
        </FieldWrapper>
    );
};

/* TEXTAREA */
export const TextareaField = ({ label, placeholder, required, value, onChange, error, hint, rows = 4, className = '' }) => (
    <FieldWrapper label={label} required={required} error={error} hint={hint} className={className}>
        <textarea
            placeholder={placeholder}
            value={value}
            onChange={e => onChange?.(e.target.value)}
            rows={rows}
            className={`${baseInput} resize-none leading-relaxed ${error ? errorBorder : ''}`}
        />
    </FieldWrapper>
);

/* MARKDOWN EDITOR — edit / preview toggle */
export const MarkdownField = ({ label, placeholder, required, value, onChange, error, hint, className = '' }) => {
    const [preview, setPreview] = useState(false);

    // Minimal MD → HTML (bold, italic, headings, code, lists, links, line breaks)
    const renderMarkdown = (md = '') => {
        const escaped = md
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        const html = escaped
            .replace(/^#{3}\s(.+)$/gm, '<h3 class="text-sm font-black text-white mt-3 mb-1">$1</h3>')
            .replace(/^#{2}\s(.+)$/gm, '<h2 class="text-base font-black text-white mt-4 mb-1">$1</h2>')
            .replace(/^#{1}\s(.+)$/gm, '<h1 class="text-lg font-black text-white mt-4 mb-2">$1</h1>')
            .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
            .replace(/\*(.+?)\*/g, '<em class="text-white/80 italic">$1</em>')
            .replace(/`(.+?)`/g, '<code class="bg-white/10 text-white/90 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
            .replace(/^\s*[-*]\s(.+)$/gm, '<li class="text-white/60 text-sm ml-3 list-disc">$1</li>')
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-white underline underline-offset-2 hover:text-white/70" target="_blank">$1</a>')
            .replace(/\n/g, '<br/>');

        return html;
    };

    return (
        <FieldWrapper label={label} required={required} error={error} hint={hint} className={`flex flex-col flex-1 min-h-0 ${className}`}>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-1.5 flex-shrink-0">
                <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-lg p-0.5">
                    <button
                        type="button"
                        onClick={() => setPreview(false)}
                        className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${!preview ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => setPreview(true)}
                        className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${preview ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
                    >
                        Preview
                    </button>
                </div>
                <span className="text-[9px] text-white/20 font-mono">Markdown supported</span>
            </div>

            {preview ? (
                <div
                    className={`flex-1 min-h-0 w-full bg-white/[0.03] border ${error ? 'border-red-500/50' : 'border-white/[0.1]'} rounded-xl py-3 px-4 text-sm text-white/60 leading-relaxed overflow-y-auto`}
                    dangerouslySetInnerHTML={{ __html: value ? renderMarkdown(value) : `<span class="text-white/20">${placeholder || 'Nothing to preview yet…'}</span>` }}
                />
            ) : (
                <textarea
                    placeholder={placeholder}
                    value={value}
                    onChange={e => onChange?.(e.target.value)}
                    className={`flex-1 min-h-0 w-full bg-white/[0.05] border border-white/[0.1] rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/[0.3] focus:bg-white/[0.08] transition-all resize-none leading-relaxed font-mono text-xs ${error ? errorBorder : ''}`}
                />
            )}
        </FieldWrapper>
    );
};

/* DROPDOWN */
export const DropdownField = ({ label, options = [], required, value, onChange, error, hint, placeholder = 'Select an option', className = '' }) => {
    const [open, setOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState({});
    const triggerRef = useRef(null);
    const dropdownRef = useRef(null);

    const selected = options.find(o => (o.value ?? o) === value);
    const label_ = selected ? (selected.label ?? selected) : null;

    // Position the portal dropdown under the trigger
    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const estimatedHeight = options.length * 40 + 12;
        const openUpward = spaceBelow < estimatedHeight && rect.top > estimatedHeight;

        setDropdownStyle({
            position: 'fixed',
            left: rect.left,
            width: rect.width,
            zIndex: 9999,
            ...(openUpward
                ? { bottom: window.innerHeight - rect.top + 6 }
                : { top: rect.bottom + 6 }),
        });
    }, [options.length]);

    const handleOpen = () => {
        updatePosition();
        setOpen(v => !v);
    };

    // Close on outside click or scroll
    useEffect(() => {
        if (!open) return;
        const close = (e) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                triggerRef.current && !triggerRef.current.contains(e.target)
            ) setOpen(false);
        };
        const onScroll = () => { updatePosition(); };
        document.addEventListener('mousedown', close);
        document.addEventListener('scroll', onScroll, true);
        return () => {
            document.removeEventListener('mousedown', close);
            document.removeEventListener('scroll', onScroll, true);
        };
    }, [open, updatePosition]);

    const dropdownMenu = open && ReactDOM.createPortal(
        <div
            ref={dropdownRef}
            style={dropdownStyle}
            className="bg-zinc-900/95 backdrop-blur border border-white/10 rounded-xl shadow-2xl py-1.5 overflow-hidden"
        >
            {options.map((opt, i) => {
                const val = opt.value ?? opt;
                const lbl = opt.label ?? opt;
                const isActive = val === value;
                return (
                    <button
                        key={i}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                        onClick={() => { onChange?.(val); setOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors ${isActive ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        {lbl}
                        {isActive && <Check size={12} className="text-white/60" />}
                    </button>
                );
            })}
        </div>,
        document.body
    );

    return (
        <FieldWrapper label={label} required={required} error={error} hint={hint} className={className}>
            <div className="relative">
                <button
                    ref={triggerRef}
                    type="button"
                    onClick={handleOpen}
                    className={`${baseInput} flex items-center justify-between text-left ${!label_ ? 'text-white/30' : ''} ${error ? errorBorder : ''}`}
                >
                    <span>{label_ ?? placeholder}</span>
                    <ChevronDown size={14} className={`text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </button>
                {dropdownMenu}
            </div>
        </FieldWrapper>
    );
};

/* RADIO GROUP */
export const RadioField = ({ label, options = [], required, value, onChange, error, hint, className = '' }) => (
    <FieldWrapper label={label} required={required} error={error} hint={hint} className={className}>
        <div className="flex flex-wrap gap-2">
            {options.map((opt, i) => {
                const val = opt.value ?? opt;
                const lbl = opt.label ?? opt;
                const isActive = val === value;
                return (
                    <button
                        key={i}
                        type="button"
                        onClick={() => onChange?.(val)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${isActive ? 'bg-white/15 border-white/30 text-white' : 'bg-white/[0.03] border-white/10 text-white/40 hover:text-white/70 hover:bg-white/[0.07]'}`}
                    >
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${isActive ? 'border-white' : 'border-white/30'}`}>
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        {lbl}
                    </button>
                );
            })}
        </div>
    </FieldWrapper>
);

/* CHECKBOX GROUP */
export const CheckboxField = ({ label, options = [], required, value = [], onChange, error, hint, className = '' }) => {
    const toggle = (val) => {
        const next = value.includes(val) ? value.filter(v => v !== val) : [...value, val];
        onChange?.(next);
    };

    return (
        <FieldWrapper label={label} required={required} error={error} hint={hint} className={className}>
            <div className="space-y-2">
                {options.map((opt, i) => {
                    const val = opt.value ?? opt;
                    const lbl = opt.label ?? opt;
                    const checked = value.includes(val);
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => toggle(val)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-bold text-left transition-all ${checked ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.03] border-white/10 text-white/50 hover:text-white/80 hover:bg-white/[0.06]'}`}
                        >
                            <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked ? 'bg-white border-white' : 'border-white/30'}`}>
                                {checked && <Check size={10} className="text-black" strokeWidth={3} />}
                            </div>
                            {lbl}
                        </button>
                    );
                })}
            </div>
        </FieldWrapper>
    );
};

/* SINGLE CHECKBOX TOGGLE */
export const CheckboxToggle = ({ label, description, required, value, onChange, error, className = '' }) => (
    <FieldWrapper error={error} className={className}>
        <button
            type="button"
            onClick={() => onChange?.(!value)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${value ? 'bg-white/10 border-white/20' : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'}`}
        >
            <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${value ? 'bg-white border-white' : 'border-white/30'}`}>
                {value && <Check size={10} className="text-black" strokeWidth={3} />}
            </div>
            <div className="text-left">
                <p className={`text-xs font-black uppercase tracking-widest ${value ? 'text-white' : 'text-white/50'}`}>
                    {label}
                    {required && <span className="text-red-400 ml-1 text-[8px]">●</span>}
                </p>
                {description && <p className="text-[10px] text-white/30 mt-0.5 font-medium normal-case tracking-normal">{description}</p>}
            </div>
        </button>
    </FieldWrapper>
);

/* URL INPUT */
export const UrlField = ({ label, placeholder = 'https://', required, value, onChange, error, hint, className = '' }) => (
    <FieldWrapper label={label} required={required} error={error} hint={hint} className={className}>
        <div className="relative flex items-center">
            <div className="absolute left-4 text-white/20">
                <Link size={13} />
            </div>
            <input
                type="url"
                placeholder={placeholder}
                value={value}
                onChange={e => onChange?.(e.target.value)}
                className={`${baseInput} pl-9 ${error ? errorBorder : ''}`}
            />
        </div>
    </FieldWrapper>
);

/* FILE / IMAGE / DOCUMENT UPLOAD */
export const FileUploadField = ({
    label, required, value = [], onChange, error, hint, className = '',
    accept = '*/*',
    multiple = false,
    mode = 'file', // 'file' | 'image' | 'document'
    maxFiles = 10,
    maxSizeMB = 10,
}) => {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const modeConfig = {
        image: { icon: Image, hint: 'PNG, JPG, GIF, WEBP', accept: 'image/*', label: 'images' },
        document: { icon: FileText, hint: 'PDF, DOC, DOCX, XLS, XLSX', accept: '.pdf,.doc,.docx,.xls,.xlsx', label: 'documents' },
        file: { icon: Upload, hint: 'Any file type', accept: '*/*', label: 'files' },
    };

    const cfg = modeConfig[mode];
    const finalAccept = accept !== '*/*' ? accept : cfg.accept;
    const Icon = cfg.icon;

    const processFiles = useCallback((fileList) => {
        const files = Array.from(fileList);
        const valid = files.filter(f => {
            if (f.size > maxSizeMB * 1024 * 1024) return false;
            return true;
        });
        const next = multiple ? [...value, ...valid].slice(0, maxFiles) : valid.slice(0, 1);
        onChange?.(next);
    }, [value, multiple, maxFiles, maxSizeMB, onChange]);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        processFiles(e.dataTransfer.files);
    }, [processFiles]);

    const removeFile = (idx) => {
        const next = value.filter((_, i) => i !== idx);
        onChange?.(next);
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return `${bytes}B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    };

    const isImage = (file) => file.type?.startsWith('image/');

    return (
        <FieldWrapper label={label} required={required} error={error} hint={hint} className={className}>
            <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${dragging ? 'border-white/40 bg-white/[0.08]' : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'} ${error ? 'border-red-500/40' : ''}`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple={multiple}
                    accept={finalAccept}
                    onChange={e => processFiles(e.target.files)}
                    className="hidden"
                />
                <Icon size={22} className="mx-auto text-white/20 mb-2" />
                <p className="text-xs font-black text-white/50 uppercase tracking-widest">
                    {dragging ? 'Drop here' : `Upload ${multiple ? cfg.label : cfg.label.replace(/s$/, '')}`}
                </p>
                <p className="text-[10px] text-white/25 mt-1 font-medium">
                    {cfg.hint} · Max {maxSizeMB}MB{multiple ? ` · up to ${maxFiles}` : ''}
                </p>
            </div>

            {value.length > 0 && (
                <div className="space-y-2 mt-2">
                    {value.map((file, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.05] border border-white/10 rounded-xl group">
                            {isImage(file) ? (
                                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText size={16} className="text-white/40" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white truncate">{file.name}</p>
                                <p className="text-[10px] text-white/30 font-medium">{formatSize(file.size)}</p>
                            </div>
                            <button
                                type="button"
                                onClick={e => { e.stopPropagation(); removeFile(i); }}
                                className="text-white/20 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10"
                            >
                                <X size={13} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </FieldWrapper>
    );
};

// ─────────────────────────────────────────────
//  Form Container
// ─────────────────────────────────────────────

/**
 * Form — a flexible form container that matches the app design system.
 *
 * Props:
 *  fields      Array<FieldConfig>  — field definitions
 *  values      object              — controlled form state
 *  onChange    (key, val) => void  — called on every field change
 *  onSubmit    (values) => void    — called after validation passes
 *  errors      object              — external errors (e.g. from server)
 *  submitLabel string              — submit button text (default "Submit")
 *  loading     boolean             — shows loading state on submit
 *
 * FieldConfig:
 *  {
 *    key:          string           (required)
 *    type:         'text'|'email'|'password'|'number'|'textarea'|'dropdown'|'radio'|
 *                  'checkbox'|'checkbox-toggle'|'url'|'image'|'images'|'document'|'documents'|'file'|'files'
 *    label:        string
 *    placeholder:  string
 *    required:     boolean
 *    options:      Array            (for dropdown/radio/checkbox)
 *    hint:         string
 *    description:  string           (for checkbox-toggle)
 *    rows:         number           (for textarea)
 *    maxFiles:     number
 *    maxSizeMB:    number
 *    className:    string
 *  }
 */
export default function Form({
    fields = [],
    values = {},
    onChange,
    onSubmit,
    errors: externalErrors = {},
    submitLabel = 'Submit',
    loading = false,
    className = '',
}) {
    const [internalErrors, setInternalErrors] = useState({});
    const errors = { ...internalErrors, ...externalErrors };

    const validate = () => {
        const errs = {};
        fields.forEach(f => {
            if (!f.required) return;
            const val = values[f.key];

            if (['image', 'images', 'document', 'documents', 'file', 'files'].includes(f.type)) {
                if (!val || val.length === 0) errs[f.key] = 'This field is required';
                return;
            }
            if (f.type === 'checkbox') {
                if (!val || val.length === 0) errs[f.key] = 'Select at least one option';
                return;
            }
            if (f.type === 'checkbox-toggle') {
                if (!val) errs[f.key] = 'This must be acknowledged';
                return;
            }
            if (val === undefined || val === null || val === '') {
                errs[f.key] = 'This field is required';
                return;
            }
            if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                errs[f.key] = 'Enter a valid email address';
                return;
            }
            if (f.type === 'url') {
                try { new URL(val); } catch {
                    errs[f.key] = 'Enter a valid URL (include https://)';
                }
            }
        });
        return errs;
    };

    const handleSubmit = (e) => {
        e?.preventDefault();
        const errs = validate();
        setInternalErrors(errs);
        if (Object.keys(errs).length === 0) onSubmit?.(values);
    };

    const handleChange = (key, val) => {
        onChange?.(key, val);
        if (internalErrors[key]) setInternalErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
    };

    const renderField = (f) => {
        // Separate key from the props so it doesn't get spread
        const { key, ...commonProps } = {
            key: f.key,
            label: f.label,
            required: f.required,
            error: errors[f.key],
            hint: f.hint,
            className: f.className,
            value: values[f.key] ?? '',
            onChange: (val) => handleChange(f.key, val),
        };

        switch (f.type) {
            case 'markdown':
                return <MarkdownField key={key} {...commonProps} placeholder={f.placeholder} />;
            case 'textarea':
                return <TextareaField key={key} {...commonProps} placeholder={f.placeholder} rows={f.rows} />;
            case 'dropdown':
                return <DropdownField key={key} {...commonProps} options={f.options} placeholder={f.placeholder} />;
            case 'radio':
                return <RadioField key={key} {...commonProps} options={f.options} />;
            case 'checkbox':
                return <CheckboxField key={key} {...commonProps} value={values[f.key] ?? []} options={f.options} />;
            case 'checkbox-toggle':
                return <CheckboxToggle key={key} {...commonProps} description={f.description} value={!!values[f.key]} />;
            case 'url':
                return <UrlField key={key} {...commonProps} placeholder={f.placeholder} />;
            case 'image':
                return <FileUploadField key={key} {...commonProps} value={values[f.key] ?? []} mode="image" multiple={false} maxSizeMB={f.maxSizeMB} />;
            case 'images':
                return <FileUploadField key={key} {...commonProps} value={values[f.key] ?? []} mode="image" multiple={true} maxFiles={f.maxFiles} maxSizeMB={f.maxSizeMB} />;
            case 'document':
                return <FileUploadField key={key} {...commonProps} value={values[f.key] ?? []} mode="document" multiple={false} maxSizeMB={f.maxSizeMB} />;
            case 'documents':
                return <FileUploadField key={key} {...commonProps} value={values[f.key] ?? []} mode="document" multiple={true} maxFiles={f.maxFiles} maxSizeMB={f.maxSizeMB} />;
            case 'file':
                return <FileUploadField key={key} {...commonProps} value={values[f.key] ?? []} mode="file" multiple={false} accept={f.accept} maxSizeMB={f.maxSizeMB} />;
            case 'files':
                return <FileUploadField key={key} {...commonProps} value={values[f.key] ?? []} mode="file" multiple={true} accept={f.accept} maxFiles={f.maxFiles} maxSizeMB={f.maxSizeMB} />;
            default:
                return <TextField key={key} {...commonProps} type={f.type ?? 'text'} placeholder={f.placeholder} />;
        }
    };

    const hasCols = fields.some(f => f.col);

    // Two-column grid: left col stacks normally, right col is a single flex column
    const renderTwoCol = () => {
        const leftFields = fields.filter(f => f.col === 'left');
        const rightFields = fields.filter(f => f.col === 'right');

        return (
            <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
                {/* Left column — stacked fields + submit pinned to bottom */}
                <div className="flex flex-col gap-4 min-h-0">
                    {leftFields.map(renderField)}
                    <div className="mt-auto">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-white text-black text-xs font-black rounded-xl uppercase tracking-widest transition-all shadow-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    Processing…
                                </>
                            ) : submitLabel}
                        </button>
                    </div>
                </div>

                {/* Right column — markdown editor stretches to fill */}
                <div className="flex flex-col min-h-0">
                    {rightFields.map(f => renderField({ ...f, className: `${f.className ?? ''} flex-1 flex flex-col min-h-0` }))}
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit} className={`${hasCols ? 'h-full flex flex-col' : 'space-y-5'} ${className}`} noValidate>
            {hasCols ? renderTwoCol() : (
                <>
                    {fields.map(renderField)}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 px-6 py-3 bg-white text-black text-xs font-black rounded-xl uppercase tracking-widest transition-all shadow-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Processing…
                            </>
                        ) : submitLabel}
                    </button>
                </>
            )}
        </form>
    );
}