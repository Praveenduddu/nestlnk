import { Link } from 'react-router-dom';
import type { PropertyBrief } from '../types';
import { useState, useRef, useEffect } from 'react';

interface Props {
    property: PropertyBrief;
    linkPrefix: string;
    showQuoteCount?: boolean;
    actionButton?: React.ReactNode;
    onEdit?: () => void;
    onClose?: () => void;
}

export default function PropertyCard({ property, linkPrefix, showQuoteCount = true, actionButton, onEdit, onClose }: Props) {
    const statusColor = property.status === 'OPEN' ? 'bg-emerald-500/10 text-emerald-400' : property.status === 'SHORTLISTED' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10 text-slate-500 dark:text-slate-400';
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isClosed = property.status === 'CLOSED';

    return (
        <div className="glass-card glass-card-hover rounded-2xl p-6 transition-all duration-300 group">
            <Link to={`${linkPrefix}/${property.id}`} className="block">
                <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400">{property.propertyType}</span>
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>{property.status === 'CLOSED' ? 'WITHDRAWN' : property.status}</span>
                        {(onEdit || onClose) && (
                            <div className="relative" ref={menuRef}>
                                <button 
                                    onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }}
                                    className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors flex items-center justify-center -mr-2"
                                >
                                    <span className="material-symbols-outlined text-sm">more_vert</span>
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#1E293B] rounded-xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden z-10 py-1">
                                        {onEdit && (
                                            <button 
                                                onClick={(e) => { e.preventDefault(); setMenuOpen(false); onEdit(); }}
                                                disabled={isClosed}
                                                className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-sm text-slate-400">edit</span> Edit
                                            </button>
                                        )}
                                        {onClose && (
                                            <button 
                                                onClick={(e) => { e.preventDefault(); setMenuOpen(false); onClose(); }}
                                                disabled={isClosed}
                                                className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-sm text-red-400">close</span> Close
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-slate-900 dark:text-white mb-1">
                    <span className="material-symbols-outlined text-lg text-slate-500 dark:text-slate-400">location_on</span>
                    <h3 className="font-semibold">{property.city}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-white dark:bg-slate-900/40 rounded-lg p-3">
                        <p className="text-xs text-slate-500 mb-0.5">Size</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{property.sizeSqft} sqft</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900/40 rounded-lg p-3">
                        <p className="text-xs text-slate-500 mb-0.5">Budget</p>
                        <p className="text-sm font-semibold text-gradient">₹{(property.budgetMin / 100000).toFixed(1)}L — ₹{(property.budgetMax / 100000).toFixed(1)}L</p>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-slate-500">{new Date(property.createdAt).toLocaleDateString()}</p>
                    {showQuoteCount && (
                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <span className="material-symbols-outlined text-sm">request_quote</span>
                            {property.quoteCount} quotes
                        </span>
                    )}
                </div>
            </Link>
            {actionButton && <div className="mt-4">{actionButton}</div>}
        </div>
    );
}
